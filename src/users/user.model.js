import { Schema, model } from "mongoose";

const UserSchema = Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
    },
    lastname: {
        type: String,
        required: [true, 'Lastname is required'],
        unique: true
    },
    username: {
        type: String,
        unique: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    phone: {
        type: String,
        minLength: 8,
        maxLength: 8,
        required: [true, 'Phone number is required']
    },
    role: {
        type: String,
        required: false,
        enum: ['Cliente', 'Admin'], // Agrega 'Admin' como opción válida para el rol
    },
    estado: {
        type: Boolean,
        default: true
    },
},
    {
        timestamps: true,
        versionKey: false
    }
);

// Método para ajustar la salida de JSON
UserSchema.methods.toJSON = function () {
    const { __v, password, _id, role, ...usuario } = this.toObject(); // Extraemos los campos a ocultar
    usuario.uid = _id;

    // Oculta el campo `role` si no es administrador
    if (role !== 'Admin') {
        delete usuario.role;
    }

    return usuario;
}

export default model('user', UserSchema);
