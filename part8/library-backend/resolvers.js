const { GraphQLError } = require('graphql')
const { PubSub } = require('graphql-subscriptions')
const jwt = require('jsonwebtoken')
const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')

const pubsub = new PubSub()

const requireUser = (context) => {
  if (!context.currentUser) {
    throw new GraphQLError('not authenticated', {
      extensions: { code: 'UNAUTHENTICATED' },
    })
  }
}

const saveOrThrow = async (doc, message, invalidArgs) => {
  try {
    return await doc.save()
  } catch (error) {
    throw new GraphQLError(message, {
      extensions: { code: 'BAD_USER_INPUT', invalidArgs, error },
    })
  }
}

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      const filter = {}
      if (args.author) {
        const author = await Author.findOne({ name: args.author })
        if (!author) {
          return []
        }
        filter.author = author._id
      }
      if (args.genre) {
        filter.genres = args.genre
      }
      return Book.find(filter).populate('author')
    },
    allAuthors: async () => {
      const authors = await Author.find({})
      const counts = await Book.aggregate([
        { $group: { _id: '$author', count: { $sum: 1 } } },
      ])
      const countByAuthor = new Map(counts.map((c) => [c._id.toString(), c.count]))
      return authors.map((author) => ({
        ...author.toObject(),
        id: author._id.toString(),
        bookCount: countByAuthor.get(author._id.toString()) ?? 0,
      }))
    },
    allGenres: async () => Book.distinct('genres'),
    me: (root, args, context) => context.currentUser,
  },
  Author: {
    bookCount: async (root) => root.bookCount ?? Book.countDocuments({ author: root._id ?? root.id }),
  },
  Mutation: {
    addBook: async (root, args, context) => {
      requireUser(context)

      const existingAuthor = await Author.findOne({ name: args.author })
      const author = existingAuthor ?? new Author({ name: args.author })
      const book = new Book({ ...args, author: author._id })

      try {
        await author.validate()
        await book.validate()
      } catch (error) {
        throw new GraphQLError(`Saving book failed: ${error.message}`, {
          extensions: { code: 'BAD_USER_INPUT', invalidArgs: [args.title, args.author], error },
        })
      }

      if (!existingAuthor) {
        await saveOrThrow(author, 'Saving author failed', args.author)
      }
      await saveOrThrow(book, 'Saving book failed', args.title)

      const savedBook = await book.populate('author')
      pubsub.publish('BOOK_ADDED', { bookAdded: savedBook })
      return savedBook
    },
    editAuthor: async (root, args, context) => {
      requireUser(context)

      const author = await Author.findOne({ name: args.name })
      if (!author) {
        return null
      }
      author.born = args.setBornTo
      return saveOrThrow(author, 'Editing author failed', args.name)
    },
    createUser: async (root, args) => {
      const user = new User({ username: args.username, favoriteGenre: args.favoriteGenre })
      return saveOrThrow(user, 'Creating the user failed', args.username)
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if (!user || args.password !== 'secret') {
        throw new GraphQLError('wrong credentials', {
          extensions: { code: 'BAD_USER_INPUT' },
        })
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    },
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterableIterator('BOOK_ADDED'),
    },
  },
}

module.exports = resolvers
