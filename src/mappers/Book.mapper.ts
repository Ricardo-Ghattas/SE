import { IMapper } from "./IMapper";
import { Book } from "../model/Book.model";
import { BookBuilder } from "../model/builders/Book.builder";

export class JSONBookMapper implements IMapper<Record<string, string>, Book> {
    map(data: Record<string, string>): Book {
        return BookBuilder.newBuilder()
            .setTitle(data["Book Title"])
            .setAuthor(data["Author"])
            .setGenre(data["Genre"])
            .setFormat(data["Format"])
            .setLanguage(data["Language"])
            .setPublisher(data["Publisher"])
            .setSpecialEdition(data["Special Edition"])
            .setPackaging(data["Packaging"])
            .setPrice(parseInt(data["Price"]))
            .setQuantity(parseInt(data["Quantity"]))
            .build();
    }
}
