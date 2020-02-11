import { InputType, Field } from "type-graphql";

@InputType()
export class ChannelInput {
    @Field()
    name: string;
}