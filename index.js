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
    name: 'Burek', size: 'big', breed: 'dog',
    age: 11, birthPlace: 'Cracow', ownerId: 1,
  },
  {
    name: 'Azor', size: 'medium', breed: 'dog',
    age: 6, birthPlace: 'Warsaw', ownerId: 2,
  },
  {
    name: 'Burek', size: 'small', breed: 'cat',
    age: 3, birthPlace: 'Berlin', ownerId: 2,
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
