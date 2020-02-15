import { Resolver, Mutation, Arg, Subscription, FieldResolver, Root, PubSub, Publisher } from "type-graphql";
import { Message, MessageModel } from "../models/Message";
import { MessageInput } from "./inputs/MessageInput";
import { DocumentType } from "@typegoose/typegoose";
import { Channel } from "../models/Channel";
import { ChannelModel } from "../models/Channel";


@Resolver(of => Message)
export default class MessageResolver {
    private id_count = 1000;

    @Mutation(returns => Message)
    async messageCreate(
        @PubSub("MESSAGE_CREATE") publish: Publisher<DocumentType<Message>>,
        @Arg("data") newMessage: MessageInput): Promise<DocumentType<Message>> {
        const message = new MessageModel({id: this.getID(), ...newMessage});
        const m = await message.save();
        await publish(m);
        return m;
    }

    @FieldResolver(returns => Channel)
    async channel(@Root() message: any) {
        return await ChannelModel.findById(message.channel);
    }

    @Subscription(returns => Message, {topics: "MESSAGE_CREATE"})
    messageCreateSubscription(@Root() message: DocumentType<Message>) {
        return message;
    }

    getID(): string {
        return `urn:1:${++this.id_count}`;
    }
}