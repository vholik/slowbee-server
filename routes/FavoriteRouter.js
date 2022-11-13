import Router from "express";
import FavoriteController from "../controllers/FavoriteController.js";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";

const router = new Router();

router.get("/", AuthMiddleware, FavoriteController.getAll);
router.get("/player", AuthMiddleware, FavoriteController.player);
router.get("/:id", AuthMiddleware, FavoriteController.check);
router.put("/:id", AuthMiddleware, FavoriteController.update);

export default router;
