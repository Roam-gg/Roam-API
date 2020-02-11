import { Resolver, Query, Arg, Mutation, FieldResolver, Root } from "type-graphql";
import { Theater, TheaterModel } from "../models/Theater";
import { TheaterInput } from "./inputs/TheaterInput";
import _ from "lodash";
import { ChannelModel, Channel } from "../models/Channel";
import { DocumentType } from "@typegoose/typegoose";
import { Role } from "../models/Role";

@Resolver(of => Theater)
export default class TheaterResolver {
    private id_count: number = 0;

    @Query(returns => Theater, {nullable: true})
    async theater(@Arg("id") id: string): Promise<DocumentType<Theater>> {
        return await TheaterModel.findOne({id: id});
    }

    @FieldResolver(returns => [Channel])
    async channels(@Root() theater: DocumentType<Theater>): Promise<DocumentType<Channel>[]> {
        // any type as `channels` doesn't exist when using Theater...
        const ret = await ChannelModel.find({
            "_id": { $in: theater.channels}
        });
        console.log(ret);
        return ret;
    }

    @Mutation(returns => Theater)
    async theaterCreate(@Arg("theater") theaterInput: TheaterInput): Promise<DocumentType<Theater>> {
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
        console.log(channels);
        console.log(roles);
        const theater = new TheaterModel({id: `urn:1:${this.newID()}`, name: theaterInput.name, channels: channels, roles: roles});
        console.log(theater);
        return await theater.save();
    }


    newID() {
        return this.id_count++;
    }
}