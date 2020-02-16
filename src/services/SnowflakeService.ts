import { Service, Inject } from "typedi";
import axios from "axios";

@Service()
export class SnowflakeService {
    @Inject("SNOWFLAKE_URL")
    private readonly url: string;

    @Inject("NODE_ID")
    private readonly nodeId: string;

    async getSnowflake(): Promise<string> {
        return axios.get(this.url).then(response => `urn:${this.nodeId}:${response.data.snowflake}`);
    }
}