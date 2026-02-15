import neo4j, { Driver } from 'neo4j-driver';
import { env } from './env';

let driver: Driver | null = null;

if (env.neo4jUri && env.neo4jUser && env.neo4jPassword) {
  driver = neo4j.driver(env.neo4jUri, neo4j.auth.basic(env.neo4jUser, env.neo4jPassword));
}

export const neo4jDriver = driver;
