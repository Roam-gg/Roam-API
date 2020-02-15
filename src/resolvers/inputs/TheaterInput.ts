import { InputType, Field } from "type-graphql";
import { ChannelInput } from "./ChannelInput";
import { RoleInput } from "./RoleInput";


@InputType()
export class TheaterInput {
    @Field()
    name: string;

    @Field(type => [ChannelInput])
    channels: ChannelInput[];

    @Field(type => [RoleInput])
    roles: RoleInput[];
}