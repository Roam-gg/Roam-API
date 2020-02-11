import { InputType, Field, Int } from "type-graphql";


@InputType()
export class RoleInput {
    @Field()
    name: string;

    @Field(type => Int, {nullable: true})
    colour: number;

    @Field(type => Int)
    permissions: number;

    @Field({nullable: true})
    mentionable: boolean;
}