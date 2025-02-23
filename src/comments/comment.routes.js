import { Router } from "express";
import { check } from "express-validator";
import {deleteComment, updateComment, getComments, saveComment } from "./comment.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js"; 
import { existeComentario } from "../helpers/db-validator.js";

const router = Router();

router.post(
    "/",
    [
        validarJWT, 
        validarCampos
    ],
    saveComment
)

router.get("/", getComments)

router.delete(
    "/:id",
    [
        validarJWT, 
        check("id").custom(existeComentario),
        validarCampos
    ],
    deleteComment
);

router.put(
    "/:id",
    [
        validarJWT, 
        check("id").custom(existeComentario),
        check("comment", "El comentario es obligatorio").not().isEmpty(),
        validarCampos
    ],
    updateComment
);

export default router;