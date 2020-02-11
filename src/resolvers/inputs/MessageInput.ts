import { InputType, Field } from "type-graphql";


@InputType()
export class MessageInput {
    @Field()
    channel: string;

    @Field()
    content: string;
}