import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.1/firebase-app.js'
import { getFirestore, collection, addDoc, serverTimestamp, doc, deleteDoc, onSnapshot } from 'https://www.gstatic.com/firebasejs/9.0.1/firebase-firestore.js'

const firebaseConfig = {
  apiKey: 'AIzaSyD5CadhF17Lu5Atsoi4Ax7-jqkfPj3b36Y',
  authDomain: 'testing-firebase-82bce.firebaseapp.com',
  projectId: 'testing-firebase-82bce',
  storageBucket: 'testing-firebase-82bce.appspot.com',
  messagingSenderId: '864668311375',
  appId: '1:864668311375:web:88ac1633e6263d9ee2ef3a',
  measurementId: 'G-E15H4ZZ00E'
}


const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const collectionGames = collection(db, 'games')

const formAddGame = document.querySelector('[data-js="add-game-form"]')
const gamesList = document.querySelector('[data-js="games-list"]')
const buttonUnsub = document.querySelector('[data-js="unsub"]')

let optionsDate = {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric'
}
/**
 *  ou a options pode ser assim: 
 *  {dateStyle: 'short', timeStyle: 'short'}
 */

const log = (...value) => console.log(...value)

const getFormattedDate = createdAt => new Intl
  .DateTimeFormat("pt-BR", optionsDate)
  .format(createdAt.toDate()).replace(',', ' ')


const sanitize = string => DOMPurify.sanitize(string)

const renderGame = (docChange) => {
  const [id, { title, developedBy, createdAt }] = [docChange.doc.id, docChange.doc.data()]

  const liGame = document.createElement('li')
  liGame.setAttribute('data-id', id)
  liGame.setAttribute('class', 'my-4')

  const h5 = document.createElement('h5')
  h5.textContent = sanitize(title)

  const ul = document.createElement('ul')

  const liDevelopedBy = document.createElement('li')
  liDevelopedBy.textContent = `Desenvolvido pot ${sanitize(developedBy)}`

  if (createdAt) {
    const liDate = document.createElement('li')
    liDate.textContent = `Adicionado no banco em ${getFormattedDate(createdAt)}`
    ul.append(liDate)
  }

  const button = document.createElement('button')
  button.textContent = 'Remover'
  button.setAttribute('data-remove', id)
  button.setAttribute('class', 'btn btn-danger btn-sm')

  ul.append(liDevelopedBy)
  liGame.append(h5, ul, button)
  gamesList.append(liGame)
}

const renderGamesList = snapShot => {
  if (snapShot.metadata.hasPendingWrites) {
    return
  }

  snapShot.docChanges().forEach(docChange => {
    if (docChange.type === "removed") {
      const liGame = document.querySelector(`[data-id="${docChange.doc.id}"]`)
      liGame.remove()
      return
    }

    renderGame(docChange)
  })
}

const to = promise => promise
  .then(result => [null, result])
  .catch(error => [error])

const addGame = async e => {
  e.preventDefault()

  const [error, doc] = await to(
    addDoc(collectionGames, {
      title: sanitize(e.target.title.value),
      developedBy: sanitize(e.target.developer.value),
      createdAt: serverTimestamp()
    }))

  if (error) {
    return console.log(error)
  }

  console.log('Document criado com o ID', doc.id)
  e.target.reset()
  e.target.elements.title.focus()
}

const deleteGame = async e => {
  const idRemoveButton = e.target.dataset.remove

  if (!idRemoveButton) {
    return
  }

  const [error] = await to(deleteDoc(doc(db, 'games', idRemoveButton)))

  if (error) {
    return console.log(error)
  }

  console.log('game removido')
}

const unsubscribe = onSnapshot(collectionGames, renderGamesList)
formAddGame.addEventListener('submit', addGame)
gamesList.addEventListener('click', deleteGame)
buttonUnsub.addEventListener('click', unsubscribe)

/*
  05

  - Refatore o código da última aula.

  Algumas dicas do que você pode implementar:
    - Funções de responsabilidade única;
    - Usar async/await no lugar de promises;
    - Remover a mutação de valores dentro do reduce.
*/