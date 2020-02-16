import { mongoose } from "@typegoose/typegoose";
import { TheaterModel } from "../models/Theater";
import { ChannelModel } from "../models/Channel";
import { ExecutionResult } from "graphql";
import { ExecutionResultDataDefault } from "graphql/execution/execute";
import { gCall } from "../test-utils/gCall";
import faker from "faker";
import { MessageModel } from "../models/Message";

beforeAll(async () => {
    await mongoose.connect("mongodb://localhost:27017/message_test", {useNewUrlParser: true, useUnifiedTopology: true});
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

const messageCreateMutation = `
mutation CreateMessage($data: MessageInput!) {
    messageCreate(data: $data) {
        id
        content
        channel {
            id
            name
        }
    }
}
`;

describe("Test messages", () => {
    let theater: ExecutionResult<ExecutionResultDataDefault>;
    beforeAll(async () => {
        await TheaterModel.deleteMany({});
        await ChannelModel.deleteMany({});
        await MessageModel.deleteMany({});
        theater = await gCall({
            source: theaterCreateMutation,
            variableValues: {data: {
                name: faker.lorem.word(),
                channels: [{name: faker.lorem.word()}],
                roles: [],
                flairs: [],
                emojis: []
            }}
        });
    });

    it("Create Message", async () => {
        const messageContent = faker.lorem.words();
        const message = await gCall({
            source: messageCreateMutation,
            variableValues: {data: {
                channel: theater.data.theaterCreate.channels[0].id,
                content: messageContent
            }}
        });
        expect(message).toMatchObject({
            data: {
                messageCreate: {
                    content: messageContent,
                    channel: theater.data.theaterCreate.channels[0]
                }
            }
        });
    });
});