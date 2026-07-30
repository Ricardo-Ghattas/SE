import { IMapper } from "./IMapper";
import { Toy } from "../model/Toy.model";
import { ToyBuilder } from "../model/builders/Toy.builder";

export class XMLToyMapper implements IMapper<Record<string, string>, Toy> {
    map(data: Record<string, string>): Toy {
        return ToyBuilder.newBuilder()
            .setType(data["Type"])
            .setAgeGroup(data["AgeGroup"])
            .setBrand(data["Brand"])
            .setMaterial(data["Material"])
            .setBatteryRequired(data["BatteryRequired"] === "Yes")
            .setEducational(data["Educational"] === "Yes")
            .setPrice(parseInt(data["Price"]))
            .setQuantity(parseInt(data["Quantity"]))
            .build();
    }
}
