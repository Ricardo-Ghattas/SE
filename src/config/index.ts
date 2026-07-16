import dotenv from "dotenv";
import path from "path";
import { DBMode } from "./types";

dotenv.config({ path: path.join(process.cwd(), ".env") });


export default {
    logDir: process.env.LOG_DIR || "./logs",
    isDev: process.env.NODE_ENV === 'development',
    storagePath: {
        csv: {
            cake: "src/data/cake orders.csv"
        },
        sqlite: "src/data/order.db"
    },
    port : process.env.PORT ? parseInt(process.env.PORT) : 3000,
    host: process.env.HOST || "localhost",
    dbMode: DBMode.SQLITE,


}
