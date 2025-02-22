import { Router } from "express";
import { check } from "express-validator";
import { saveCategory, getCategory, searchCategory, updateCategory, deleteCategory } from "./category.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { existeCategory } from "../helpers/db-validator.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { validarAdminRole } from "../middlewares/validar-roles.js";

const router = Router();

router.post(
    "/",
    [
        validarJWT,
        validarAdminRole,
        validarCampos
    ],
    saveCategory
)

router.get("/", getCategory)

router.get(
    "/:id",
    [
        validarJWT,
        check("id").custom(existeCategory),
        validarCampos
    ],
    searchCategory
)

router.delete(
    "/:id",
    [
        validarJWT,
        validarAdminRole,
        check("id").custom(existeCategory),
        validarCampos
    ],
    deleteCategory
)

router.put(
    "/:id",
    [
        validarJWT,
        validarAdminRole,
        check("id").custom(existeCategory),
        validarCampos
    ],
    updateCategory
)

export default router;