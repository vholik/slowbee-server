import Router from "express";
import AuthController from "./controllers/AuthController.js";
import { check } from "express-validator";
const router = Router();

router.post(
  "/registration",
  [
    check("username", "Username can not be empty").notEmpty(),
    check("password", "Password min 4, max 10 symbols").isLength({
      min: 4,
      max: 10,
    }),
  ],
  AuthController.registration
);
router.post("/login", AuthController.login);

export default router;
