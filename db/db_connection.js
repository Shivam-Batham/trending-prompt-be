import mongoose from "mongoose";
import {
  database_connection_string,
  database_name,
} from "../config/database_config.js";
export default async function connectDB() {
  try {
    if (!database_connection_string || !database_name) {
      console.error(
        "DATABASE CONNECTION ERROR: Missing environment variables.",
      );
      process.exit(1);
    }
    const connection = await mongoose.connect(
      `${database_connection_string}/${database_name}`,
    );
    console.log(`DATABASE CONNECTED: ${connection.connection.host}`);
  } catch (error) {
    console.error(`DATABASE CONNECTION ERROR: ${error.message}`);
    process.exit(1);
  }
}
