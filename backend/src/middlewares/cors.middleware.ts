// src/middleware/cors.ts
import cors from 'cors';

const allowedOrigins = ['http://localhost:5050', 'http://localhost:3000', 'http://localhost:5730']; // Add your frontend URLs here

export const corsOptions: cors.CorsOptions = {
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

export default cors(corsOptions);
