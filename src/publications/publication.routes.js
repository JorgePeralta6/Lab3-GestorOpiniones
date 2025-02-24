import { Router } from "express";
import { check } from "express-validator";
import {deletePublication, updatePublication, getPublication, savePublication, addComment } from "./comment.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js"; 
import { existePublicacion } from "../helpers/db-validator.js";

const router = Router();

router.post(
    "/",
    [
        validarJWT, 
        validarCampos
    ],
    savePublication
)

router.get("/", getPublication)

router.delete(
    "/:id",
    [
        validarJWT, 
        check("id").custom(existePublicacion),
        validarCampos
    ],
    deletePublication
);

router.put(
    "/:id",
    [
        validarJWT, 
        check("id").custom(existePublicacion),
        validarCampos
    ],
    updatePublication
);

router.put(
    "/agregarComentario/:id",
    [
        check("id", "No es el ID correcto").isMongoId(),
        check("id").custom(existeUsuarioById),
        validarCampos
    ],
    addComment
)

export default router;