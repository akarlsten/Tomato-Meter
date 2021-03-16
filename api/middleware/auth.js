const authenticate = (req, res, next) => {
  try {
    const token = req.header('Authorization')

    if (!token) {
      throw new Error('No token found, you are not my web thing!')
    }

    const trimmedToken = token.replace('Bearer ', '') // dirty

    if (trimmedToken !== process.env.TOKEN) {
      throw new Error('Invalid token!')
    }

    next()
  } catch (e) {
    res.status(401).send({ message: 'Only the web thing can upload measurements.' })
  }
}

export default authenticate
