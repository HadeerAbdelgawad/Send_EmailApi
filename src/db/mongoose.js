const mongoose = require('mongoose')

const connectionString = 'mongodb+srv://hadeer:AtHSk0lTXzfQH2Zd@cluster0.dl4nvru.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Set mongoose options for Vercel serverless environment
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    autoCreate: true
};

// Cache para la conexión de MongoDB
let cachedConnection = null;

// Función para conectar a MongoDB con reintentos
const connectToDatabase = async () => {
    if (cachedConnection) {
        console.log('Using existing MongoDB connection');
        return cachedConnection;
    }
    
    console.log('MongoDB connection attempt...');
    try {
        const connection = await mongoose.connect(connectionString, options);
        console.log('MongoDB connected successfully');
        cachedConnection = connection;
        return connection;
    } catch (err) {
        console.error('MongoDB connection error:', err);
        // Reintento si estamos en Vercel
        if (process.env.VERCEL_ENV) {
            console.log('Will retry MongoDB connection...');
            throw err; // Propagar el error para manejo externo
        }
        throw err;
    }
};

// Para compatibilidad con el código existente
const connectWithRetry = () => {
    console.log('Using legacy connection method');
    mongoose.connect(connectionString, options)
        .then(() => {
            console.log('MongoDB connected successfully (legacy)');
        })
        .catch(err => {
            console.error('MongoDB connection error (legacy):', err);
            if (process.env.VERCEL_ENV) {
                console.log('Retrying MongoDB connection in 3 seconds...');
                setTimeout(connectWithRetry, 3000);
            }
        });
};

// Exportar la función para uso en otros archivos
module.exports = { connectToDatabase, connectWithRetry };

// Mantener compatibilidad con código antiguo que importa este archivo directamente
if (require.main === module) {
    connectWithRetry();
}
