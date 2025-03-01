import User from '../users/user.model.js';
import Category from '../category/category.model.js'
import Comment from '../comments/comment.model.js'
import Publication from '../publications/publication.model.js'

export const existenteEmail = async (correo = ' ') => {

    const existeEmail = await User.findOne({ correo });

    if(existeEmail){
        throw new Error(`El correo ${ correo } ya existe en la base de datos`);
    }
}

export const existeUsuarioById = async (id = '') => {
    const existeUsuario = await User.findById(id);
    
    if (!existeUsuario) {
        throw new Error(`El ID ${id} no existe`);
    }
}

export const existeCategory = async (id = '') => {

    const existeCategory = await Category.findById(id);

    if(!existeCategory){
        throw new Error(`La categoria con ID ${id} no existe en la base de datos`);
    }
}

export const existeComentario = async (id = '') => {

    const existeComentario = await Comment.findById(id);

    if (!existeComentario) {
        throw new Error(`El ID ${id} no existe en la base de datos`);
    }
};

export const existePublicacion = async (id = '') => {

    const existePublicacion = await Publication.findById(id);

    if (!existePublicacion) {
        throw new Error(`El ID ${id} no existe en la base de datos`);
    }
};
