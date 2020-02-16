import { Resolver, Mutation, Arg, Subscription, FieldResolver, Root, PubSub, Publisher } from "type-graphql";
import { Message, MessageModel } from "../models/Message";
import { MessageInput } from "./inputs/MessageInput";
import { DocumentType } from "@typegoose/typegoose";
import { Channel } from "../models/Channel";
import { ChannelModel } from "../models/Channel";
import { Service } from "typedi";
import { SnowflakeService } from "../services/SnowflakeService";


@Service()
@Resolver(of => Message)
export default class MessageResolver {
    constructor(
        private readonly snowflakeService: SnowflakeService
    ) {}

    @Mutation(returns => Message)
    async messageCreate(
        @PubSub("MESSAGE_CREATE") publish: Publisher<DocumentType<Message>>,
        @Arg("data") newMessage: MessageInput): Promise<DocumentType<Message>> {
            const message = this.snowflakeService.getSnowflake().then(id => new MessageModel({id: `urn:1:${id}`, ...newMessage}).save());
        await publish(await message);
        return message;
    }

    @FieldResolver(returns => Channel)
    async channel(@Root() message: any) {
        return await ChannelModel.findById(message.channel);
    }

    @Subscription(returns => Message, {topics: "MESSAGE_CREATE"})
    messageCreateSubscription(@Root() message: DocumentType<Message>) {
        return message;
    }
}