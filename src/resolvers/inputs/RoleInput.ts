import { InputType, Field, Int } from "type-graphql";


@InputType()
export class RoleInput {
    @Field()
    name: string;

    @Field({nullable: true})
    colour: string;

    @Field(type => Int)
    permissions: number;

    @Field({nullable: true})
    mentionable: boolean;
}