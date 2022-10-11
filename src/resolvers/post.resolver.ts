import { Post } from '../entities/post.entity.js';
import { Ctx, Query, Resolver } from 'type-graphql';
import { MyContext } from 'utils/types/types.js';

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  public async posts(@Ctx() { em }: MyContext): Promise<Post[]> {
    return em.find(Post, {});
  }
}
