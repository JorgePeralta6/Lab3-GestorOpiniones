import { response, request } from "express";
import Comment from "./comment.model.js";
import User from '../users/user.model.js'

export const saveComment = async (req, res) => {
    try {

        const data = req.body;
        const user = await User.findOne({ email: data.email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Propietario no encontrado'
            })
        }

        const comment = new Comment({
            ...data,
            author: user._id
        });

        await comment.save();

        res.status(200).json({
            success: true,
            comment
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al guardar mascota',
            error
        })
    }
}

export const getComments = async (req, res) => {
    const { limite = 10, desde = 0 } = req.query;
    const query = { status: true };

    try {

        const comments = await Comment.find(query)
            .skip(Number(desde))
            .limit(Number(limite));

        const commentWithOwnerNames = await Promise.all(comments.map(async (comment) => {
            const owner = await User.findById(comment.author);
            return {
                ...comment.toObject(),
                author: owner ? owner.name : "Usuario no encontrado"
            }
        }))

        const total = await Comment.countDocuments(query);

        res.status(200).json({
            success: true,
            total,
            comments: commentWithOwnerNames
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al obtener el comentario",
            error
        });
    }
};

export const deleteComment = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(req.user)
        if (!req.user || !req.user._id) {
            return res.status(401).json({
                success: false,
                message: "Usuario no autenticado",
            });
        }
        const userId = req.user._id;

        const comment = await Comment.findOne({ _id: id, author: userId });

        if (!comment) {
            return res.status(403).json({
                success: false,
                message: "No puedes eliminar este comentario",
            });
        }

        await Comment.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Comentario eliminado exitosamente",
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Error al eliminar comentario",
            error: error.message
        });
    }
};



export const updateComment = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const comment = await Comment.findOne({ _id: id, author: userId });

        if (!comment) {
            return res.status(403).json({
                success: false,
                msg: "No puedes editar este comentario",
            });
        }

        const updatedComment = await Comment.findByIdAndUpdate(id, req.body, { new: true });

        res.json({
            success: true,
            msg: "Comentario actualizado exitosamente",
            comment: updatedComment,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            msg: "Error al actualizar el comentario",
        });
    }
};