import { mongoose } from "@typegoose/typegoose";
import { graphql, ExecutionResult } from "graphql";
import { gCall } from "../test-utils/gCall";
import faker from "faker";
import { TheaterModel } from "../../src/models/Theater";
import { ChannelModel } from "../../src/models/Channel";
import { ExecutionResultDataDefault } from "graphql/execution/execute";
import { MessageModel } from "../models/Message";
import { TheaterInput } from "../resolvers/inputs/TheaterInput";

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
        icon
        banner
        families {
            id
            name
        }
        emojis {
            id
            name
            animated
            requireColons
            roles {
                id name
            }
        }
    }
}
`;

const theaterQuery = `
query Theater($id: String!) {
    theater(id: $id) {
        id 
        name
        channels {
            id
            name
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
        icon
        banner
        families {
            id
            name
        }
        emojis {
            id
            name
            requireColons
            animated
            roles {
                id
                name
            }
        }
    }
}
`;

describe("Theater", () => {
    beforeAll(async () => {
        await TheaterModel.deleteMany({});
        await ChannelModel.deleteMany({});
        await MessageModel.deleteMany({});
    });
    const theater: TheaterInput = {
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
        icon: faker.random.alphaNumeric(10),
        banner: faker.random.alphaNumeric(10),
        emojis: [{
            name: faker.lorem.word(),
            requireColons: faker.random.boolean(),
            animated: faker.random.boolean()
        }]
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
                    flairs: theater.flairs,
                    icon: theater.icon,
                    banner: theater.banner,
                    families: [],
                    emojis: theater.emojis
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
                    icon: theater.icon,
                    banner: theater.banner,
                    families: [],
                    emojis: theater.emojis
                }
            }
        });
    });
});