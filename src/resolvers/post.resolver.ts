import { Post } from 'entities/post.entity';
import { Arg, Ctx, Int, Mutation, Query, Resolver } from 'type-graphql';
import { MyContext } from 'utils/types/types.js';

@Resolver()
export class PostResolver {
    @Query(() => [Post])
    public async posts(@Ctx() { em }: MyContext): Promise<Post[]> {
        return em.find(Post, {});
    }
    @Query(() => Post, { nullable: true })
    public async post(
        @Arg('id') id: number,
        @Ctx() { em }: MyContext,
    ): Promise<Post | null> {
        return em.findOne(Post, { id });
    }

    @Mutation(() => Post)
    public async createPost(
        @Arg('title') title: string,
        @Ctx() { em }: MyContext,
    ): Promise<Post> {
        const post = em.create(Post, { title });
        await em.persistAndFlush(post);
        return post;
    }

    @Mutation(() => Post, { nullable: true })
    public async updatePost(
        @Arg('id') id: number,
        @Arg('title', { nullable: true }) title: string,
        @Ctx() { em }: MyContext,
    ): Promise<Post | null> {
        const post = em.findOne(Post, { id });
        if (!post) {
            return null;
        }
        await em.persistAndFlush(post);
        return post;
    }
}
