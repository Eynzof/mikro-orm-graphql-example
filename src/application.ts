import express from 'express';
import 'express-async-errors';

import { Connection, IDatabaseDriver, MikroORM } from '@mikro-orm/core';
import { PublisherType } from 'contracts/enums/publisherType.enum';
import cors from 'cors';
import { Server } from 'http';
import ormConfig from 'orm.config';
import { AuthorResolver } from 'resolvers/author.resolver';
import { BookResolver } from 'resolvers/book.resolver';
import { buildTypeDefsAndResolvers, registerEnumType } from 'type-graphql';
import { MyContext } from 'utils/interfaces/context.interface';
import { HelloResolver } from 'resolvers/hello.resolver';
import { Post } from 'entities/post.entity';
import { ApolloServer } from 'apollo-server-express';

import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
// import { resolvers, typeDefs } from 'minimal-apollo-setup';

// TODO: create service for this
registerEnumType(PublisherType, {
  name: 'PublisherType',
  description: 'Type of the publisher',
});

export default class Application {
  public orm: MikroORM<IDatabaseDriver<Connection>>;
  public host: express.Application;
  public server: Server;

  public connect = async (): Promise<void> => {
    try {
      this.orm = await MikroORM.init(ormConfig);
      const migrator = this.orm.getMigrator();
      const migrations = await migrator.getPendingMigrations();
      if (migrations && migrations.length > 0) {
        await migrator.up();
      }
    } catch (error) {
      console.error('📌 Could not connect to the database', error);
      throw Error(error);
    }
  };

  private insertTestData = async () => {
    await this.orm.em.nativeInsert(Post, { title: 'first' });
  };

  public init = async (): Promise<void> => {
    const app = express();
    // 这一行允许 ApolloStudio 接管
    app.use(cors());

    try {
      const { typeDefs, resolvers } = await buildTypeDefsAndResolvers({
        resolvers: [BookResolver, AuthorResolver, HelloResolver],
      });

      const server = new ApolloServer({
        typeDefs,
        resolvers,
        csrfPrevention: true,
        cache: 'bounded',
        plugins: [ApolloServerPluginLandingPageLocalDefault({ embed: true })],
        context: () => ({ em: this.orm.em.fork() }),
      });

      // succeeded
      this.insertTestData();

      const port = 4000;

      await server.start();
      server.applyMiddleware({ app });

      app.listen(port, () => {
        console.log(`server listening on port ${port}`);
      });
    } catch (error) {
      console.error('📌 Could not start server', error);
    }
  };
}
