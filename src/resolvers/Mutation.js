const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { APP_SECRET, getUserId } = require('../utils')

function post(parent, args, context, info) {
    const userId = getUserId(context)
    return context.prisma.createLink({
      url: args.url,
      description: args.description,
      postedBy: { connect: { id: userId } },
    })
  }

function updateLink(parent, args, context, info){
    const userId = getUserId(context)
    return context.prisma.updateLink({
        id: args.id,
        url: args.url,
        description: args.description,
        postedBy: { connect: {id: userId}}
    })
}

function deleteLink(parent, args, context, info){
    return context.prisma.deleteLink({
        id: args.id
    })
}

async function signup(parent, args, context, info){
    const password = await bcrypt.hash(args.password, 10)
    const user = await context.prisma.createUser({...args, password})
    const token = jwt.sign({userId: user.id}, APP_SECRET)
    
    return{
        token,
        user
    }
}

async function login(parent, args, context, info){
    const user = await context.prisma.user({email: args.email})
    if(!user){
        throw new Error('No such user found')
    }

    const valid = await bcrypt.compare(args.password, user.password)
    if(!valid){
        throw new Error('Invalid Password')
    }

    const token = jwt.sign({userId: user.id}, APP_SECRET)

    return{
        token,
        user
    }
}

module.exports = {
    signup,
    login,
    post,
    updateLink,
    deleteLink
}
