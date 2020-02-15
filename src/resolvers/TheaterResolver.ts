import { Resolver, Query, Arg, Mutation, FieldResolver, Root } from "type-graphql";
import { Theater, TheaterModel } from "../models/Theater";
import { TheaterInput } from "./inputs/TheaterInput";
import { ChannelModel, Channel } from "../models/Channel";
import { DocumentType } from "@typegoose/typegoose";
import { Role } from "../models/Role";
import { Family, FamilyModel } from "../models/Family";
import { Flair } from "../models/Flair";

@Resolver(of => Theater)
export default class TheaterResolver {
    private id_count = 0;

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
            const channel = new ChannelModel({id: `urn:1:${this.newID()}`, name: channelInput.name});
            await channel.save();
            channels.push(channel.id);
        }
        const roles: Partial<Role>[] = [];
        for (const roleInput of theaterInput.roles) {
            roles.push({id: `urn:1:${this.newID()}`, ...roleInput});
        }
        const flairs: Partial<Flair>[] = [];
        for (const flairInput of theaterInput.flairs) {
            flairs.push({id: `urn:1:${this.newID()}`, ...flairInput});
        }
        const theater = new TheaterModel({id: `urn:1:${this.newID()}`, name: theaterInput.name, channels, roles, flairs, families: []});
        return await theater.save();
    }


    newID() {
        return this.id_count++;
    }
}