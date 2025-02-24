import { response, request } from "express";
import { hash } from "argon2";
import User from "../users/user.model.js";
import Comment from "../comments/comment.model.js";
import Category from "../category/category.model.js"
import Publication from "./publication.model.js"

export const savePublication = async (req, res) => {
    try {

        const data = req.body;

        const category = await Category.findOne({ name: data.name });
        const user = await User.findOne({ email: data.email });

        if (!user) {
            return res.status(404).json({
                succes: false,
                message: 'User not found',
                error: error.message
            })

        } if (!category) {
            return res.status(404).json({
                succes: false,
                message: 'Category not found',
                error: error.message
            })
        }

        const publication = new Publication({
            category: category._id,
            ...data,
            user: user._id,
        });

        await publication.save();

        res.status(200).json({
            succes: true,
            publication
        });

    } catch (error) {
        res.status(500).json({
            succes: false,
            msg: 'Error creating publication',
            error: error.message
        })
    }
}

export const getPublication = async (req, res) => {
    const { limite = 10, desde = 0 } = req.query;
    const query = { state: true };

    try {

        const [total, publication] = await Promise.all([
            Publication.countDocuments(query),
            Publication.find(query)
                .populate({ path: 'category', match: { state: true }, select: 'name' })
                .populate({ path: 'user', match: { state: true }, select: 'name' })
                .skip(Number(desde))
                .limit(Number(limite))
        ])

        res.status(200).json({
            succes: true,
            total,
            publication
        })
    } catch (error) {
        res.status(500).json({
            succes: false,
            msg: 'Error getting publications',
            error: error.message
        })
    }
}

export const deletePublication = async (req, res) => {
    try {
        const { id } = req.params;

        if (!req.user || !req.user._id) {
            return res.status(401).json({
                success: false,
                message: "Usuario no autenticado",
            });
        }
        const userId = req.user._id;

        const publication = await Publication.findOne({ _id: id, user: userId });

        if (!publication) {
            return res.status(403).json({
                success: false,
                message: "No puedes eliminar este comentario"
            });
        }

        await Publication.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Publicacion eliminado exitosamente",
        });

    } catch (error) {
        res.status(500).json({
            succes: false,
            msg: 'Error al eliminar publicacion',
            error: error.message
        })
    }
}


export const updatePublication = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const publication = await Publication.findOne({ _id: id, user: userId });

        if (!publication) {
            return res.status(403).json({
                succes: false,
                message: 'No puedes editar esta publicacion',
            });
        }

        const updatedPublication = await Publication.findByIdAndUpdate(id, req.body, {new: true});

        res.status(200).json({
            succes: true,
            msg: 'Publicacion actualizado exitosamente',
            publication: updatedPublication,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            succes: false,
            msg: "Error al actualizar la publicacion",
        })
    }
}

export const addComment = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        const comment1 = await Comment.findOne({ comment: data.comment });

        if (!comment1) {
            return res.status(404).json({
                succes: false,
                message: 'No se encontro el comentario'
            })
        }

        const updatedComment = await Comment.findByIdAndUpdate(id).populate({ path: 'comment', match: { status: true }, select: 'comment author' });

        updatedComment.comment.push([comment1._id]);
        await updatedComment.save();

        res.status(200).json({
            success: true,
            message: 'Comentario asignado correctamente',
            user: updatedComment
        });

    } catch (error) {
        res.status(500).json({
            succes: false,
            msg: 'Error al agregar el comentario',
            error
        })
    }
}