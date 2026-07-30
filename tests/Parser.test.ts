import { afterEach, describe, expect, it } from "@jest/globals";
import fs from "fs";
import os from "os";
import path from "path";
import { parseCSV, parseJSON, parseXML } from "../src/util/parser";

const temporaryFiles: string[] = [];

const temporaryFile = (extension: string, content: string): string => {
    const file = path.join(
        os.tmpdir(),
        `se-parser-${process.pid}-${temporaryFiles.length}.${extension}`
    );
    fs.writeFileSync(file, content);
    temporaryFiles.push(file);
    return file;
};

afterEach(() => {
    for (const file of temporaryFiles.splice(0)) {
        fs.unlinkSync(file);
    }
});

describe("parsing engines", () => {
    it("parses CSV data for positional mappers", async () => {
        const file = temporaryFile("csv", '"id","Type"\n"1","Cake"\n');
        await expect(parseCSV(file)).resolves.toEqual([
            ["id", "Type"],
            ["1", "Cake"]
        ]);
    });

    it("parses JSON records", async () => {
        const file = temporaryFile("json", '{"Book Title":"Clean Code"}');
        await expect(parseJSON(file)).resolves.toEqual({
            "Book Title": "Clean Code"
        });
    });

    it("parses XML records", async () => {
        const file = temporaryFile(
            "xml",
            "<data><row><Type>Puzzle</Type><Educational>No</Educational></row></data>"
        );
        await expect(parseXML(file)).resolves.toEqual({
            data: { row: { Type: "Puzzle", Educational: "No" } }
        });
    });

    it("rejects malformed JSON", async () => {
        const file = temporaryFile("json", '{"broken":');
        await expect(parseJSON(file)).rejects.toBeInstanceOf(SyntaxError);
    });

    it("rejects malformed XML", async () => {
        const file = temporaryFile("xml", "<data><row></data>");
        await expect(parseXML(file)).rejects.toThrow("Malformed XML");
    });
});
