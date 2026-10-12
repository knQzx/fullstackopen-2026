import { useQuery } from '@apollo/client/react'
import { ALL_BOOKS, ME } from '../queries'
import BookTable from './BookTable'

const Recommend = ({ show }) => {
  const meResult = useQuery(ME)
  const favoriteGenre = meResult.data?.me?.favoriteGenre
  const booksResult = useQuery(ALL_BOOKS, {
    variables: { genre: favoriteGenre },
    skip: !favoriteGenre,
    fetchPolicy: 'cache-and-network',
  })

  if (!show) {
    return null
  }

  if (meResult.loading || !booksResult.data) {
    return <div>loading...</div>
  }

  return (
    <div>
      <h2>recommendations</h2>
      <p>
        books in your favorite genre <b>{favoriteGenre}</b>
      </p>
      <BookTable books={booksResult.data.allBooks} />
    </div>
  )
}

export default Recommend
