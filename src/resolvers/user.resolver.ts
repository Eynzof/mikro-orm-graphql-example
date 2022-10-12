import { User } from 'entities/user.entity';
import {
    Arg,
    Ctx,
    Field,
    InputType,
    Mutation,
    ObjectType,
    Query,
    Resolver,
} from 'type-graphql';
import { MyContext } from 'utils/types/types';
import argon2 from 'argon2';

@InputType()
class UsernamepasswordingInput {
    @Field()
    username: string;
    @Field(() => String)
    password: string;
}

@ObjectType()
class UserResponse {
    @Field(() => [Error], { nullable: true })
    errors?: Error[];
    @Field(() => User, { nullable: true })
    user?: User;
}

@ObjectType()
class FieldError {
    @Field()
    field: string;
    @Field()
    message: string;
}

@Resolver()
export class UserResolver {
    @Mutation(() => User)
    async register(
        @Arg('options', () => UsernamepasswordingInput)
        options: UsernamepasswordingInput,
        @Ctx() { em }: MyContext,
    ) {
        const hashedPassword = await argon2.hash(options.password);
        const user = em.create(User, {
            username: options.username,
            password: hashedPassword,
        });
        em.persistAndFlush(user);
        return user;
    }

    @Mutation(() => User)
    async login(
        @Arg('options', () => UsernamepasswordingInput)
        options: UsernamepasswordingInput,
        @Ctx() { em }: MyContext,
    ) {
        const user = em.findOne(User, {
            username: options.username.toLowerCase(),
        });

        em.persistAndFlush(user);
        return user;
    }
}
