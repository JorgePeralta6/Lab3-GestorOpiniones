import { response } from "express";
import User from '../users/user.model.js';
import Publication from '../publications/publication.model.js';
import Comment from './comment.model.js'

export const saveComment = async (req, res) => {
    try {
        
        const data = req.body;

        const plubication = await Publication.findOne({title: data.title});
        const user = await User.findOne({email: data.email});   

        if(!user){
            return res.status(404).json({
                succes: false,
                message: 'Usuario no encontrado',
                error: error.message
            })
        }if(!plubication){
            return res.status(404).json({
                succes: false,
                message: 'Publicacion no encontrado',
                error: error.message
            })
        }

        const comment = new Comment({
            publicationC: plubication._id,
            ...data,
            author: user._id,
        });

        await comment.save();

        res.status(200).json({
            succes: true,
            comment
        });

    } catch (error) {
        res.status(500).json({
            succes: false,
            msg: 'Error al crear comentario',
            error: error.message
        })
    }
}

export const getComment = async (req, res) => {
    const {limite = 10, desde = 0} = req.query;
    const query = {state: true};

    try {
        

        const comment = await Comment.find(query)
            .populate({path: 'publicationC', match: { state: true }, select: 'title' })
            .populate({path: 'author', match: { state: true }, select: 'name' })
            .skip(Number(desde))
            .limit(Number(limite));

        const total = await Comment.countDocuments(query);

        res.status(200).json({
            succes: true,
            total,
            comment
        })
    } catch (error) {
        res.status(500).json({
            succes: false,
            msg: 'Error al obtener comentario',
            error: error.message
        })
    }
} 

export const deleteComment = async (req, res) => {

    const { id } = req.params;

    try {
        const comment = await Comment.findById(id);

        if (!comment) {
            return res.status(404).json({
                succes: false,
                message: 'Comentario no encontrado'
            });
        }

        if (comment.author.toString() !== req.usuario.id) {
            return res.status(404).json({
                succes: false,
                message: 'Tu no puedes eliminar este comentario'
            });
        }

        await Comment.findByIdAndUpdate(id, {state: false});

        res.status(200).json({
            succes: true,
            message: 'Comentario eliminado'
        })

    } catch (error) {
        res.status(500).json({
            succes: false,
            msg: 'Error al eliminar comentario',
            error: error.message
        })
    }
}


export const updateComment = async (req, res  = response) => {
    try {
        const {id} = req.params;
        const {_id, email, title, ...data} = req.body;
        const comment1 = await Comment.findById(id);

        if (!comment1) {
            return res.status(404).json({
                succes: false,
                message: 'Comentario no encontrado'
            });
        }

        if (comment1.author.toString() !== req.usuario.id) {
            return res.status(404).json({
                succes: false,
                message: 'Tu no puedes actualizar este comentario'
            });
        }

        const comment = await Comment.findByIdAndUpdate(id, data, {new: true});

        res.status(200).json({
            succes: true,
            msj: 'Comentario actualizada exitosamente',
            comment
        })

    } catch (error) {
        res.status(500).json({
            succes: false,
            msj: "Error al actualizar",
            error: error.message
        })
    }
}  