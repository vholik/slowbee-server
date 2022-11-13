import Router from "express";
import SearchController from "../controllers/SearchController.js";

const router = new Router();

router.get("/:keywords", SearchController.search);

export default router;
