import { buildSchema } from "type-graphql";
import { ApolloServer } from "apollo-server";
import mongoose from "mongoose";
import "reflect-metadata";
import { Container } from "typedi";
import { SnowflakeService } from "./services/SnowflakeService";

const PORT = process.env.PORT || 4000;
const snowflakeURL = process.env.SNOWFLAKE_URL || "http://localhost:8080";
const nodeId = process.env.NODE_ID || 0;

Container.set({id: "SNOWFLAKE_URL", factory: () => snowflakeURL});
Container.set({id: "NODE_ID", factory: () => nodeId});

async function bootstrap() {
    mongoose.connect("mongodb://localhost:27017/test", {useNewUrlParser: true});

    const schema = await buildSchema({
        resolvers: [__dirname + "/resolvers/*.{ts,js}"],
        container: Container
    });
    const server = new ApolloServer({
        schema,
        playground: true,
    });
    const { url } = await server.listen(PORT);
    console.log(`Server is running, GraphQL Playground available at ${url}`);
};

bootstrap().catch(e => console.log(e));