import { mongoose } from "@typegoose/typegoose";
import { graphql, ExecutionResult } from "graphql";
import { gCall } from "../test-utils/gCall";
import faker from "faker";
import { TheaterModel } from "../../src/models/Theater";
import { ChannelModel } from "../../src/models/Channel";
import { ExecutionResultDataDefault } from "graphql/execution/execute";
import { MessageModel } from "../models/Message";

beforeAll(async () => {
    await mongoose.connect("mongodb://localhost:27017/theater_test", {useNewUrlParser: true, useUnifiedTopology: true});
});

afterAll(async () => {
    await mongoose.disconnect();
});

const theaterCreateMutation = `
mutation CreateTheater($data: TheaterInput!) {
    theaterCreate(data: $data) {
        id
        name
        channels {
            id
            name
        }
        roles {
            id
            name
            colour
            permissions
            mentionable
        }
        flairs {
            id
            name
            colour
        }
        banner
    }
}
`;

const theaterQuery = `
query Theater($id: String!) {
    theater(id: $id) {
        id name
        channels {
            id name
        }
        roles {
            id name
            colour
            permissions
            mentionable
        }
        flairs {
            id
            name
            colour
        }
        banner
    }
}
`;

describe("Theater", () => {
    beforeAll(async () => {
        await TheaterModel.deleteMany({});
        await ChannelModel.deleteMany({});
        await MessageModel.deleteMany({});
    });
    const theater = {
        name: faker.lorem.word(),
        channels: [{name: faker.lorem.word()}],
        roles: [{
            name: faker.lorem.word(),
            colour: faker.internet.color(),
            permissions: faker.random.number(),
            mentionable: faker.random.boolean()
        }],
        flairs: [{
            name: faker.lorem.word(),
            colour: faker.internet.color()
        }],
        banner: faker.random.alphaNumeric(10)
    };
    let response: ExecutionResult<ExecutionResultDataDefault>;
    it("create theater", async () => {
        response = await gCall({
            source: theaterCreateMutation,
            variableValues: {data: theater}
        });
        expect(response).toMatchObject({
            data: {
                theaterCreate: {
                    name: theater.name,
                    channels: theater.channels,
                    roles: theater.roles,
                    banner: theater.banner
                }
            }
        });
    });
    it("get theater", async () => {
        const resp = await gCall({
            source: theaterQuery,
            variableValues: {id: response.data.theaterCreate.id}
        });
        expect(resp).toMatchObject({
            data: {
                theater: {
                    id: response.data.theaterCreate.id,
                    name: theater.name,
                    channels: theater.channels,
                    roles: theater.roles,
                    flairs: theater.flairs,
                    banner: theater.banner
                }
            }
        });
    });
});