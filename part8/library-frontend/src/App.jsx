import { useState } from 'react'
import { useApolloClient, useSubscription } from '@apollo/client/react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import Recommend from './components/Recommend'
import { BOOK_ADDED } from './queries'
import { addBookToCache } from './utils/apolloCache'

const Notify = ({ message }) => {
  if (!message) {
    return null
  }
  return <div style={{ color: 'red' }}>{message}</div>
}

const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(localStorage.getItem('library-user-token'))
  const [errorMessage, setErrorMessage] = useState(null)
  const client = useApolloClient()

  useSubscription(BOOK_ADDED, {
    onData: ({ data, client }) => {
      const addedBook = data.data.bookAdded
      window.alert(`${addedBook.title} by ${addedBook.author.name} added`)
      addBookToCache(client.cache, addedBook)
    },
  })

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => setErrorMessage(null), 5000)
  }

  const login = (newToken) => {
    setToken(newToken)
    setPage('authors')
  }

  const logout = () => {
    setToken(null)
    localStorage.removeItem('library-user-token')
    client.clearStore()
    setPage('authors')
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {token ? (
          <>
            <button onClick={() => setPage('add')}>add book</button>
            <button onClick={() => setPage('recommend')}>recommend</button>
            <button onClick={logout}>logout</button>
          </>
        ) : (
          <button onClick={() => setPage('login')}>login</button>
        )}
      </div>

      <Notify message={errorMessage} />

      <Authors show={page === 'authors'} loggedIn={!!token} />

      <Books show={page === 'books'} />

      <NewBook show={page === 'add'} setError={notify} />

      {token && <Recommend show={page === 'recommend'} />}

      <LoginForm show={page === 'login'} setToken={login} setError={notify} />
    </div>
  )
}

export default App
