const {GraphQLServer} = require('graphql-yoga');
const {prisma} = require('./generated/prisma-client')

// let links = [{
//     id: 'link-0',
//     url: 'www.howtographql.com',
//     description: 'Fullstack tutorial for GraphQL'
// }]

// let idCount = links.length
const resolvers = {
    Query:{
        info: () => `This is the API of a hackernew clone`,
        feed: (root, args, context, info) => {
            return context.prisma.links()
        }
    },

    Mutation:{
        post: (root, args, context) => {
            return context.prisma.createLink({
                url: args.url,
                description: args.description
            })
        },
        updateLink: (root, args, context) => {
            return context.prisma.updateLink({
                data: {
                    url: args.url,
                    description: args.description
                },
                where: {
                    id: args.id
                }
            })
        },
        deleteLink: (root, args, context) => {
            return context.prisma.deleteLink({
                id: args.id
            })
        }
    }
}

const server = new GraphQLServer({
    typeDefs: './schema.graphql',
    resolvers,
    context: {prisma},
})

server.start(() => console.log("Server is running at port 4000"))

