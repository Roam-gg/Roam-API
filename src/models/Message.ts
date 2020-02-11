import { ObjectType, Field} from "type-graphql";
import { prop as Property, getModelForClass, Ref } from "@typegoose/typegoose";
import { Channel } from "./Channel";

@ObjectType()
export class Message {
    @Field()
    readonly id: string;

    @Property({alias: "id"})
    readonly _id!: string;

    @Field()
    @Property({required: true, maxlength: 2000})
    content!: string;

    @Field(type => Channel)
    @Property({required: true, ref: Channel, type: String})
    channel!: Ref<Channel>;
}

export const MessageModel = getModelForClass(Message);