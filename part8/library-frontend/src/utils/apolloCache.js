import { ALL_BOOKS } from '../queries'

const addToQuery = (cache, genre, bookToAdd) => {
  cache.updateQuery({ query: ALL_BOOKS, variables: { genre } }, (data) => {
    if (!data) {
      return data
    }
    if (data.allBooks.some((book) => book.id === bookToAdd.id)) {
      return data
    }
    return { allBooks: data.allBooks.concat(bookToAdd) }
  })
}

export const addBookToCache = (cache, bookToAdd) => {
  addToQuery(cache, null, bookToAdd)
  bookToAdd.genres.forEach((genre) => addToQuery(cache, genre, bookToAdd))
}
