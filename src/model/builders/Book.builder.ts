import { Book } from "../Book.model";

export class BookBuilder {
    private title!: string;
    private author!: string;
    private genre!: string;
    private format!: string;
    private language!: string;
    private publisher!: string;
    private specialEdition!: string;
    private packaging!: string;
    private price!: number;
    private quantity!: number;

    public static newBuilder(): BookBuilder {
        return new BookBuilder();
    }

    setTitle(title: string): BookBuilder {
        this.title = title;
        return this;
    }

    setAuthor(author: string): BookBuilder {
        this.author = author;
        return this;
    }

    setGenre(genre: string): BookBuilder {
        this.genre = genre;
        return this;
    }

    setFormat(format: string): BookBuilder {
        this.format = format;
        return this;
    }

    setLanguage(language: string): BookBuilder {
        this.language = language;
        return this;
    }

    setPublisher(publisher: string): BookBuilder {
        this.publisher = publisher;
        return this;
    }

    setSpecialEdition(specialEdition: string): BookBuilder {
        this.specialEdition = specialEdition;
        return this;
    }

    setPackaging(packaging: string): BookBuilder {
        this.packaging = packaging;
        return this;
    }

    setPrice(price: number): BookBuilder {
        this.price = price;
        return this;
    }

    setQuantity(quantity: number): BookBuilder {
        this.quantity = quantity;
        return this;
    }

    build(): Book {
        const requiredProperties = [
            this.title,
            this.author,
            this.genre,
            this.format,
            this.language,
            this.publisher,
            this.specialEdition,
            this.packaging,
            this.price,
            this.quantity
        ];

        for (const property of requiredProperties) {
            if (property === undefined || property === null || property === "") {
                console.error("Required properties are missing, you cant build a book");
                throw new Error("Required properties are missing");
            }
        }
        if (Number.isNaN(this.price) || Number.isNaN(this.quantity)) {
            throw new Error("Book price and quantity must be valid numbers");
        }

        return new Book(
            this.title,
            this.author,
            this.genre,
            this.format,
            this.language,
            this.publisher,
            this.specialEdition,
            this.packaging,
            this.price,
            this.quantity
        );
    }
}
