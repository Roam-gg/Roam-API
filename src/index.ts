import { buildSchema } from "type-graphql";
import { ApolloServer } from "apollo-server";
import mongoose from "mongoose";
import "reflect-metadata";

const PORT = process.env.PORT || 4000;

async function bootstrap() {
    mongoose.connect("mongodb://localhost:27017/test", {useNewUrlParser: true});

    const schema = await buildSchema({
        resolvers: [__dirname + "/resolvers/*.{ts,js}"]
    });
    const server = new ApolloServer({
        schema,
        playground: true,
    });
    const { url } = await server.listen(PORT);
    console.log(`Server is running, GraphQL Playground available at ${url}`);
};

bootstrap().catch(e => console.log(e));