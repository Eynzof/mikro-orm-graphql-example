import express from 'express';
import 'express-async-errors';

import { Connection, IDatabaseDriver, MikroORM } from '@mikro-orm/core';
import bodyParser from 'body-parser';
import { PublisherType } from 'contracts/enums/publisherType.enum';
import cors from 'cors';
import { graphqlHTTP } from 'express-graphql';
import { GraphQLSchema } from 'graphql';
import expressPlayground from 'graphql-playground-middleware-express';
import { Server } from 'http';
import ormConfig from 'orm.config';
import { AuthorResolver } from 'resolvers/author.resolver';
import { BookResolver } from 'resolvers/book.resolver';
import { buildSchema, buildTypeDefsAndResolvers, registerEnumType } from 'type-graphql';
import { MyContext } from 'utils/interfaces/context.interface';
import { HelloResolver } from 'resolvers/hello.resolver';
import { Post } from 'entities/post.entity';
import { ApolloServer } from 'apollo-server';

import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
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
    // this.host = express();

    // if (process.env.NODE_ENV !== 'production') {
    //   this.host.get('/graphql', expressPlayground({ endpoint: '/graphql' }));
    // }

    // this.host.use(cors());
    const app = express();
    // 这一行允许 ApolloStudio 接管
    app.use(cors());
    app.use(express.json());

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
      });

      // succeeded
      this.insertTestData();

      const port = 4000;

      server.listen({ port }).then(({ url }) => {
        console.log(`🚀  Server ready at ${url}`);
      });

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      // this.host.use((error: Error, req: express.Request, res: express.Response, next: express.NextFunction): void => {
      //   console.error('📌 Something went wrong', error);
      //   res.status(400).send(error);
      // });

      // const port = process.env.PORT || 4000;
      // this.server = this.host.listen(port, () => {
      //   console.log(`🚀 http://localhost:${port}/graphql`);
      // });
    } catch (error) {
      console.error('📌 Could not start server', error);
    }
  };
}
