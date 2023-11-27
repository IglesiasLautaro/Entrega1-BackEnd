import mongoose from "mongoose";

const cartsCollection = 'carts';

const cartsSchema = new mongoose.Schema({
    carritoId: {
        type: Number,
        required: true,
    },
    productoId: {
        type: Number,
        required: true,
    },
    producto: String,
})



export const Carts = mongoose.model(cartsCollection, cartsSchema);