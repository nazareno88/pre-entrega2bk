import express from 'express';
import { engine } from 'express-handlebars';
import http from 'http';
import { Server as SocketIO } from 'socket.io';
import path from 'path';
import _dirname from './src/utils.js';
import viewsRouter from './src/routes/viewsRouter.js';
import fs from 'fs/promises';

const app = express();
const server = http.createServer(app);
const io = new SocketIO(server);


app.engine('handlebars', engine());
app.set('view engine', 'handlebars');


app.set('views', path.join(_dirname, '../views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', viewsRouter);

let productos = [];

const cargarProductos = async () => {
    try {
        const data = await fs.readFile('./data/productos.json', 'utf-8');
        productos = JSON.parse(data);
    } catch (error) {
        console.error('Error al leer el archivo de productos:', error);
    }
};

cargarProductos();

io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');
    socket.emit('productosActualizados', productos);
    
    socket.on('nuevoProducto', (producto) => {
        productos.push(producto);
        io.emit('productosActualizados', productos);
    });
});


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
