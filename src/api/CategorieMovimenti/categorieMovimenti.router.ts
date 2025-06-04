import { Router } from "express";
import CategorieMovimentiController from "./categorieMovimenti.controller";
import { isAuthenticated } from "../../utils/auth/authenticated.middleware";

const router = Router();

router.use(isAuthenticated);
router.get("/", CategorieMovimentiController.getAll);
router.post("/", CategorieMovimentiController.create);
router.put("/:id", CategorieMovimentiController.update);
router.delete("/:id", CategorieMovimentiController.delete);

export default router;
