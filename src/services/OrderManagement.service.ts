import { ServiceException } from "../util/exceptions/ServiceException";
import { RepositoryFactory } from "../repository/sqlite/Repository.factory";
import config from "../config";
import { IIdentifiableOrderItem } from "../model/IOrder";
import { ItemCategory } from "../model/IItem";
import { IRepository } from "../repository/IRepository";
import { ItemsNotFoundException } from "../util/exceptions/repositoryException";

export class OrderManagementService {
    // create an order
    public async createOrder(order: IIdentifiableOrderItem): Promise<IIdentifiableOrderItem> {
        this.validateOrder(order);
        const repo = await this.getRepo(order.getItem().getCategory());
        await repo.create(order);
        return order;
    }

    // get order
    public async getOrder(id: string): Promise<IIdentifiableOrderItem> {
        const categories = Object.values(ItemCategory);
        for (const category of categories) {
            const repo = await this.getRepo(category)
            try {
                return await repo.get(id);
            } catch (error) {
                if (!(error instanceof ItemsNotFoundException)) {
                    throw error;
                }
            }
        }
        throw new ItemsNotFoundException(`Order with id ${id} not found`);
    }
    // upadate order
    public async updateOrder(order: IIdentifiableOrderItem): Promise<void> {
        this.validateOrder(order);
        const repo = await this.getRepo(order.getItem().getCategory());
        await repo.update(order);
    }


    // delete order
    public async deleteOrder(id: string): Promise<void> {
        const categories = Object.values(ItemCategory);
        for (const category of categories) {
            const repo = await this.getRepo(category);
            try {
                await repo.get(id);
                await repo.delete(id);
                return;
            } catch (error) {
                if (!(error instanceof ItemsNotFoundException)) {
                    throw error;
                }
            }
        }
        throw new ItemsNotFoundException(`Order with id ${id} not found`);
    }
    // get all orders
    public async getAllOrders(): Promise<IIdentifiableOrderItem[]> {
        const categories = Object.values(ItemCategory);
        const allOrders: IIdentifiableOrderItem[] = [];
        for (const category of categories) {
            const repo = await this.getRepo(category);
            const orders = await repo.getAll();
            allOrders.push(...orders);
        }
        return allOrders;
    }
    // get total revenue
    public async getTotalRevenue(): Promise<number> {
        const orders = await this.getAllOrders();
        return orders.reduce((total, order) => total + order.getPrice() * order.getQuantity(), 0);
    }

    // get total orders
    public async getTotalOrders(): Promise<number> {
        const orders = await this.getAllOrders();
        return orders.length;
    }

    private async getRepo(category: ItemCategory): Promise<IRepository<IIdentifiableOrderItem>> {
        return RepositoryFactory.create(config.dbMode, category);
    }

    private validateOrder(order: IIdentifiableOrderItem): void {
        if (!order || !order.getItem() || !Number.isFinite(order.getPrice()) || !Number.isFinite(order.getQuantity()) || order.getPrice() <= 0 || order.getQuantity() <= 0) {
            throw new ServiceException("Invalid order: item, price, and quantity must be valid.");
        }
    }
}
