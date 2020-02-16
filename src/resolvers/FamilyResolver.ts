import { Resolver, Query, Arg, ID, FieldResolver, Root, Mutation } from "type-graphql";
import { Family, FamilyModel } from "../models/Family";
import { DocumentType } from "@typegoose/typegoose";
import { Theater, TheaterModel } from "../models/Theater";
import { ChannelModel, Channel } from "../models/Channel";
import { FamilyInput } from "./inputs/FamilyInput";
import { Role } from "../models/Role";
import { Emoji } from "../models/Emoji";

@Resolver(of => Family)
export default class FamilyResolver {
    private id_count = 3000;

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
            const channel = new ChannelModel({id: `urn:1:${this.newID()}`, name: channelInput.name});
            channels.push(await channel.save());
        }
        const roles: Partial<Role>[] = [];
        for (const roleInput of familyInput.roles) {
            roles.push({id: `urn:1:${this.newID()}`, ...roleInput});
        }
        const emojis: Partial<Emoji>[] = [];
        for (const emojiInput of familyInput.emojis) {
            emojis.push({id: `urn:1:${this.newID()}`, ...emojiInput, roles: []});
        }
        return new FamilyModel({
            id: `urn:1:${this.newID()}`,
            name: familyInput.name,
            channels: channels,
            roles: roles,
            theaters: [],
            emojis: emojis
        }).save();
    }

    newID() {
        return this.id_count++;
    }
}