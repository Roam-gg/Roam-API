import { graphql, GraphQLSchema } from "graphql";
import Maybe from "graphql/tsutils/Maybe";
import { buildSchema } from "type-graphql";
import Container from "typedi";


interface Options {
    source: string;
    variableValues?: Maybe<{[key: string]: any}>;
}

let schema: GraphQLSchema;

export const gCall = async ({source, variableValues}: Options) => {
    if (!schema) {
        schema = await buildSchema({
            resolvers: [__dirname + "/../resolvers/*.{ts,js}"],
            validate: false,
            container: Container
        });
    }
    return graphql({
        schema,
        source,
        variableValues
    });
};