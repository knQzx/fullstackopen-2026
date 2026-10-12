import { useState } from 'react'
import { useQuery } from '@apollo/client/react'
import { ALL_BOOKS, ALL_GENRES } from '../queries'
import BookTable from './BookTable'

const Books = (props) => {
  const [genre, setGenre] = useState(null)
  const result = useQuery(ALL_BOOKS, {
    variables: { genre },
    fetchPolicy: 'cache-and-network',
  })
  const genresResult = useQuery(ALL_GENRES)

  if (!props.show) {
    return null
  }

  if (result.loading && !result.data) {
    return <div>loading...</div>
  }

  const genres = genresResult.data ? genresResult.data.allGenres : []

  return (
    <div>
      <h2>books</h2>
      {genre && (
        <p>
          in genre <b>{genre}</b>
        </p>
      )}
      <BookTable books={result.data.allBooks} />
      <div>
        {genres.map((g) => (
          <button key={g} onClick={() => setGenre(g)}>
            {g}
          </button>
        ))}
        <button onClick={() => setGenre(null)}>all genres</button>
      </div>
    </div>
  )
}

export default Books
