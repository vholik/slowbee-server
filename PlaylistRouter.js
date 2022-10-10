import Router from "express";
import PlaylistController from "./controllers/PlaylistController.js";
import AuthMiddleware from "./middlewares/AuthMiddleware.js";

const router = new Router();

router.get("/", PlaylistController.getAll);
router.post("/", AuthMiddleware, PlaylistController.create);
router.get("/:id", PlaylistController.getOne);
router.put("/:id", AuthMiddleware, PlaylistController.update);
router.delete("/:id", AuthMiddleware, PlaylistController.delete);

export default router;
