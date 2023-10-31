// Importamos e inicializamos express
import express, { Router } from 'express';
const app = express();
// Importamos e inicializamos Router
const productRouter = express.Router();
// Declaramos el puerto
const port = 8080;
// Importamos e inicializamos la class productManager
import { ProductManager } from '../index.js'
const productManager = new ProductManager();

app.use(express.urlencoded({ extended: true }));


// Defino el endpoint /products que lee el archivo de productos y devuelve los productos dentro de un objeto
productRouter.get("/", (req, res) => {
    try {
        const productos = productManager.getProductsFromFiles();
        res.json(productos);
    } catch (err) {
        res.status(500).send("Error al leer el archivo");
    }
 });


 // Ruta '/products' con soporte para query param ?limit=
 productRouter.get("/", (req, res) => { 
    const { limit } = req.query;
    try {
        const productos = productManager.getProductsFromFiles();
        if (limit) {
            const limite = parseInt(limit, 10);
            const productosLimitados = productos.slice(0, limite);
            res.json(productosLimitados);
        } else {
            res.json(productos);
        }
    } catch (err) {
        res.status(500).send("Error al leer el archivo");
    }
 });
 

 // Ruta '/products/:pid' para obtener un producto por su ID
 productRouter.get("/:pid", (req, res) => {
    const pid = req.params.pid;
    try {
        const producto = productManager.getProductById(pid);
        if (producto) {
            res.json(producto);
        } else {
            res.status(404).send("Producto no encontrado");
        }
    } catch (err) {
        res.status(500).send("Error al buscar el producto");
    }
 });


//  Hardcodeo un producto para luego hacer el push en el metodo post y sumarlo al array de productos que se encuentra en el products.json
 let newProduct = {
    title: 'productoDePrueba',
    description: 'Este producto es usado como prueba del metodo post',
    code: 'codigoDePrueba',
    price: 1000,
    status: true,
    stock: 1,
    category: 'prueba',
    thumbnails: []
 }


// Endpoint con el metodo post para meter un nuevo producto en el array de products 
 productRouter.post('/', (req, res) => {
    newProduct = req.body;
    if(newProduct){
        products.push(newProduct);
        res.status(201).json(newProduct);
    } else {
        res.status(404).send("Error al añadir el producto");
    }
 });


// Endpoint para actualizar producto segun su ID
 productRouter.put('/:pid', (req, res) => {
    const pid = req.params.pid;
    try {
        const producto = productManager.getProductById(pid);
        if (!producto) {
            res.status(404).send("Producto no encontrado");
        } else {
            res.status(200).json(
                {
                    title: req.body.title, 
                    description: req.body.description, 
                    price: req.body.price, 
                    thumbnail: req.body.thumbnail, 
                    code: req.body.code, 
                    stock: req.body.stock, 
                    category: req.body.category, 
                    status: req.body.status 
                }
            ) 
        }
    } catch (err) {
        res.status(500).send("Error al buscar el producto");
    }
 });


//  Endpoint para borrar producto segun su id
 productRouter.delete('/:pid', (req, res) => {
    const pid = req.params.pid;
    if(product.id === pid){
        res.send({status: "Operacion realizada con exito", message: "Producto borrado"})
    } else{
        return res.status(404).send({status: "Error", error: "Producto no encontrado"})
    }
 });

 app.listen(port, () => {
    console.log(`El servidor está escuchando por el puerto ${port}`);
 });


export { productRouter };