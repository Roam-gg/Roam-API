import { InputType, Field } from "type-graphql";
import { ChannelInput } from "./ChannelInput";
import { RoleInput } from "./RoleInput";
import { FlairInput } from "./FlairInput";
import { EmojiInput } from "./EmojiInput";


@InputType()
export class TheaterInput {
    @Field()
    name: string;

    @Field(type => [ChannelInput])
    channels: ChannelInput[];

    @Field(type => [RoleInput])
    roles: RoleInput[];

    @Field(type => [FlairInput])
    flairs: FlairInput[];

    @Field({nullable: true})
    icon: string;

    @Field({ nullable: true })
    banner: string;

    @Field(type => [EmojiInput])
    emojis: EmojiInput[];
}