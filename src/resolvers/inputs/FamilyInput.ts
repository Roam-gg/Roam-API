import { InputType, Field } from "type-graphql";
import { RoleInput } from "./RoleInput";
import { ChannelInput } from "./ChannelInput";
import { EmojiInput } from "./EmojiInput";


@InputType()
export class FamilyInput {
    @Field()
    name: string;

    @Field(type => [RoleInput])
    roles: RoleInput[];

    @Field(type => [ChannelInput])
    channels: ChannelInput[];

    @Field(type => [EmojiInput])
    emojis: EmojiInput[];
}