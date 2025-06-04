import { Router } from "express";
import { validate } from "../../utils/validation-middleware";
import { AddUserDTO, changeDTO, LoginDTO } from "./auth.dto";
import { add, changePassword, login } from "./auth.controller";
import { isAuthenticated } from "../../utils/auth/authenticated.middleware";


const router = Router();

router.post('/login', validate(LoginDTO), login);
router.post('/register', validate(AddUserDTO), add);
router.post('/change-password', isAuthenticated, validate(changeDTO), changePassword)

export default router;