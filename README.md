# 🧪 Elementar — O Quiz de Química

Jogo de tabuleiro educativo em React: uma corrida de tabuleiro onde cada casa
pertence a uma área da Química — **Geral, Inorgânica, Analítica, Físico-Química, Orgânica e
Bioquímica** — cada uma com sua cor. Jogue no mesmo aparelho (modo local) ou
**online**, cada jogador na sua própria casa, com sincronização em tempo real
via Firebase.

## Como jogar

1. Role o dado e ande o número de casas sorteado.
2. Responda a pergunta da área em que você caiu (a cor da casa indica a área).
3. Acertando ou errando (ou se o tempo esgotar), a vez passa para o próximo jogador.
4. O primeiro a completar as 50 casas vence.

Algumas casas são **armadilhas** (ácido sulfúrico, ácido nítrico, contaminação
radioativa) — caem em posições sorteadas a cada nova partida, mas ficam fixas
durante aquele jogo. Quem cai numa delas sofre o efeito na hora (volta algumas
casas, ou direto para o início), sem pergunta, e a vez já passa.

No modo online, a cada jogada o outro jogador é avisado automaticamente que
chegou a vez dele (a tela dele atualiza sozinha, com som e um aviso "Sua
vez!" — inclusive uma notificação do navegador se ele estiver em outra aba).

Use o **Modo Estudo** para revisar todas as perguntas, por área, sem pressão
de tempo.

## Rodando localmente

```bash
npm install
npm run dev
```

Abra `http://localhost:5173`.

### Testes

```bash
npm test
```

## Modo online (multiplayer remoto)

O modo online usa o **Firebase Firestore** (plano gratuito "Spark", sem
custo) para sincronizar a partida entre os dois navegadores em tempo real.
A configuração já está em `src/firebase.js`, apontando para o projeto
Firebase deste jogo.

Se quiser usar seu **próprio** projeto Firebase (por exemplo, para ter seu
próprio banco de dados):

1. Crie um projeto gratuito em [console.firebase.google.com](https://console.firebase.google.com/).
2. Em **Build → Firestore Database**, crie um banco (modo de teste já serve).
3. Em **Configurações do projeto → Geral → Seus aplicativos**, registre um
   app Web e copie o objeto `firebaseConfig`.
4. Cole esse objeto em `src/firebase.js`, no lugar do `firebaseConfig` atual.
5. Nas regras do Firestore, cole o conteúdo de `firestore.rules` (na raiz
   deste projeto).

As chaves do Firebase que ficam em `src/firebase.js` **não são secretas** —
o Firebase foi projetado para que essa configuração fique visível no código
do app. A segurança real vem das regras do Firestore.

## Deploy automático no GitHub Pages

Este projeto já vem com um workflow (`.github/workflows/deploy.yml`) que,
a cada `git push` na branch `main`, builda o projeto e publica
automaticamente no GitHub Pages.

Para ativar (uma vez só):

1. No GitHub, vá em **Settings → Pages** do repositório.
2. Em "Build and deployment", selecione **Source: GitHub Actions**.
3. Faça um push para `main` — o workflow builda e publica sozinho.
4. O link do site aparece em **Settings → Pages** (algo como
   `https://<usuario>.github.io/<repositorio>/`).

## Estrutura do projeto

```
src/
├── components/        # Telas e peças de UI (tabuleiro, dado, perguntas...)
├── online/            # Cliente do Firestore (salas, sincronização de turnos)
├── data/
│   ├── boardPath.js   # Layout do tabuleiro + área de cada casa
│   ├── questions.js   # Banco de perguntas (todas as áreas) + AREAS/cores
│   └── playerColors.js
├── utils/
│   ├── gameLogic.js   # Regras puras (movimento, pontuação)
│   ├── sound.js       # Efeitos sonoros (Web Audio API)
│   └── storage.js     # Progresso salvo em localStorage (modo local)
├── firebase.js         # Configuração do Firebase
└── App.jsx
```

## Adicionando perguntas

Edite `src/data/questions.js` e adicione um objeto ao array `QUESTIONS`:

```javascript
{
  id: 93, // número único
  area: 'geral', // 'geral' | 'inorganica' | 'analitica' | 'fisico-quimica' | 'organica' | 'bioquimica'
  category: 'Subtema (aparece como badge)',
  difficulty: 'facil', // 'facil' | 'medio' | 'dificil'
  question: 'Sua pergunta aqui?',
  options: ['Opção A (correta)', 'Opção B', 'Opção C', 'Opção D'],
  correct: 0, // índice da resposta correta
  explanation: 'Explicação exibida depois de responder.'
}
```

## Tecnologias

- React 19 + Vite
- Tailwind CSS
- Firebase Firestore (modo online)
- Vitest (testes)
- GitHub Actions (deploy automático)

## Autor

**Prof. Rafael Vieira** — rafael.vieira@ifro.edu.br
