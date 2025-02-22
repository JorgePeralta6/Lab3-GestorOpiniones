import { response, request } from 'express';
import Category from './category.model.js';
import User from '../users/user.model.js'

export const saveCategory = async (req, res) => {
    try {

        const data = req.body;
        const category = new Category({
            ...data,
            admin: req.user._id
        });

        console.log(req.body);

        await category.save();

        if (req.user.role !== 'Admin') {
            return res.status(403).json({
                success: false,
                message: "Acceso denegado: Solo el administrador puede crear categorías."
            });
        }

        res.status(200).json({
            success: true,
            category
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al guardar categoría',
            error: error.message
        });
    }
};


export const getCategory = async (req = request, res = response) => {
    const { limite = 10, desde = 0 } = req.query;
    const query = { status: true };

    try {

        const categorys = await Category.find(query)
            .skip(Number(desde))
            .limit(Number(limite));

        const categoryWithOwnerNames = await Promise.all(categorys.map(async (category) => {
            const owner = await User.findById(category.admin);
            return {
                ...category.toObject(),
                admin: owner ? owner.name : "Admin no encontrado"
            }
        }))

        const total = await Category.countDocuments(query);

        res.status(200).json({
            success: true,
            total,
            categorys: categoryWithOwnerNames
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al obtener categoria',
            error: error.message
        })
    }
}

export const searchCategory = async (req, res) => {

    const { id } = req.params;

    try {
        const category = await Category.findById(id);

        if (!category) {
            return res.status(404).json({
                success: false,
                msg: 'Categoria no encontrada'
            })
        }

        const owner = await Category.findById(category.admin);

        res.status(200).json({
            success: true,
            category: {
                ...category.toObject(),
                admin: owner ? owner.name : "Admin no encontrado"
            }
        })
    } catch (error) {
        res.status(500).json({
            success: true,
            msg: 'Error al buscar categoria',
            error: error.message
        })
    }
}

export const updateCategory = async (req, res = response) => {
    try {

        const { id } = req.params;
        const { _id, ...data } = req.body;

        const category = await Category.findByIdAndUpdate(id, data, { new: true });

        res.status(200).json({
            success: true,
            msg: 'Categoria actualizada',
            category
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al actualizar categoria',
            error: error.message
        })
    }
}

export const deleteCategory = async (req, res) => {

    const { id } = req.params;

    try {

        await Category.findByIdAndUpdate(id, { status: false });

        res.status(200).json({
            success: true,
            msg: 'Categoria eliminada exitosamente'
        });
    } catch (error) {
        console.log("hola")
        res.status(500).json({
            success: false,
            msg: 'Error al eliminar categoria',
            error
        })
    }
}