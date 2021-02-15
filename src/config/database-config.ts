import { mongodbStoreDatabase } from "../database";

export const setup = async () => {
    await mongodbStoreDatabase.connect();
}

export default {
    setup,
}