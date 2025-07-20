import express from 'express';
import dotenv from 'dotenv';
import paymentRoutes from './routes/payment.routes.js';
import morgan from 'morgan';
// importar cors 
import cors from 'cors';
dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
app.use(cors(
  {
    origin: process.env.BASE_URL || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    allowedHeaders: ['Content-Type', 'Authorization'],
  }
)); 
app.use(morgan('dev'),);
app.use(express.json());
app.use('/api/payments', paymentRoutes);

app.use((req, res, next) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
