import { Router } from "express";
import { check } from "express-validator";
import { validarCampos } from '../middlewares/validar-campos.js';
import { validarJWT } from "../middlewares/validar-jwt.js";
import { saveComment, getComment, deleteComment, updateComment } from './comment.controller.js';

const router = Router();

router.post(
    "/",
    [
        validarJWT,
        check('email', 'This is not a valid email').not().isEmpty(),
        validarCampos
    ],
    saveComment
);

router.get("/", getComment);


router.delete(
    "/:id",
    [
        validarJWT,
        check("id", "It is not a valid id").isMongoId(),
        validarCampos  
    ],
    deleteComment
);


router.put(
    "/:id",
    [
        validarJWT,
        check("id", "It is not a valid id").isMongoId(),
        validarCampos 
    ],
    updateComment
);

    

export default router;