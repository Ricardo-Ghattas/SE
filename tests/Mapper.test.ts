import { describe, expect, it } from "@jest/globals";
import { CSVCakeMapper } from "../src/mappers/Cake.mapper";
import { JSONBookMapper } from "../src/mappers/Book.mapper";
import { XMLToyMapper } from "../src/mappers/Toy.mapper";

describe("Mappers", () => {
    it("maps parsed CSV data to a Cake", () => {
        const cake = new CSVCakeMapper().map([
            "1", "Birthday", "Chocolate", "Cream", "20", "2",
            "Buttercream", "Vanilla", "Sprinkles", "Blue",
            "Happy Birthday", "Round", "None", "Chocolate chips",
            "Box", "50", "1"
        ]);

        expect(cake.getType()).toBe("Birthday");
        expect(cake.getSize()).toBe(20);
        expect(cake.getLayers()).toBe(2);
    });

    it("maps parsed JSON data to a Book", () => {
        const book = new JSONBookMapper().map({
            "Book Title": "Clean Code",
            "Author": "Robert C. Martin",
            "Genre": "Software",
            "Format": "Paperback",
            "Language": "English",
            "Publisher": "Prentice Hall",
            "Special Edition": "First Edition",
            "Packaging": "Standard",
            "Price": "0",
            "Quantity": "0"
        });

        expect(book.getTitle()).toBe("Clean Code");
        expect(book.getPrice()).toBe(0);
        expect(book.getQuantity()).toBe(0);
    });

    it("maps parsed XML data to a Toy", () => {
        const toy = new XMLToyMapper().map({
            "Type": "Puzzle",
            "AgeGroup": "8+",
            "Brand": "Toy Co.",
            "Material": "Cardboard",
            "BatteryRequired": "No",
            "Educational": "Yes",
            "Price": "0",
            "Quantity": "0"
        });

        expect(toy.getType()).toBe("Puzzle");
        expect(toy.getBatteryRequired()).toBe(false);
        expect(toy.getEducational()).toBe(true);
        expect(toy.getPrice()).toBe(0);
        expect(toy.getQuantity()).toBe(0);
    });

    it("rejects missing or incorrectly typed numeric data through the builders", () => {
        expect(() => new JSONBookMapper().map({
            "Book Title": "Clean Code",
            "Author": "Robert C. Martin",
            "Genre": "Software",
            "Format": "Paperback",
            "Language": "English",
            "Publisher": "Prentice Hall",
            "Special Edition": "First Edition",
            "Packaging": "Standard",
            "Price": "invalid",
            "Quantity": "1"
        })).toThrow();
    });
});
