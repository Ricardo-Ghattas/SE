import { IIdentifiableItem, ItemCategory } from "../model/IItem";
import { JSONRequestCakeMapper } from "./Cake.mapper";
import { IMapper } from "./IMapper";
import { JSONRequestOrderMapper } from "./Order.mapper";

export class JsonRequestFactory {
    public static create(type: ItemCategory): JSONRequestOrderMapper {
        switch (type) {
            case ItemCategory.CAKE:
                return new JSONRequestOrderMapper(new JSONRequestCakeMapper() as IMapper<unknown, IIdentifiableItem>)
        
            default:
                throw new Error("Unsupported type");
        }
    }
}
