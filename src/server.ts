
import * as express from 'express';
import * as bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import { makeExecutableSchema } from "graphql-tools";


const typeDefs = [`
type Query {
  hello: String
}

schema {
  query: Query
}`];

const resolvers = {
	Query: {
		hello(root) {
			return 'world';
		}
	}
};

const schema = makeExecutableSchema({ typeDefs, resolvers });





// initialize the server and configure support for ejs templates
const app: express.Express = express();

// bodyParser is needed just for POST.
app.use('/v1', bodyParser.json(), graphqlExpress({ schema }));
app.use('/v1-doc', graphiqlExpress({ endpointURL: '/graphql' }));

// start the server
const port = process.env.PORT || 3000;
const env = process.env.NODE_ENV || 'production';
app.listen(port, () => {
	console.info('Server listening on http://localhost:' + port + ', Ctrl+C to stop')
});

module.exports = app;
