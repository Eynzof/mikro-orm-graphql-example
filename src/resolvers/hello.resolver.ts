import { Query, Resolver } from 'type-graphql';

@Resolver(() => String)
export class HelloResolver {
    @Query(() => String)
    public async hello() {
        return 'hello world';
    }
}
