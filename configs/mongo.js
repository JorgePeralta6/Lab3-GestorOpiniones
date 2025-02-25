'use strict';

import mongoose from "mongoose";
import User from "../src/users/user.model.js";
import Category from "../src/category/category.model.js"
import argon2 from 'argon2';


export const dbConnection = async () => {
    try{
        mongoose.connection.on('error', ()=>{
            console.log('MongoDB | Could not be connected to MongoDB');
            mongoose.disconnect();
        });
        mongoose.connection.on('connecting', ()=>{
            console.log('MongoDB | Try connecting');
        });
        mongoose.connection.on('connected', ()=>{
            console.log('MongoDB | connected to MongoDB');
        });
        mongoose.connection.on('open', ()=>{
            console.log('MongoDB | connected to database');
        });
        mongoose.connection.on('reconnected', ()=>{
            console.log('MongoDB | reconnected to MongoDB');
        });
        mongoose.connection.on('disconnected', ()=>{
            console.log('MongoDB | disconnected');
        });
        mongoose.connect(process.env.URI_MONGO, {
            serverSelectionTimeoutMS: 5000,
            maxPoolSize: 50,
        });
    }catch(error){
        console.log('Database connection failed', error);
    }
}

export const defaultAdmin = async() => {
    try {
        const adminExists = await User.findOne({ role: "Admin"});

        if (!adminExists) {
            const hashedPassword = await argon2.hash("adminUse");

            const adminUser = new User({
                name: "Admin",
                lastname: "User",
                username: "admin",
                email: "defaultadmin@gmail.com",
                password: hashedPassword,
                phone: "00000000",
                role: "Admin",
                estado: true
            });

            await adminUser.save();
            console.log("Admin creado con exito");
        }else{
            console.log("Ya hay admin existente");
        }

    } catch (error) {
        console.log("Error al crear al administrador", error.message);
    }
}

export const createCategoria = async() => {
    try {
        const categoriaExists = await Category.findOne({name: "Deportes"});

        if(!categoriaExists){
            const categoriaDefault = new Category({
                name: "Deportes"
            });

            await categoriaDefault.save();
            console.log("Categoria creada con exito");
        }else{
            console.log(`Categoria ya existente`)
        }
    } catch (error) {
        console.log("Error al crear la categoria")
    }
}
