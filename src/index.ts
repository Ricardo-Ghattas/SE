import { CakeBuilder } from "./model/builders/Cake.builder";
import { ToyBuilder } from "./model/builders/Toy.builder";
import { BookBuilder } from "./model/builders/Book.builder";

async function main() {
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

    const toy = new ToyBuilder()
        .setType("Building blocks")
        .setAgeGroup("6+")
        .setBrand("Brick Co.")
        .setMaterial("Plastic")
        .setBatteryRequired(false)
        .setEducational(true)
        .setPrice(29.99)
        .setQuantity(4)
        .build();

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

    console.log({ cake, toy, book });
}

void main();
