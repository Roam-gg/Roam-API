import { Resolver, Query, Arg, Mutation, FieldResolver, Root } from "type-graphql";
import { Theater, TheaterModel } from "../models/Theater";
import { TheaterInput } from "./inputs/TheaterInput";
import _ from "lodash";
import { ChannelModel, Channel } from "../models/Channel";
import { DocumentType } from "@typegoose/typegoose";
import { Role } from "../models/Role";
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
        // any type as `channels` doesn't exist when using Theater...
        const ret = await ChannelModel.find({
            "_id": { $in: theater.channels}
        });
        return ret;
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
        return this.snowflakeService.getSnowflake().then(id => new TheaterModel({
            _id: id,
            name: theaterInput.name,
            channels: channels,
            roles: roles
        })).then(theater => theater.save());
    }
}