
import * as express from 'express';
import * as bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import { makeExecutableSchema } from "graphql-tools";

// Some fake data
const books = [
	{
		title: "Harry Potter and the Sorcerer's stone",
		author: 'J.K. Rowling',
	},
	{
		title: 'Jurassic Park',
		author: 'Michael Crichton',
	},
];

// The GraphQL schema in string form
const typeDefs = `
  type Query { books: [Book] }
  type Book { title: String, author: String }
`;

// The resolvers
const resolvers = {
	Query: { books: () => books },
};

// Put together a schema
const schema = makeExecutableSchema({
	typeDefs,
	resolvers,
});

// initialize the server and configure support for ejs templates
const app: express.Express = express();

// bodyParser is needed just for POST.
app.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));

// start the server
const port = process.env.PORT || 3000;
const env = process.env.NODE_ENV || 'production';
app.listen(port, () => {
	console.info('Server listening on http://localhost:' + port + ', Ctrl+C to stop')
});

module.exports = app;
