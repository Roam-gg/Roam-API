import { ObjectType, Field, Int } from "type-graphql";
import {prop as Property, getModelForClass} from "@typegoose/typegoose";

@ObjectType()
export class Role {
    @Field()
    readonly id: string;

    @Property({alias: "id"})
    readonly _id: string;

    @Field()
    @Property({required: true})
    name: string

    @Field()
    @Property({required: true, default: "#FFFFFF"})
    colour: string

    @Field(type => Int)
    @Property({required: true})
    permissions: number

    @Field()
    @Property({required: true, default: true})
    mentionable: boolean
}

export const RoleModel = getModelForClass(Role);