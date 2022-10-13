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
    @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[];
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
    @Mutation(() => UserResponse)
    async register(
        @Arg('options', () => UsernamepasswordingInput)
        options: UsernamepasswordingInput,
        @Ctx() { em }: MyContext,
    ): Promise<UserResponse> {
        if (options.username.length <= 3) {
            return {
                errors: [
                    {
                        field: 'username',
                        message: 'Username must be more than 3 characters',
                    },
                ],
            };
        }

        if (options.password.length <= 3) {
            return {
                errors: [
                    {
                        field: 'password',
                        message: 'Password must be more than 3 characters',
                    },
                ],
            };
        }

        const hashedPassword = await argon2.hash(options.password);
        const user = em.create(User, {
            username: options.username,
            password: hashedPassword,
        });
        try {
            em.persistAndFlush(user);
        } catch (error) {
            console.log('--------------------------------');
            console.log(error);
            if (
                error.code == '23505' ||
                error.detail.includes('UniqueConstraintViolationException')
            ) {
                // duplicate username
                return {
                    errors: [
                        {
                            field: 'username',
                            message: 'username duplicate',
                        },
                    ],
                };
                console.log('message:', error.message);
            }
        }
        return { user };
    }

    @Mutation(() => UserResponse)
    async login(
        @Arg('options', () => UsernamepasswordingInput)
        options: UsernamepasswordingInput,
        @Ctx() { em }: MyContext,
    ): Promise<UserResponse> {
        {
            const user = await em.findOne(User, {
                username: options.username.toLowerCase(),
            });
            if (!user) {
                return {
                    errors: [
                        {
                            field: 'username',
                            message: 'User not found',
                        },
                    ],
                };
            }

            const valid = await argon2.verify(user.password, options.password);
            if (!valid) {
                return {
                    errors: [
                        {
                            field: 'password',
                            message: 'Invalid password',
                        },
                    ],
                };
            }

            return {
                user,
            };
        }
    }
}
