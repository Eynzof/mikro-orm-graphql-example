import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { Field, ObjectType } from 'type-graphql';
// import { v4 } from 'uuid';

@ObjectType()
@Entity()
export class Post {
  @Field()
  @PrimaryKey()
  id!: number;

  @Field()
  @Property()
  title!: string;

  @Field()
  @Property({ default: 'NOW()' })
  createdAt: Date = new Date();

  @Field()
  @Property({ default: 'NOW()', onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
