import { prop as Property, getModelForClass, Ref, arrayProp } from "@typegoose/typegoose";
import { ObjectType, Field } from "type-graphql";
import { Theater } from "./Theater";
import { Role } from "./Role";
import { Channel } from "./Channel";

@ObjectType()
export class Family{
    @Field()
    readonly id: string;

    @Property({alias: "id"})
    readonly _id: string;

    @Field()
    @Property({ required: true, minlength: 2, maxlength: 100 })
    name!: string;

    @Field(type => [Theater])
    @arrayProp({type: String, ref: "Theater"})
    theaters: Ref<Theater>[];

    @Field(type => [Role])
    @arrayProp({type: Role})
    roles!: Role[];

    @Field(type => [Channel])
    @arrayProp({type: String, ref: Channel})
    channels!: Ref<Channel>[];
}

export const FamilyModel = getModelForClass(Family);