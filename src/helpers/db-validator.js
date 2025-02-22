import User from '../users/user.model.js';
import Category from '../category/category.model.js'

export const esRoleValido = async (role = '') => {

    const existeRol = await Role.findOne({ role });

    if(!existeRol){
        throw new Error(`El rol ${ role } no existe en la base de datos`);
    }
}

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

    console.log(id)
    const existeCategory = await Category.findById(id);

    if(!existeCategory){
        throw new Error(`La categoria con ID ${id} no existe en la base de datos`);
    }
}
