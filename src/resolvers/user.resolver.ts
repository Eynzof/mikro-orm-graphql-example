import { User } from 'entities/user.entity';
import {
    Arg,
    Ctx,
    Field,
    InputType,
    Mutation,
    Query,
    Resolver,
} from 'type-graphql';
import { MyContext } from 'utils/types/types';

@InputType()
class UsernamepasswordingInput {
    @Field()
    username: string;
    @Field(() => String)
    password: string;
}

@Resolver(() => String)
export class UserResolver {
    @Mutation(() => String)
    register(
        @Arg('options') options: UsernamepasswordingInput,
        @Ctx() { em }: MyContext,
    ) {
        const user = em.create(User, { username: options.username });
        em.persistAndFlush(user);
        return 'test';
    }
}
