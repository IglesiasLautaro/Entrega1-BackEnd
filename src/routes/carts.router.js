// Importamos e inicializamos tanto express como Router
import express, { json } from 'express';
const cartRouter = express.Router();

// Importamos fs 
import fs from 'fs';
import { Carts } from '../dao/models/carts.model';

// Definimos un array llamado carritos que va a contener todos los "carros"
const carritos = {};

// Función para generar un ID único para los carritos
function generarId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}
// Declaramos la constante CARROS_DB_FILE con el arhivo carrito.json para poder agregarlo al fs.wrtieFile y crear el archivo
// const CARROS_DB_FILE = 'carrito.json';

// Lee los datos de los carritos desde el archivo
async function cargarCarritosDesdeArchivo() {
    try {
        const data = await fs.readFileSync('../src/carrito.json', 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        // Si el archivo no existe o hay un error al leerlo, devuelve un objeto vacío
        return {};
    }
}

// Guarda los datos de los carritos en el archivo
async function guardarCarritosEnArchivo(carritos) {
    try {
        await fs.writeFileSync('../src/carrito.json', JSON.stringify(carritos, null, 2));
    } catch (error) {
        console.error('Error al guardar los datos de los carritos:', error);
    }
}

//ENDOPOINTS PARA PROBAR LA DATABASE DE MONGO ATLAS con los models y routes

cartRouter.get('/', async(res, req) => {
    try{
        let cart = await Carts.find();
        res.setEncoding({result: "success", payload: cart});
    }catch(error){
        console.log("Cannot get user with moongose: ", error)
        res.send({ result: "Error"})
    }
})

cartRouter.post('/', async(res, req) => {
    let {carritoId, productoId, producto} = req.body;

    if(!carritoId || !productoId || !producto)
        return res.send({status: "Error", error: "Incomplete values"})

    let result = await Carts.create({
        carritoId,
        productoId,
        producto,
     });

    res.send({result: "success", payload: result})
});

cartRouter.put('/:uid', async(res, req) => {
    let { uid } = req.params;
    let cartToReplace = req.body;

    if(
        !cartToReplace.carritoId || 
        !cartToReplace.productoId || 
        !cartToReplace.producto
    ) {
        res.send({status: "Error", error: "Incomplete values"})
    } else {
        let result = await Carts.updateOne({
            _id: uid,
        }, 
        cartToReplace
     );

    res.send({result: "success", payload: result})
    }
});

cartRouter.delete('/:uid', async(res, req) => {
    let { uid } = req.params;

    let result = await Carts.deleteOne({
        _id: uid,
    });

    res.send({result: "success", payload: result})
});

//-------------------------------------------------------------------------------------------------------------------//
cartRouter.post('/', async (req, res) => {
    const carritos = await cargarCarritosDesdeArchivo(); 
    const nuevoCarrito = {
        id: generarId(),
        products: []
    };
    // Agrega el nuevo carrito a los carritos cargados
    carritos[nuevoCarrito.id] = nuevoCarrito; 
    // Guarda los carritos actualizados en el archivo
    await guardarCarritosEnArchivo(carritos);
    res.json({ mensaje: 'Nuevo carrito creado correctamente', carrito: nuevoCarrito });
});


cartRouter.get('/:cid', (req, res) => {
    const carritoId = req.params.cid; 
    const productosEnCarrito = carritos[carritoId]; 

    if (productosEnCarrito) {
        res.status(201).json(productosEnCarrito);
    } else {
        res.status(404).json({ mensaje: 'Carrito no encontrado' });
    }

});


cartRouter.post('/:cid/product/:pid', (req, res) => {
    const carritoId = req.params.cid; // Obtiene el parámetro cid de la URL
    const productoId = req.params.pid; // Obtiene el parámetro pid de la URL
    const cantidad = req.body.quantity || 1; // Obtiene la cantidad del cuerpo de la solicitud o establece 1 por defecto

    if (!carritos[carritoId]) {
        return res.status(404).json({ mensaje: 'Carrito no encontrado' });
    }

    const productoExistente = carritos[carritoId].products.find(producto => producto.product === productoId);

    if (productoExistente) {
        productoExistente.quantity += cantidad;
    } else {
        carritos[carritoId].products.push({ product: productoId, quantity: cantidad });
    }

    res.json({ mensaje: 'Producto agregado al carrito correctamente' });
});

export { cartRouter };