import config from "../../config";
import { ItemCategory } from "../../model/IItem";
import { IIdentifiableOrderItem, IOrder } from "../../model/IOrder";
import { CakeOrderRepository } from "../file/Cake.order.repository";
import { Initializable, IRepository } from "../IRepository";
import { CakeRepository } from "./Cake.order.repository";
import { OrderRepository } from "./Order.repository";


export enum DBMode {
    SQLITE,
    FILE
}

export class RepositoryFactory {

    public static async create(mode: DBMode, category: ItemCategory): Promise<IRepository<IIdentifiableOrderItem>> {
        switch (mode) {
            case DBMode.SQLITE:
                {
                    let repository: IRepository<IIdentifiableOrderItem> & Initializable;
                    switch (category) {
                        case ItemCategory.CAKE:
                            repository = new OrderRepository(new CakeRepository());
                            break;
                        default:
                            throw new Error(`Unsupported category: ${category}`);
                    }
                    await repository.init();
                    return repository;
                }

            //! Deprecated
            case DBMode.FILE:
                throw new Error("file mode is deprecated")
        }
    }
}
