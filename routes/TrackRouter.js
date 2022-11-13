import Router from "express";
import TrackController from "../controllers/TrackController.js";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";

const router = new Router();

router.get("/", TrackController.getAll);
router.post("/", AuthMiddleware, TrackController.create);
router.get("/:id", TrackController.getOne);
router.put("/favorites/:id", AuthMiddleware, TrackController.updateFavorites);
router.put("/:id", TrackController.update);
router.get("/player/:id", TrackController.player);
router.put("/comments/:id", AuthMiddleware, TrackController.createComment);
router.get("/comments/:id", TrackController.getOneComment);

export default router;
