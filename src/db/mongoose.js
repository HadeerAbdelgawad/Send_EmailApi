const mongoose = require('mongoose')
let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
  }

const connectionString = 'mongodb+srv://hadeer:AtHSk0lTXzfQH2Zd@cluster0.dl4nvru.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Set mongoose options for Vercel serverless environment
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    autoCreate: true
};

// Cache para la conexión de MongoDB

// Función para conectar a MongoDB con reintentos
const connectToDatabase = async () => {
    if (cached.conn) return cached.conn;

    if (!cached.promise) {
        cached.promise = mongoose.connect(connectionString, options).then((mongoose) => {
          console.log('✅ Connected to MongoDB');
          return mongoose;
        });
      }
    
      cached.conn = await cached.promise;
      return cached.conn;
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



// Mantener compatibilidad con código antiguo que importa este archivo directamente
if (require.main === module) {
    connectWithRetry();
}

// Exportar la función para uso en otros archivos
module.exports = { connectToDatabase, connectWithRetry };