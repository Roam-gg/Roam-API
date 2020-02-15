import { InputType, Field } from "type-graphql";



@InputType()
export class FlairInput {
    @Field()
    name: string;

    @Field({nullable: true})
    colour: string;
}