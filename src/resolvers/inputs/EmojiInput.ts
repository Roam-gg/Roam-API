import { InputType, Field } from "type-graphql";

@InputType()
export class EmojiInput {
    @Field()
    name: string;

    @Field()
    requireColons: boolean;

    @Field()
    animated: boolean;
}