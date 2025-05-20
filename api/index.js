// // Este archivo es el punto de entrada para Vercel Serverless Functions
// const app = require('../app');

// // Exportamos la aplicación Express para que Vercel la maneje
// module.exports = app;


//////////////////////////////////////////////////////////////////////////////////////////

// هذا الملف هو نقطة الدخول لـ Vercel Serverless Functions
const app = require('../app');
const cors = require('cors');


// تطبيق CORS بشكل إضافي قبل تصدير التطبيق
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Origin', 'Accept'],
    credentials: true
}));

// اضافة معالج خاص للطلبات من نوع OPTIONS
app.options('*', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    res.status(200).send();
});

// تصدير تطبيق Express لكي يتم التعامل معه بواسطة Vercel
module.exports = app;