import { parseCSV, parseJSON, parseXML } from "./util/parser";
import { CSVCakeMapper } from "./mappers/Cake.mapper";
import logger from "./util/logger";
import { CSVOrderMapper } from "./mappers/Order.mapper";
import { JSONBookMapper } from "./mappers/Book.mapper";
import { XMLToyMapper } from "./mappers/Toy.mapper";
import { OrderBuilder } from "./model/builders/Order.builder";
import { IItem } from "./model/IItem";
import { IMapper } from "./mappers/IMapper";

type DataRecord = Record<string, string>;

function mapRecordOrder(
    data: DataRecord,
    itemMapper: IMapper<DataRecord, IItem>,
    idKey: string,
) {
    return OrderBuilder.newBuilder()
        .setId(String(data[idKey]))
        .setQuantity(Number(data["Quantity"]))
        .setPrice(Number(data["Price"]))
        .setItem(itemMapper.map(data))
        .build();
}

async function main() {
    const data_csv = await parseCSV("src/data/cake orders.csv");
    const data_json = await parseJSON("src/data/book orders.json") as unknown as DataRecord[];
    const parsed_xml = await parseXML("src/data/toy orders.xml") as unknown as {
        data: { row: DataRecord[] }
    };

    const cakeMapper = new CSVCakeMapper();
    const bookMapper = new JSONBookMapper();
    const toyMapper = new XMLToyMapper();

    data_csv.shift(); // remove header row

    const orderMapper_cake = new CSVOrderMapper(cakeMapper);
    const orders_cake = data_csv.map(row => orderMapper_cake.map(row));
    logger.info("list of Orders: \n %o", orders_cake);

    const orders_book = data_json.map(row =>
        mapRecordOrder(row, bookMapper, "Order ID")
    );
    logger.info("list of Orders: \n %o", orders_book);

    const orders_toy = parsed_xml.data.row.map(row =>
        mapRecordOrder(row, toyMapper, "OrderID")
    );
    logger.info("list of Orders: \n %o", orders_toy);

}

main().catch(error => {
    logger.error("Failed to process orders: %o", error);
    process.exitCode = 1;
});
