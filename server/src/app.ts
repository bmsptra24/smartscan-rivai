import express, { Application } from 'express';
import { controllers } from './controllers';
import cors from 'cors';

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(
  cors({
    origin: '*', // Allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow common HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow common headers
    credentials: false, // Disable credentials for simplicity
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/hello', (req, res) => {
  res.send('Server Running!');
});
app.use('/', controllers);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;