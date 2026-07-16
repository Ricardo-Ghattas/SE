import { Router } from "express";
import orderRoutes from "./order.route";

const routes = Router();

routes.get('/', (req, res) => {
    res.send('Hello, World!');
});

routes.use('/orders', orderRoutes);

export default routes;
