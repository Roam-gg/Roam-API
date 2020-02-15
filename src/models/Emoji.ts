import { ObjectType, Field, Int } from "type-graphql";
import {prop as Property, arrayProp} from "@typegoose/typegoose";
import { Role } from "./Role";

@ObjectType()
export class Emoji {

    @Field()
    readonly id!: string;

    @Property({alias: "id"})
    readonly _id!: string;

    @Field()
    @Property({ required: true, minlength: 2, maxlength: 100})
    name!: string;

    @Field(type => [Role])
    @arrayProp({type: Role})
    roles!: Role[];

    //jackmcadam3@gmail.com, TokakuTokisaki 
    //TODO: @Field(type => Ego)
    //@Property(type: Ego)
    //ego!: Ego;

    @Field()
    @Property()
    require_colons: boolean;

    @Field()
    @Property()
    animated: boolean;
}