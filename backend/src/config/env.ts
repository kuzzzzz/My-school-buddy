import dotenv from 'dotenv';

dotenv.config();

const required = ['JWT_SECRET'];
required.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing env var: ${key}`);
  }
});

export const env = {
  port: Number(process.env.PORT ?? 4000),
  jwtSecret: process.env.JWT_SECRET as string,
  clientUrl: process.env.CLIENT_URL ?? 'http://localhost:5173',
  postgresUrl: process.env.POSTGRES_URL,
  neo4jUri: process.env.NEO4J_URI,
  neo4jUser: process.env.NEO4J_USER,
  neo4jPassword: process.env.NEO4J_PASSWORD
};
