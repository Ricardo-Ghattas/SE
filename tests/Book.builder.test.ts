import { describe, expect, it, jest } from "@jest/globals";
import { BookBuilder } from "../src/model/builders/Book.builder";
import { ItemCategory } from "../src/model/item.model";

describe("BookBuilder", () => {
    it("builds a book with all configured properties", () => {
        const book = new BookBuilder()
            .setTitle("The Pragmatic Programmer")
            .setAuthor("Andrew Hunt and David Thomas")
            .setGenre("Software")
            .setFormat("Hardcover")
            .setLanguage("English")
            .setPublisher("Addison-Wesley")
            .setSpecialEdition("Anniversary Edition")
            .setPackaging("Gift wrap")
            .setPrice(49.99)
            .setQuantity(3)
            .build();

        expect(book.getTitle()).toBe("The Pragmatic Programmer");
        expect(book.getAuthor()).toBe("Andrew Hunt and David Thomas");
        expect(book.getGenre()).toBe("Software");
        expect(book.getFormat()).toBe("Hardcover");
        expect(book.getLanguage()).toBe("English");
        expect(book.getPublisher()).toBe("Addison-Wesley");
        expect(book.getSpecialEdition()).toBe("Anniversary Edition");
        expect(book.getPackaging()).toBe("Gift wrap");
        expect(book.getPrice()).toBe(49.99);
        expect(book.getQuantity()).toBe(3);
        expect(book.getCategory()).toBe(ItemCategory.BOOK);
    });

    it("supports method chaining", () => {
        const builder = new BookBuilder();

        expect(builder.setTitle("Clean Code")).toBe(builder);
        expect(builder.setAuthor("Robert C. Martin")).toBe(builder);
        expect(builder.setGenre("Software")).toBe(builder);
        expect(builder.setFormat("Paperback")).toBe(builder);
        expect(builder.setLanguage("English")).toBe(builder);
        expect(builder.setPublisher("Prentice Hall")).toBe(builder);
        expect(builder.setSpecialEdition("First Edition")).toBe(builder);
        expect(builder.setPackaging("Standard")).toBe(builder);
        expect(builder.setPrice(35)).toBe(builder);
        expect(builder.setQuantity(1)).toBe(builder);
    });

    it("accepts zero price and quantity", () => {
        const book = new BookBuilder()
            .setTitle("Sample Book")
            .setAuthor("Sample Author")
            .setGenre("Reference")
            .setFormat("Paperback")
            .setLanguage("English")
            .setPublisher("Sample Publisher")
            .setSpecialEdition("Standard Edition")
            .setPackaging("Standard")
            .setPrice(0)
            .setQuantity(0)
            .build();

        expect(book.getPrice()).toBe(0);
        expect(book.getQuantity()).toBe(0);
    });

    it("throws when a required property is missing", () => {
        const consoleError = jest.spyOn(console, "error").mockImplementation(() => undefined);
        const builder = new BookBuilder()
            .setTitle("Clean Code")
            .setAuthor("Robert C. Martin")
            .setGenre("Software")
            .setFormat("Paperback")
            .setLanguage("English")
            .setPublisher("Prentice Hall")
            .setSpecialEdition("First Edition")
            .setPackaging("Standard")
            .setPrice(35);

        expect(() => builder.build()).toThrow("Required properties are missing");
        expect(consoleError).toHaveBeenCalledWith(
            "Required properties are missing, you cant build a book"
        );

        consoleError.mockRestore();
    });

    it("passes invalid negative values to the Book model validation", () => {
        const builder = new BookBuilder()
            .setTitle("Clean Code")
            .setAuthor("Robert C. Martin")
            .setGenre("Software")
            .setFormat("Paperback")
            .setLanguage("English")
            .setPublisher("Prentice Hall")
            .setSpecialEdition("First Edition")
            .setPackaging("Standard")
            .setPrice(35)
            .setQuantity(-1);

        expect(() => builder.build()).toThrow("Price and quantity must be non-negative");
    });
});
