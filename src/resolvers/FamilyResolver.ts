import { Resolver, Query, Arg, ID, FieldResolver, Root, Mutation } from "type-graphql";
import { Family, FamilyModel } from "../models/Family";
import { DocumentType } from "@typegoose/typegoose";
import { Theater, TheaterModel } from "../models/Theater";
import { ChannelModel, Channel } from "../models/Channel";
import { FamilyInput } from "./inputs/FamilyInput";
import { Role } from "../models/Role";
import { Emoji } from "../models/Emoji";
import { SnowflakeService } from "../services/SnowflakeService";

@Resolver(of => Family)
export default class FamilyResolver {
    constructor(
        private readonly snowflakeService: SnowflakeService
    ) {}

    @Query(returns => Family, {nullable: true})
    async family(@Arg("id") id: string): Promise<DocumentType<Family>> {
        return FamilyModel.findOne({_id: id});
    }

    @FieldResolver(returns => [Theater])
    async theaters(@Root() family: DocumentType<Family>): Promise<DocumentType<Theater>[]> {
        return TheaterModel.find({_id: {$in: family.theaters}});
    }

    @FieldResolver(returns => [Channel])
    async channels(@Root() family: DocumentType<Family>): Promise<DocumentType<Channel>[]> {
        return ChannelModel.find({_id: {$in: family.channels}});
    }

    @Mutation(returns => Family)
    async familyCreate(@Arg("data") familyInput: FamilyInput): Promise<DocumentType<Family>> {
        const channels: DocumentType<Channel>[] = [];
        for (const channelInput of familyInput.channels) {
            channels.push(await this.snowflakeService.getSnowflake().then(id => {
                return new ChannelModel({_id: id, name: channelInput.name});
            }).then(channel => channel.save()));
        }
        const roles: Partial<Role>[] = [];
        for (const roleInput of familyInput.roles) {
            roles.push(await this.snowflakeService.getSnowflake().then(id => {return {id: id, ...roleInput};}));
        }
        const emojis: Partial<Emoji>[] = [];
        for (const emojiInput of familyInput.emojis) {
            emojis.push(await this.snowflakeService.getSnowflake().then(id => {return {id: id, ...emojiInput};}));
        }
        return this.snowflakeService.getSnowflake().then(id => new FamilyModel({
            id, name: familyInput.name, channels, roles, emojis, theaters: []
        })).then(family => family.save());
    }
}