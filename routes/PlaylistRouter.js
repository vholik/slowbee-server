import Router from "express";
import PlaylistController from "../controllers/PlaylistController.js";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";

const router = new Router();

router.get("/", AuthMiddleware, PlaylistController.getAll);
router.get("/original", PlaylistController.getOriginalPlaylists);
router.post("/", AuthMiddleware, PlaylistController.create);
router.get("/:id", PlaylistController.getOne);
router.put("/", AuthMiddleware, PlaylistController.update);
router.put("/:id", AuthMiddleware, PlaylistController.edit);
router.delete("/:id", AuthMiddleware, PlaylistController.delete);

export default router;
