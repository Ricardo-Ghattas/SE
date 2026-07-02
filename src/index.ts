
import logger from "./util/logger";
import { CakeBuilder, IdentifaibleCakeBuilder } from "./model/builders/Cake.builder";
import { IdentifiableOrderItemBUilder, OrderBuilder } from "./model/builders/Order.builder";
import { ItemCategory } from "./model/IItem";
import { DBMode, RepositoryFactory } from "./repository/sqlite/Repository.factory";

async function DBSandBox() {
    const dbOrder = await RepositoryFactory.create(DBMode.FILE, ItemCategory.CAKE);

    // create identifiable cake
const cake = CakeBuilder.newBuilder()
    .setType("Birthday")
    .setFlavor("Chocolate")
    .setFilling("Vanilla cream")
    .setSize(8)
    .setLayers(2)
    .setFrostingType("Buttercream")
    .setFrostingFlavor("Chocolate")
    .setDecorationType("Sprinkles")
    .setDecorationColor("Blue")
    .setCustomMessage("Happy Birthday")
    .setShape("Round")
    .setAllergies("None")
    .setSpecialIngredients("Fresh strawberries")
    .setPackagingType("Box")
    .build();    // create identifiable order
    const idCake = IdentifaibleCakeBuilder.newBuilder().setCake(cake).setId("17" + Math.random()).build()

    // create identifiable order
    const order = OrderBuilder.newBuilder().setItem(idCake).setPrice(100).setQuantity(1).setId("123" + Math.random()).build();
    const idOrder = IdentifiableOrderItemBUilder.newBuilder().setItem(idCake).setOrder(order).build();

    await dbOrder.create(idOrder)

    await dbOrder.update(idOrder);

    await dbOrder.delete(idOrder.getId());

    console.log((await dbOrder.getAll()).length);


} 

//main();
DBSandBox().catch((error) => logger.info("Error in DBSabdBox", error as Error));
