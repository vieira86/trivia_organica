import { doc, getDoc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { generateRoomCode, normalizeRoomCode } from './roomCode'
import { getCellArea, BOARD_SIZE } from '../data/boardPath'
import { pickRandomQuestion, RECENT_QUESTIONS_WINDOW, QUESTIONS } from '../data/questions'
import { resolveMove, rollDice, applyHazardEffect } from '../utils/gameLogic'
import { PLAYER_COLORS } from '../data/playerColors'
import { generateHazardLayout, getHazard } from '../data/hazards'

const MAX_PLAYERS = 4
const MAX_HISTORY = 20

function playerIdKey(code) {
  return `ludo-online-${code}-player-id`
}

export function getOrCreatePlayerId(code) {
  const key = playerIdKey(code)
  let id = localStorage.getItem(key)
  if (!id) {
    id = (crypto.randomUUID ? crypto.randomUUID() : `p-${Date.now()}-${Math.random().toString(36).slice(2)}`)
    localStorage.setItem(key, id)
  }
  return id
}

function appendHistory(history = [], message) {
  return [...history, { message, at: Date.now() }].slice(-MAX_HISTORY)
}

function roomRef(code) {
  return doc(db, 'rooms', normalizeRoomCode(code))
}

export async function createRoom({ name }) {
  let code = generateRoomCode()
  // Evita colisao improvavel de codigo ja existente.
  for (let attempt = 0; attempt < 5; attempt++) {
    const snap = await getDoc(roomRef(code))
    if (!snap.exists()) break
    code = generateRoomCode()
  }

  const playerId = getOrCreatePlayerId(code)
  const player = { id: playerId, name, color: PLAYER_COLORS[0].value, position: 0, score: 0, finished: false }

  await setDoc(roomRef(code), {
    code,
    status: 'waiting',
    players: [player],
    currentPlayerIndex: 0,
    diceValue: null,
    question: null,
    recentQuestionIds: [],
    // Sorteada uma vez, na criação da sala: fica fixa durante essa partida.
    hazards: generateHazardLayout(BOARD_SIZE),
    history: appendHistory([], `${name} criou a sala`),
    winnerId: null,
    createdAt: Date.now(),
    updatedAt: Date.now()
  })

  return { code, playerId }
}

export async function joinRoom(rawCode, { name }) {
  const code = normalizeRoomCode(rawCode)
  const ref = roomRef(code)
  const snap = await getDoc(ref)
  if (!snap.exists()) {
    throw new Error('room_not_found')
  }
  const data = snap.data()
  const playerId = getOrCreatePlayerId(code)
  const existing = data.players.find(p => p.id === playerId)

  if (existing) {
    return { code, playerId }
  }
  if (data.status !== 'waiting') {
    throw new Error('room_already_started')
  }
  if (data.players.length >= MAX_PLAYERS) {
    throw new Error('room_full')
  }
  if (data.players.some(p => p.name.toLowerCase() === name.toLowerCase())) {
    throw new Error('name_taken')
  }

  const color = PLAYER_COLORS[data.players.length % PLAYER_COLORS.length].value
  const newPlayer = { id: playerId, name, color, position: 0, score: 0, finished: false }
  await updateDoc(ref, {
    players: [...data.players, newPlayer],
    history: appendHistory(data.history, `${name} entrou na sala`),
    updatedAt: Date.now()
  })

  return { code, playerId }
}

export function subscribeRoom(code, onData, onError) {
  return onSnapshot(
    roomRef(code),
    snap => {
      if (!snap.exists()) {
        onError?.(new Error('room_not_found'))
        return
      }
      onData(snap.data())
    },
    err => onError?.(err)
  )
}

export async function startGame(code) {
  const ref = roomRef(normalizeRoomCode(code))
  const snap = await getDoc(ref)
  if (!snap.exists()) return
  const data = snap.data()
  if (data.players.length < 2) return
  await updateDoc(ref, {
    status: 'playing',
    history: appendHistory(data.history, 'A partida começou!'),
    updatedAt: Date.now()
  })
}

/** O jogador da vez rola o dado e sorteia a pergunta da area em que vai cair. */
export async function rollForTurn(code, playerId) {
  const ref = roomRef(normalizeRoomCode(code))
  const snap = await getDoc(ref)
  if (!snap.exists()) return
  const data = snap.data()
  if (data.status !== 'playing') return
  if (data.question) return
  const currentPlayer = data.players[data.currentPlayerIndex]
  if (!currentPlayer || currentPlayer.id !== playerId) return

  const value = rollDice()
  const landing = Math.min(currentPlayer.position + value, BOARD_SIZE)
  const hazard = getHazard((data.hazards || {})[landing])

  if (hazard) {
    // Casa-armadilha: resolve na hora, sem pergunta, e passa a vez.
    const finalPosition = applyHazardEffect(landing, hazard)
    const idx = data.currentPlayerIndex
    const nextIndex = (idx + 1) % data.players.length
    const newPlayers = data.players.map((p, i) => (i === idx ? { ...p, position: finalPosition } : p))

    await updateDoc(ref, {
      players: newPlayers,
      diceValue: value,
      question: null,
      currentPlayerIndex: nextIndex,
      history: appendHistory(data.history, `${currentPlayer.name} tirou ${value} e caiu em ${hazard.label} — foi parar na casa ${finalPosition}`),
      lastEvent: { type: 'hazard', hazardId: hazard.id, playerName: currentPlayer.name, at: Date.now() },
      updatedAt: Date.now()
    })
    return
  }

  const area = getCellArea(landing)
  const question = pickRandomQuestion(data.recentQuestionIds || [], area)

  await updateDoc(ref, {
    diceValue: value,
    question: { id: question.id, area, forPlayerId: playerId },
    recentQuestionIds: [...(data.recentQuestionIds || []), question.id].slice(-RECENT_QUESTIONS_WINDOW),
    history: appendHistory(data.history, `${currentPlayer.name} tirou ${value} no dado`),
    updatedAt: Date.now()
  })
}

export function getQuestionById(id) {
  return QUESTIONS.find(q => q.id === id) ?? null
}

/** O jogador da vez responde a pergunta sorteada. Acertando ou errando, a vez
 *  passa para o proximo jogador (o outro lado e' avisado automaticamente via onSnapshot). */
export async function submitAnswer(code, playerId, correct) {
  const ref = roomRef(normalizeRoomCode(code))
  const snap = await getDoc(ref)
  if (!snap.exists()) return
  const data = snap.data()
  if (!data.question || data.question.forPlayerId !== playerId) return

  const idx = data.currentPlayerIndex
  const player = data.players[idx]

  if (!correct) {
    const nextIndex = (idx + 1) % data.players.length
    await updateDoc(ref, {
      question: null,
      diceValue: null,
      currentPlayerIndex: nextIndex,
      history: appendHistory(data.history, `${player.name} errou a pergunta — vez de ${data.players[nextIndex].name}`),
      lastEvent: { type: 'wrong', playerName: player.name, at: Date.now() },
      updatedAt: Date.now()
    })
    return
  }

  const result = resolveMove(player.position, data.diceValue)
  const newPlayers = data.players.map((p, i) => (
    i === idx ? { ...p, position: result.position, score: p.score + result.points, finished: result.won } : p
  ))

  // Cada jogador joga uma vez por rodada: acertando ou errando, a vez passa adiante.
  const nextIndex = (idx + 1) % data.players.length

  const updates = {
    players: newPlayers,
    question: null,
    diceValue: null,
    currentPlayerIndex: nextIndex,
    history: appendHistory(data.history, `${player.name} acertou e avançou para a casa ${result.position} — vez de ${newPlayers[nextIndex].name}`),
    lastEvent: { type: 'correct', playerName: player.name, at: Date.now() },
    updatedAt: Date.now()
  }

  if (result.won) {
    updates.status = 'finished'
    updates.winnerId = player.id
  }

  await updateDoc(ref, updates)
}

export async function leaveRoomCleanup() {
  // Mantido simples de proposito: salas antigas nao usadas nao custam nada no
  // plano gratuito do Firestore; nao ha necessidade de limpeza automatica.
}
