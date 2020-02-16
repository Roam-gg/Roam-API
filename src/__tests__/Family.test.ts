import { mongoose } from "@typegoose/typegoose";
import faker from "faker";
import { ExecutionResult } from "graphql";
import { ExecutionResultDataDefault } from "graphql/execution/execute";

import { TheaterModel } from "../models/Theater";
import { ChannelModel } from "../models/Channel";
import { MessageModel } from "../models/Message";
import { FamilyModel } from "../models/Family";
import { FamilyInput } from "../resolvers/inputs/FamilyInput";
import { gCall } from "../test-utils/gCall";
import { Container } from "typedi";

beforeAll(async () => {
    await mongoose.connect("mongodb://localhost:27017/family_test", {useNewUrlParser: true, useUnifiedTopology: true});
    Container.set({id: "SNOWFLAKE_URL", factory: () => "http://localhost:8080"});
    Container.set({id: "NODE_ID", factory: () => 0});
});

afterAll(async () => {
    await mongoose.disconnect();
});

const familyCreateMutation = `
mutation CreateFamily($data: FamilyInput!) {
    familyCreate(data: $data) {
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
        theaters {
            id
            name
        }
        emojis {
            id
            name
            animated
            requireColons
            roles {
                id
                name
            }
        }
    }
}
`;

const familyQuery = `
query Family($id: String!) {
    family(id: $id) {
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
        theaters {
            id
            name
        }
        emojis {
            id
            name
            animated
            requireColons
            roles {
                id
                name
            }
        }
    }
}
`;


describe("Family", () => {
    beforeAll(async () => {
        await TheaterModel.deleteMany({});
        await ChannelModel.deleteMany({});
        await MessageModel.deleteMany({});
        await FamilyModel.deleteMany({});
    });
    const family: FamilyInput = {
        name: faker.lorem.word(),
        channels: [{name: faker.lorem.word()}],
        roles: [{
            name: faker.lorem.word(),
            colour: faker.internet.color(),
            permissions: faker.random.number(),
            mentionable: faker.random.boolean()
        }],
        emojis: [{
            name: faker.lorem.word(),
            requireColons: faker.random.boolean(),
            animated: faker.random.boolean()
        }]
    };
    let response: ExecutionResult<ExecutionResultDataDefault>;
    it("create family", async () => {
        response = await gCall({
            source: familyCreateMutation,
            variableValues: {data: family}
        });
        expect(response).toMatchObject({
            data: {
                familyCreate: {
                    name: family.name,
                    channels: family.channels,
                    roles: family.roles,
                    theaters: [],
                    emojis: family.emojis
                }
            }
        });
    });
    it("get family", async () => {
        const resp = await gCall({
            source: familyQuery,
            variableValues: {id: response.data.familyCreate.id}
        });
        expect(resp).toMatchObject({
            data: {
                family: {
                    id: response.data.familyCreate.id,
                    name: family.name,
                    channels: family.channels,
                    roles: family.roles,
                    theaters: [],
                    emojis: family.emojis
                }
            }
        });
    });
});