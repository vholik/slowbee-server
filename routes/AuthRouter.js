import Router from "express";
import AuthController from "../controllers/AuthController.js";
import { check } from "express-validator";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";
const router = Router();

router.post(
  "/registration",
  [
    check("username", "Username can not be empty").notEmpty().isLength({
      min: 4,
      max: 10,
    }),
    check("password", "Password min 4, max 10 symbols").isLength({
      min: 4,
      max: 10,
    }),
  ],
  AuthController.registration
);
router.post("/login", AuthController.login);
router.get("/getMe", AuthMiddleware, AuthController.getMe);
router.put("/", AuthMiddleware, AuthController.uploadUserPhoto);

export default router;
