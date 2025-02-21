import { response, request } from "express";
import argon2 from 'argon2';  // Asegúrate de importar argon2 correctamente
import User from "./user.model.js";

export const getUsers = async (req = request, res = response) => {
    try {
        const { limite = 10, desde = 0 } = req.query;
        const query = { estado: true };

        const [total, users] = await Promise.all([
            User.countDocuments(query),
            User.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
        ])

        res.status(200).json({
            sucess: true,
            total,
            users
        })
    } catch (error) {
        res.status(500).json({
            sucess: false,
            msg: 'Error al obtener usuarios',
            error
        })
    }
}

export const getUserById = async (req, res) => {
    try {

        const { id } = req.params;

        const user = await User.findById(id)

        if (!user) {
            return res.status(404).json({
                success: false,
                msg: 'Usuario not found'
            })
        }

        res.status(200).json({
            success: true,
            user
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al obtener usuarios',
            error
        })
    }
}

export const updateUser = async (req, res = response) => {
    try {
        const { id } = req.params
        const { _id, password, ...data } = req.body;

        if (password) {
            data.password = await hash(password)
        }

        const user = await User.findByIdAndUpdate(id, data, { new: true });

        res.status(200).json({
            success: true,
            msg: 'Usuario actualizado',
            user
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al actualizar user',
            error
        })
    }
}



export const updatePassword = async (req, res = response) => {
    try {
        const { id } = req.params;
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                msg: 'Se requiere tanto la contraseña vieja como la nueva.'
            });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                msg: 'Usuario no encontrado.'
            });
        }

        const isMatch = await argon2.verify(user.password, oldPassword);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                msg: 'La contraseña vieja no es correcta.'
            });
        }

        const hashedPassword = await argon2.hash(newPassword);

        const updatedUser = await User.findByIdAndUpdate(id, { password: hashedPassword }, { new: true });

        res.status(200).json({
            success: true,
            msg: 'Contraseña actualizada correctamente',
            user: updatedUser
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            msg: 'Error al actualizar la contraseña',
            error: error.message
        });
    }
};

