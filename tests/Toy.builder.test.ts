import { describe, expect, it, jest } from "@jest/globals";
import { ToyBuilder } from "../src/model/builders/Toy.builder";
import { ItemCategory } from "../src/model/item.model";

describe("ToyBuilder", () => {
    it("builds a toy with all configured properties", () => {
        const toy = new ToyBuilder()
            .setType("Building blocks")
            .setAgeGroup("6+")
            .setBrand("Brick Co.")
            .setMaterial("Plastic")
            .setBatteryRequired(true)
            .setEducational(true)
            .setPrice(29.99)
            .setQuantity(4)
            .build();

        expect(toy.getType()).toBe("Building blocks");
        expect(toy.getAgeGroup()).toBe("6+");
        expect(toy.getBrand()).toBe("Brick Co.");
        expect(toy.getMaterial()).toBe("Plastic");
        expect(toy.getBatteryRequired()).toBe(true);
        expect(toy.getEducational()).toBe(true);
        expect(toy.getPrice()).toBe(29.99);
        expect(toy.getQuantity()).toBe(4);
        expect(toy.getCategory()).toBe(ItemCategory.TOY);
    });

    it("supports method chaining", () => {
        const builder = new ToyBuilder();

        expect(builder.setType("Puzzle")).toBe(builder);
        expect(builder.setAgeGroup("8+")).toBe(builder);
        expect(builder.setBrand("Puzzle Co.")).toBe(builder);
        expect(builder.setMaterial("Cardboard")).toBe(builder);
        expect(builder.setBatteryRequired(false)).toBe(builder);
        expect(builder.setEducational(true)).toBe(builder);
        expect(builder.setPrice(15)).toBe(builder);
        expect(builder.setQuantity(2)).toBe(builder);
    });

    it("accepts false boolean values and zero price and quantity", () => {
        const toy = new ToyBuilder()
            .setType("Doll")
            .setAgeGroup("3+")
            .setBrand("Toy Co.")
            .setMaterial("Fabric")
            .setBatteryRequired(false)
            .setEducational(false)
            .setPrice(0)
            .setQuantity(0)
            .build();

        expect(toy.getBatteryRequired()).toBe(false);
        expect(toy.getEducational()).toBe(false);
        expect(toy.getPrice()).toBe(0);
        expect(toy.getQuantity()).toBe(0);
    });

    it("throws when a required property is missing", () => {
        const consoleError = jest.spyOn(console, "error").mockImplementation(() => undefined);
        const builder = new ToyBuilder()
            .setType("Puzzle")
            .setAgeGroup("8+")
            .setBrand("Puzzle Co.")
            .setMaterial("Cardboard")
            .setBatteryRequired(false)
            .setEducational(true)
            .setPrice(15);

        expect(() => builder.build()).toThrow("Required properties are missing");
        expect(consoleError).toHaveBeenCalledWith(
            "Required properties are missing, you cant build a toy"
        );

        consoleError.mockRestore();
    });

    it("passes invalid negative values to the Toy model validation", () => {
        const builder = new ToyBuilder()
            .setType("Puzzle")
            .setAgeGroup("8+")
            .setBrand("Puzzle Co.")
            .setMaterial("Cardboard")
            .setBatteryRequired(false)
            .setEducational(true)
            .setPrice(-1)
            .setQuantity(2);

        expect(() => builder.build()).toThrow("Price and quantity must be non-negative");
    });
});
