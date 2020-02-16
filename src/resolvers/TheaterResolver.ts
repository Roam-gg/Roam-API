import { Resolver, Query, Arg, Mutation, FieldResolver, Root } from "type-graphql";
import { Theater, TheaterModel } from "../models/Theater";
import { TheaterInput } from "./inputs/TheaterInput";
import { ChannelModel, Channel } from "../models/Channel";
import { DocumentType } from "@typegoose/typegoose";
import { Role } from "../models/Role";
import { Family, FamilyModel } from "../models/Family";
import { Flair } from "../models/Flair";
import { Emoji } from "../models/Emoji";
import { SnowflakeService } from "../services/SnowflakeService";

@Resolver(of => Theater)
export default class TheaterResolver {
    constructor(
        private readonly snowflakeService: SnowflakeService
    ) {}

    @Query(returns => Theater, {nullable: true})
    async theater(@Arg("id") id: string): Promise<DocumentType<Theater>> {
        return await TheaterModel.findOne({_id: id});
    }

    @FieldResolver(returns => [Channel])
    async channels(@Root() theater: DocumentType<Theater>): Promise<DocumentType<Channel>[]> {
        const ret = await ChannelModel.find({
            "_id": { $in: theater.channels}
        });
        return ret;
    }

    @FieldResolver(returns => [Family])
    async families(@Root() theater: DocumentType<Theater>): Promise<DocumentType<Family>[]> {
        return FamilyModel.find({"_id": {$in: theater.families}});
    }

    @Mutation(returns => Theater)
    async theaterCreate(@Arg("data") theaterInput: TheaterInput): Promise<DocumentType<Theater>> {
        const channels: DocumentType<Channel>[] = [];
        for (const channelInput of theaterInput.channels) {
            channels.push(await this.snowflakeService.getSnowflake().then(id => {
                return new ChannelModel({_id: id, name: channelInput.name});
            }).then(channel => channel.save()));
        }
        const roles: Partial<Role>[] = [];
        for (const roleInput of theaterInput.roles) {
            roles.push(await this.snowflakeService.getSnowflake().then(id => {return {_id: id, ...roleInput};}));
        }
        const flairs: Partial<Flair>[] = [];
        for (const flairInput of theaterInput.flairs) {
            flairs.push(await this.snowflakeService.getSnowflake().then(id => {return {_id: id, ...flairInput};}));
        }
        const emojis: Partial<Emoji>[] = [];
        for (const emojiInput of theaterInput.emojis) {
            emojis.push(await this.snowflakeService.getSnowflake().then(id => {return {_id: id, ...emojiInput, roles: []};}));
        }
        return this.snowflakeService.getSnowflake().then(id => new TheaterModel({
            _id: id,
            name: theaterInput.name,
            channels,
            roles,
            flairs,
            icon: theaterInput.icon,
            banner: theaterInput.banner, 
            families: [],
            emojis: emojis
        })).then(theater => theater.save());
    }
}