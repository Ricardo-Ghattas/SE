import { describe, expect, it, jest } from "@jest/globals";
import { Request, Response } from "express";
import { OrderController } from "../src/controllers/order.controller";
import { OrderManagementService } from "../src/services/OrderManagement.service";

const makeResponse = () => {
    const response = {
        status: jest.fn(),
        json: jest.fn(),
        send: jest.fn(),
    };
    response.status.mockReturnValue(response);
    return response as unknown as Response;
};

describe("OrderController", () => {
    it("returns all orders", async () => {
        const orders = [{ id: "order-1" }];
        const service = { getAllOrders: jest.fn(async () => orders) };
        const response = makeResponse();

        await new OrderController(service as unknown as OrderManagementService)
            .getOrders({} as Request, response);

        expect(response.status).toHaveBeenCalledWith(200);
        expect(response.json).toHaveBeenCalledWith(orders);
    });

    it("returns total revenue", async () => {
        const service = { getTotalRevenue: jest.fn(async () => 125.5) };
        const response = makeResponse();

        await new OrderController(service as unknown as OrderManagementService)
            .getTotalRevenue({} as Request, response);

        expect(response.status).toHaveBeenCalledWith(200);
        expect(response.json).toHaveBeenCalledWith({ totalRevenue: 125.5 });
    });

    it("returns total orders", async () => {
        const service = { getTotalOrders: jest.fn(async () => 7) };
        const response = makeResponse();

        await new OrderController(service as unknown as OrderManagementService)
            .getTotalOrders({} as Request, response);

        expect(response.status).toHaveBeenCalledWith(200);
        expect(response.json).toHaveBeenCalledWith({ totalOrders: 7 });
    });

    it("deletes an order with a 204 response", async () => {
        const service = { deleteOrder: jest.fn(async (_id: string) => undefined) };
        const response = makeResponse();
        const request = { params: { id: "order-1" } } as unknown as Request;

        await new OrderController(service as unknown as OrderManagementService).deleteOrder(request, response);

        expect(service.deleteOrder).toHaveBeenCalledWith("order-1");
        expect(response.status).toHaveBeenCalledWith(204);
        expect(response.send).toHaveBeenCalled();
    });

    it("rejects a missing route id", async () => {
        const controller = new OrderController({} as OrderManagementService);

        await expect(controller.getOrder({ params: {} } as Request, makeResponse()))
            .rejects.toThrow("Id is required to get order");
    });
});
