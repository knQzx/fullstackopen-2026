const _ = require('lodash')

const dummy = () => 1

const totalLikes = (blogs) => blogs.reduce((sum, blog) => sum + blog.likes, 0)

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  }
  return blogs.reduce((best, blog) => (blog.likes > best.likes ? blog : best))
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null
  }
  const counts = _.countBy(blogs, 'author')
  const author = _.maxBy(Object.keys(counts), (a) => counts[a])
  return { author, blogs: counts[author] }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null
  }
  const likesByAuthor = _(blogs)
    .groupBy('author')
    .map((authorBlogs, author) => ({ author, likes: totalLikes(authorBlogs) }))
    .value()
  return _.maxBy(likesByAuthor, 'likes')
}

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes }
