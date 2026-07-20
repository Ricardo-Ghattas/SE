// From: src/routes/order.route.ts
import { Router } from "express";
import { OrderController } from "../controllers/order.controller";
import { asyncHandler } from "../Middlewares/asyncHandler";
import { OrderManagementService } from "../services/OrderManagement.service";

const orderController = new OrderController(new OrderManagementService());
const route = Router();

route.route('/')
     // Wrap controller methods with asyncHandler
     .get(asyncHandler(orderController.getOrders.bind(orderController)))
     .post(asyncHandler(orderController.createOrder.bind(orderController)));

route.route('/:id')
     .get(asyncHandler(orderController.getOrder.bind(orderController)))
     .put(asyncHandler(orderController.updateOrder.bind(orderController)))
     .delete(asyncHandler(orderController.deleteOrder.bind(orderController)));

export default route;