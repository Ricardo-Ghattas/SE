import { afterEach, describe, expect, it } from "@jest/globals";
import fs from "fs";
import os from "os";
import path from "path";
import { parseCSV, writeCSVFile } from "../src/util/parser";

const temporaryFiles: string[] = [];

afterEach(async () => {
    await Promise.all(temporaryFiles.splice(0).map((file) => fs.promises.unlink(file).catch(() => undefined)));
});

describe("CSV parser", () => {
    it("preserves commas, quotes, and newlines inside quoted fields", async () => {
        const file = path.join(os.tmpdir(), `orders-${Date.now()}.csv`);
        temporaryFiles.push(file);
        await fs.promises.writeFile(file, 'id,message\n1,"hello, world"\n2,"two\nlines"\n', "utf8");

        await expect(parseCSV(file)).resolves.toEqual([
            ["id", "message"],
            ["1", "hello, world"],
            ["2", "two\nlines"],
        ]);
    });

    it("round-trips CSV data", async () => {
        const file = path.join(os.tmpdir(), `orders-${Date.now()}.csv`);
        temporaryFiles.push(file);
        const rows = [["id", "message"], ["1", "a, b"]];

        await writeCSVFile(file, rows);

        await expect(parseCSV(file)).resolves.toEqual(rows);
    });
});
