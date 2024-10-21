import { Router } from 'express';
import fs from 'fs/promises';
import path from 'path';

const router = Router();
const productosFilePath = path.join(process.cwd(), 'data', 'productos.json');

let productos = [];


const cargarProductos = async () => {
    try {
        const data = await fs.readFile(productosFilePath, 'utf-8');
        productos = JSON.parse(data);
    } catch (error) {
        console.error('Error al leer el archivo de productos:', error);
    }
};


cargarProductos();

router.get('/', (req, res) => {
    res.render('home', { productos });
});

export default router;