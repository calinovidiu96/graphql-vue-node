// import express, { Express, Request, Response } from 'express';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

import { readFileSync } from 'fs';
import { resolvers } from './resolvers';

const dotenv = require('dotenv');

dotenv.config();

const typeDefs = readFileSync('./schema.graphql', 'utf-8');
const server = new ApolloServer({
	typeDefs,
	resolvers,
});

(async function () {
	const { url } = await startStandaloneServer(server, {
		listen: { port: 8000 },
	});
	console.log(`🚀  Server ready at: ${url}`);
})();
