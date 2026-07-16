import { afterEach, describe, expect, it, jest } from "@jest/globals";
import { IdentifiableCake } from "../src/model/Cake.model";
import { ItemCategory } from "../src/model/IItem";
import { IdentifiableOrderItem } from "../src/model/Order.model";
import { IRepository } from "../src/repository/IRepository";
import { RepositoryFactory } from "../src/repository/sqlite/Repository.factory";
import { OrderManagementService } from "../src/services/OrderManagement.service";
import { ItemsNotFoundException } from "../src/util/exceptions/repositoryException";
import { ServiceException } from "../src/util/exceptions/ServiceException";

const cake = new IdentifiableCake(
    "cake-1", "birthday", "vanilla", "cream", 8, 2, "buttercream",
    "vanilla", "flowers", "pink", "hello", "round", "none", "berries", "box",
);

const makeOrder = (id: string, price: number, quantity: number) =>
    new IdentifiableOrderItem(cake, price, quantity, id);

const makeRepository = (orders = [makeOrder("order-1", 10, 2)]) => ({
    create: jest.fn(async (_order: IdentifiableOrderItem) => "order-1"),
    get: jest.fn(async (id: string) => {
        const order = orders.find((candidate) => candidate.getId() === id);
        if (!order) throw new ItemsNotFoundException("not found");
        return order;
    }),
    getAll: jest.fn(async () => orders),
    update: jest.fn(async (_order: IdentifiableOrderItem) => undefined),
    delete: jest.fn(async (_id: string) => undefined),
});

describe("OrderManagementService", () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it("creates valid orders through the category repository", async () => {
        const repository = makeRepository();
        jest.spyOn(RepositoryFactory, "create").mockResolvedValue(repository as IRepository<IdentifiableOrderItem>);
        const order = makeOrder("order-1", 15, 3);

        await expect(new OrderManagementService().createOrder(order)).resolves.toBe(order);
        expect(RepositoryFactory.create).toHaveBeenCalledWith(expect.anything(), ItemCategory.CAKE);
        expect(repository.create).toHaveBeenCalledWith(order);
    });

    it.each([
        [0, 1],
        [-1, 1],
        [Number.NaN, 1],
        [10, 0],
        [10, Number.POSITIVE_INFINITY],
    ])("rejects invalid price %s or quantity %s", async (price, quantity) => {
        await expect(new OrderManagementService().createOrder(makeOrder("bad", price, quantity)))
            .rejects.toThrow(ServiceException);
    });

    it("calculates total revenue and total order count", async () => {
        const orders = [makeOrder("one", 10.5, 2), makeOrder("two", 4, 3)];
        jest.spyOn(RepositoryFactory, "create").mockResolvedValue(makeRepository(orders) as IRepository<IdentifiableOrderItem>);
        const service = new OrderManagementService();

        await expect(service.getTotalRevenue()).resolves.toBe(33);
        await expect(service.getTotalOrders()).resolves.toBe(2);
    });

    it("reports a missing order after repository lookup", async () => {
        jest.spyOn(RepositoryFactory, "create").mockResolvedValue(makeRepository([]) as IRepository<IdentifiableOrderItem>);

        await expect(new OrderManagementService().getOrder("missing")).rejects.toThrow(
            "Order with id missing not found",
        );
    });
});
