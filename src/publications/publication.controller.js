import { response } from "express";
import Category from '../category/category.model.js';
import User from '../users/user.model.js';
import Publication from './publication.model.js';
import Comment from '../comments/comment.model.js'

export const savePublication = async (req, res) => {
    try {
        
        const data = req.body;

        const category = await Category.findOne({name: data.name});
        const user = await User.findOne({email: data.email});   

        if(!user){
            return res.status(404).json({
                succes: false,
                message: 'Usuario no encontrado',
                error: error.message
            })
        }if(!category){
            return res.status(404).json({
                succes: false,
                message: 'Categoria no encontrada',
                error: error.message
            })
        }

        const publication = new Publication({
            category: category._id,
            ...data,
            author: user._id,
        });

        await publication.save();

        res.status(200).json({
            succes: true,
            publication
        });

    } catch (error) {
        res.status(500).json({
            succes: false,
            msg: 'Error al crear la publicacion',
            error: error.message
        })
    }
}

export const getPublication = async (req, res) => {
    const {limite = 10, desde = 0} = req.query;
    const query = {status: true};

    try {
        
        const [total, publication] = await Promise.all([
            Publication.countDocuments(query),
            Publication.find(query)
            .populate({path: 'category', match: { status: true }, select: 'name' })
            .populate({ path: 'author', match: { estado: true }, select: 'name' })
            .populate({ path: 'comments', match: { status: true }, select: 'comment' })
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
            msg: 'Error al obtener la publicacion',
            error: error.message
        })
    }
} 

export const deletePublication = async (req, res) => {
    const { id } = req.params;

    try {
        const publication = await Publication.findById(id).populate('comments');

        if (!publication) {
            return res.status(404).json({
                success: false,
                message: 'Publicación no encontrada'
            });
        }

        if (publication.author.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'No puedes eliminar esta publicación'
            });
        }

        if (publication.comments && publication.comments.length > 0) {
            await Comment.updateMany(
                { _id: { $in: publication.comments.map(comment => comment._id) } },
                { status: false }
            );
        }

        // Desactivar la publicación
        await Publication.findByIdAndUpdate(id, { status: false });

        res.status(200).json({
            success: true,
            message: 'Publicación eliminada totalmente'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al eliminar la publicación',
            error: error.message
        });
    }
};


export const updatePublication = async (req, res  = response) => {
    try {
        const {id} = req.params;
        const {_id, email, ...data} = req.body;
        const publication1 = await Publication.findById(id);

        if (!publication1) {
            return res.status(404).json({
                succes: false,
                message: 'Publicacion no encontrado'
            });
        }

        if (publication1.author.toString() !== req.user.id) {
            return res.status(404).json({
                succes: false,
                message: 'Tu no puedes editar esta publicacion'
            });
        }

        const publication = await Publication.findByIdAndUpdate(id, data, {new: true});

        res.status(200).json({
            succes: true,
            msj: 'Publicacion actualizada exitosamente',
            publication
        })

    } catch (error) {
        res.status(500).json({
            succes: false,
            msj: "Error al actualizar la publicacion",
            error: error.message
        })
    }
} 