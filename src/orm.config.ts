import { MikroORM } from '@mikro-orm/core';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';

export default {
    migrations: {
        path: './src/migrations',
        tableName: 'migrations',
        transactional: true,
    },
    tsNode: process.env.NODE_DEV === 'true' ? true : false,
    user: 'postgres',
    password: 'postgres',
    dbName: 'mikro-orm-graphql-data',
    host: 'localhost',
    port: 5432,
    entities: ['dist/**/*.entity.js'],
    entitiesTs: ['src/**/*.entity.ts'],
    type: 'postgresql',
    allowGlobalContext: true,
    logger: console.log.bind(console),
    debug: true,
    highlighter: new SqlHighlighter(),
} as Parameters<typeof MikroORM.init>[0];
