import { Request, Response } from "express";
import { JsonRequestFactory } from "../mappers";
import { IIdentifiableOrderItem } from "../model/IOrder";
import { OrderManagementService } from "../services/OrderManagement.service";
import { BadRequestException } from "../util/exceptions/Http/BadRequestException";

export class OrderController {
    constructor(private readonly orderService: OrderManagementService) { }

    public async createOrder(req: Request, res: Response) {
        const order: IIdentifiableOrderItem = JsonRequestFactory.create(req.body.category).map(req.body).build();
        if (!order) {
            throw new BadRequestException("Order is required to create order", {
                orderNotDefined: true
            });
        }
        const newOrder = await this.orderService.createOrder(order);
        res.status(201).json(newOrder);
    }

    public async getOrder(req: Request, res: Response) {
        const id = req.params.id;
        if (typeof id !== "string" || !id) {
            throw new BadRequestException("Id is required to get order", {
                idNotDefined: true
            });
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
            throw new BadRequestException("Id is required to update order", {
                idNotDefined: true
            });
        }


        const order: IIdentifiableOrderItem = JsonRequestFactory.create(req.body.category).map(req.body).build();
        if (!order) {
            throw new BadRequestException("Order is required to update order", {
                orderNotDefined: true
            });
        }
        if (order.getId() !== id) {
            throw new BadRequestException("Id in body is different from id in param", {
                idNotSame: true, // More details!
                idInBody: order.getId(),
                idInParam: id
            });
        }
        const updatedOrder = await this.orderService.updateOrder(order);
        void updatedOrder;
        res.status(204).send();
    }

    public async deleteOrder(req: Request, res: Response) {
        const id = req.params.id;
        if (typeof id !== "string" || !id) {
            throw new BadRequestException("Id is required to delete order", {
                idNotDefined: true
            });
        }
        await this.orderService.deleteOrder(id);
        res.status(204).send();
    }

}
