// Configuração do Firebase (projeto gratuito - plano Spark).
// As chaves abaixo NAO sao secretas: o Firebase foi projetado para que a
// configuracao do app web fique visivel no codigo-fonte do cliente. A
// seguranca real vem das regras do Firestore (veja firestore.rules).
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyBNPwFHn3M3IjOOZ8spGR0HTLd0cvOJeoE',
  authDomain: 'trivia-93864.firebaseapp.com',
  projectId: 'trivia-93864',
  storageBucket: 'trivia-93864.firebasestorage.app',
  messagingSenderId: '729060433381',
  appId: '1:729060433381:web:5e68040b6289ba12aaa30c',
  measurementId: 'G-B13FQ4PLJT'
}

export const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
