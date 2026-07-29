import { describe, expect, it, jest } from "@jest/globals";
import { CakeBuilder } from "../src/model/builders/Cake.builder";
import { ItemCategory } from "../src/model/item.model";

describe("CakeBuilder", () => {
    it("builds a cake with all configured properties", () => {
        const cake = new CakeBuilder()
            .setType("Birthday")
            .setFlavor("Chocolate")
            .setFilling("Strawberry")
            .setSize(10)
            .setLayers(2)
            .setFrostingType("Buttercream")
            .setFrostingFlavor("Vanilla")
            .setDecorationType("Sprinkles")
            .setDecorationColor("Blue")
            .setCustomMessage("Happy Birthday!")
            .setShape("Round")
            .setAllergies("None")
            .setSpecialIngredients("Dark chocolate")
            .setPackagingType("Cake box")
            .build();

        expect(cake.getType()).toBe("Birthday");
        expect(cake.getFlavor()).toBe("Chocolate");
        expect(cake.getFilling()).toBe("Strawberry");
        expect(cake.getSize()).toBe(10);
        expect(cake.getLayers()).toBe(2);
        expect(cake.getFrostingType()).toBe("Buttercream");
        expect(cake.getFrostingFlavor()).toBe("Vanilla");
        expect(cake.getDecorationType()).toBe("Sprinkles");
        expect(cake.getDecorationColor()).toBe("Blue");
        expect(cake.getCustomMessage()).toBe("Happy Birthday!");
        expect(cake.getShape()).toBe("Round");
        expect(cake.getAllergies()).toBe("None");
        expect(cake.getSpecialIngredients()).toBe("Dark chocolate");
        expect(cake.getPackagingType()).toBe("Cake box");
        expect(cake.getCategory()).toBe(ItemCategory.CAKE);
    });

    it("supports method chaining", () => {
        const builder = new CakeBuilder();

        expect(builder.setType("Wedding")).toBe(builder);
        expect(builder.setFlavor("Vanilla")).toBe(builder);
        expect(builder.setFilling("Cream")).toBe(builder);
        expect(builder.setSize(12)).toBe(builder);
        expect(builder.setLayers(3)).toBe(builder);
        expect(builder.setFrostingType("Fondant")).toBe(builder);
        expect(builder.setFrostingFlavor("Vanilla")).toBe(builder);
        expect(builder.setDecorationType("Flowers")).toBe(builder);
        expect(builder.setDecorationColor("White")).toBe(builder);
        expect(builder.setCustomMessage("Congratulations!")).toBe(builder);
        expect(builder.setShape("Round")).toBe(builder);
        expect(builder.setAllergies("None")).toBe(builder);
        expect(builder.setSpecialIngredients("Edible flowers")).toBe(builder);
        expect(builder.setPackagingType("Premium box")).toBe(builder);
    });

    it("throws when a required property is missing", () => {
        const consoleError = jest.spyOn(console, "error").mockImplementation(() => undefined);
        const builder = new CakeBuilder()
            .setType("Birthday")
            .setFlavor("Chocolate")
            .setFilling("Strawberry")
            .setSize(10)
            .setLayers(2)
            .setFrostingType("Buttercream")
            .setFrostingFlavor("Vanilla")
            .setDecorationType("Sprinkles")
            .setDecorationColor("Blue")
            .setCustomMessage("Happy Birthday!")
            .setShape("Round")
            .setAllergies("None")
            .setSpecialIngredients("Dark chocolate");

        expect(() => builder.build()).toThrow("Required properties are missing");
        expect(consoleError).toHaveBeenCalledWith(
            "Required properties are missing, you cant build a cake"
        );

        consoleError.mockRestore();
    });
});
