import 'dotenv/config';
import { ConnectionOptions, createConnections } from 'typeorm';
import * as path from 'path';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

function database(name: string): ConnectionOptions {
  return {
    name: name,
    type: <'mysql'>process.env.DATABASE_TYPE,
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: name,
    entities: [path.join(__dirname, name, '/entity/*.js')],
    namingStrategy: new SnakeNamingStrategy(),
  };
}

export const createTypeOrmConnections = async function() {
  await createConnections([
    database('supervisor'),
  ]);
};