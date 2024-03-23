import { readFile } from "fs/promises";
import { moduleLogger } from "@sliit-foss/module-logger";
import mongoose from "mongoose";
import config from "../../src/config";

const logger = moduleLogger("mongo-connector");

export const connectMongo = async () => {
  try {
    await mongoose.connect(config.DB_TEST_URL);

    mongoose.connection.on("connected", () => {
      logger.info(`connected to the test mongodb`);
    });

    const jsonData = await readFile("./test/util/initial-script.json", "utf-8");
    const data = JSON.parse(jsonData);

    for (const modelName in data) {
      const Model = mongoose.model(modelName);
      const documents = data[modelName];

      if (documents && Array.isArray(documents)) {
        await Model.insertMany(documents);
        logger.info(`Inserted data for model ${modelName}`);
      }
    }

    process.on("exit", () => mongoose.disconnect());
  } catch (error) {
    logger.error(`Error connecting to MongoDB: ${error.message}`);
  }
};
