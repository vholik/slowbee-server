import Router from "express";
import TrackController from "./controllers/TrackController.js";
import AuthMiddleware from "./middlewares/AuthMiddleware.js";

const router = new Router();

router.get("/", TrackController.getAll);
router.post("/", AuthMiddleware, TrackController.create);
router.get("/:id", TrackController.getOne);

export default router;
