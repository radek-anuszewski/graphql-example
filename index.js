const { ApolloServer, gql } = require("apollo-server");

const types = gql`
  type Animal {
    id: ID!
    name: String!
    birthPlace: String
    nicknames: [String]
    owner: Owner!
  }
  
  type Owner {
    id: Int!
    name: String!
  }

  input OwnerInput {
    name: String!
  }
  
  type Query {
    animals: [Animal]
    owners: [Owner]
    animal(name: String!): Animal
    owner(id: Int!): Owner
  }
  
  type Mutation {
    createOwner(owner: OwnerInput!): Owner!
  }
`

const owners = [
  {
    id: 1,
    name: 'Radek 1',
  },
  {
    id: 2,
    name: 'Radek 2',
  },
]

const animals = [
  {
    id: 1,
    name: 'Burek',
    birthPlace: 'Cracow',
    ownerId: 1,
    nicknames: ['Bury'],
  },
  {
    id: 2,
    name: 'Azor',
    birthPlace: 'Warsaw',
    ownerId: 1,
    nicknames: ['Azorek', 'Maly'],
  },
  {
    id: 1,
    name: 'Reksio',
    birthPlace: 'Cracow',
    ownerId: 2,
    nicknames: [],
  },
];

const resolvers = {
  Query: {
    animals: () => animals,
    owners: () => owners,
    animal: (parent, args, context, info) => animals
      .find(animal => animal.name === args.name),
    owner: (parent, args, context, info) => owners
      .find(el => el.id === args.id)
  },
  Animal: {
    owner: (parent, args, context, info) => owners
      .find(el => el.id === parent.ownerId)
  },
  Mutation: {
    createOwner: (parent, args, context, info) => {
      let owner = {...args.owner, id: owners.length + 1};
      owners.push(owner);
      return owner;
    }
  }
}

const server = new ApolloServer({
  typeDefs: types,
  resolvers,
})

server.listen()
  .then(({url}) => console.log(`Server url: ${url}`))
