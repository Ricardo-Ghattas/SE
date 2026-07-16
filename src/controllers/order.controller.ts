import { Request, Response } from "express";
import { JsonRequestFactory } from "../mappers";
import { IIdentifiableOrderItem } from "../model/IOrder";
import { OrderManagementService } from "../services/OrderManagement.service";

export class OrderController {
    constructor(private readonly orderService: OrderManagementService) { }

    public async createOrder(req: Request, res: Response) {
        const order: IIdentifiableOrderItem = JsonRequestFactory.create(req.body.category).map(req.body).build();
        if (!order) {
            throw new Error("Order is required to create order");
        }
        const newOrder = await this.orderService.createOrder(order);
        res.status(201).json(newOrder);
    }

    public async getOrder(req: Request, res: Response) {
        const id = req.params.id;
        if (typeof id !== "string" || !id) {
            throw new Error("Id is required to get order");
        }
        const order = await this.orderService.getOrder(id);
        res.status(200).json(order);
    }

    public async getOrders(req: Request, res: Response) {
        const orders = await this.orderService.getAllOrders();
        res.status(200).json(orders);
    }

    public async getTotalRevenue(req: Request, res: Response) {
        const totalRevenue = await this.orderService.getTotalRevenue();
        res.status(200).json({ totalRevenue });
    }

    public async getTotalOrders(req: Request, res: Response) {
        const totalOrders = await this.orderService.getTotalOrders();
        res.status(200).json({ totalOrders });
    }

    public async updateOrder(req: Request, res: Response) {
        const id = req.params.id;
        if (typeof id !== "string" || !id) {
            throw new Error("Id is required to update order");
        }
        const order: IIdentifiableOrderItem = JsonRequestFactory.create(req.body.category).map(req.body).build();
        if (!order) {
            throw new Error("Order is required to update order");
        }
        if (order.getId() !== id) {
            throw new Error("Id in body and url should be same");
        }
        const updatedOrder = await this.orderService.updateOrder(order);
        void updatedOrder;
        res.status(204).send();
    }

    public async deleteOrder(req: Request, res: Response) {
        const id = req.params.id;
        if (typeof id !== "string" || !id) {
            throw new Error("Id is required to delete order");
        }
        await this.orderService.deleteOrder(id);
        res.status(204).send();
    }

}
