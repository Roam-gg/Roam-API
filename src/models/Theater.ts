import {prop as Property, Ref, arrayProp, getModelForClass} from "@typegoose/typegoose";
import {Channel} from "./Channel";
import { ObjectType, Field } from "type-graphql";
import { Role } from "./Role";
import { Flair } from "./Flair";

@ObjectType()
export class Theater {

    @Field()
    readonly id!: string;

    @Property({alias: "id"})
    readonly _id!: string;

    @Field()
    @Property({ required: true, minlength: 2, maxlength: 100})
    name!: string;

    @Field(type => [Channel])
    @arrayProp({type: String, ref: Channel})
    channels!: Ref<Channel>[];

    @Field(type => [Role])
    @arrayProp({type: Role})
    roles!: Role[];

    @Field(type => [Flair])
    @arrayProp({type: Flair})
    flairs!: Flair[];

    @Field()
    @Property()
    icon: string[];
}


export const TheaterModel = getModelForClass(Theater);