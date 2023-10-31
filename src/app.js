// Importamos express e inicializamos express
import express from "express";
import { productRouter } from "./routes/products.router";
import { cartRouter } from "./routes/carts.router";

const app = express();
const port = 8080; 

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);



app.listen(port, () => {
    console.log(`El servidor está escuchando por el puerto ${port}`);
 });
