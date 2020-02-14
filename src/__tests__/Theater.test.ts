import { mongoose } from "@typegoose/typegoose"
import { graphql, ExecutionResult } from "graphql";
import { gCall } from "../test-utils/gCall";
import faker from 'faker';
import { TheaterModel } from "../../src/models/Theater";
import { ChannelModel } from "../../src/models/Channel";
import { ExecutionResultDataDefault } from "graphql/execution/execute";

beforeAll(async () => {
    await mongoose.connect("mongodb://localhost:27017/test", {useNewUrlParser: true});
    await TheaterModel.remove({});
    await ChannelModel.remove({});
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
    }
}
`

describe('Theater', () => {
    const theater = {
        name: faker.lorem.word(),
        channels: [{name: faker.lorem.word()}],
        roles: [{
            name: faker.lorem.word(),
            colour: faker.internet.color(),
            permissions: faker.random.number(),
            mentionable: faker.random.boolean()
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
                    roles: theater.roles
                }
            }
        });
    });
    it("get theater", async () => {
        console.log(response.data.theaterCreate.id)
        let resp = await gCall({
            source: theaterQuery,
            variableValues: {id: response.data.theaterCreate.id}
        });
        console.log(resp);
        expect(resp).toMatchObject({
            data: {
                theater: {
                    id: response.data.theaterCreate.id,
                    name: theater.name,
                    channels: theater.channels,
                    roles: theater.roles
                }
            }
        })
    });
})