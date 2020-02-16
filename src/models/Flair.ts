import { ObjectType, Field, Int } from "type-graphql";
import {prop as Property} from "@typegoose/typegoose";

@ObjectType()
export class Flair {
    @Field()
    readonly id: string;

    @Property({alias: "id"})
    readonly _id: string;

    @Field()
    @Property({requied: true})
    name!: string;

    @Field()
    @Property({required: true, default: "#FFFFFF"})
    colour: string;
}