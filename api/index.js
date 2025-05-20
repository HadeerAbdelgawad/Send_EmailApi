// هذا الملف هو نقطة الدخول لـ Vercel Serverless Functions
const app = require('../app');
const cors = require('cors');
const { connectToDatabase } = require('../src/db/mongoose');

// تعريف URL للموقع المسموح له بالوصولن URL الخاص بموقعك الأمامي
const allowedOrigin = ['https://ksa-afflite.vercel.app']; // قم بتغيير هذا إلى عنوان URL الخاص بموقعك الأمامي

// تطبيق CORS بشكل إضافي قبل تصدير التطبيق
app.use(cors({
    origin: allowedOrigin, // السماح فقط للأصل المحدد
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Origin', 'Accept'],
    credentials: true
}));

// اضافة معالج خاص للطلبات من نوع OPTIONS
app.options('*', (req, res) => {
    const origin = req.headers.origin;

    // التحقق ما إذا كان الأصل مسموح به
    if (origin === allowedOrigin) {
        res.header('Access-Control-Allow-Origin', origin);
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
        res.status(200).send();
    } else {
        // إذا كان الأصل غير مصرح له، قم بإرجاع استجابة CORS مقيدة
        res.status(403).json({ error: 'CORS not allowed for this origin' });
    }
});

// تأكد من الاتصال بقاعدة البيانات قبل معالجة أي طلب
let isConnected = false;

// معالج ميدلوير للتأكد من الاتصال بقاعدة البيانات
app.use(async (req, res, next) => {
    if (!isConnected) {
        try {
            await connectToDatabase();
            isConnected = true;
            next();
        } catch (error) {
            console.error('Error connecting to database:', error);
            return res.status(500).json({ error: 'Database connection failed' });
        }
    } else {
        next();
    }
});

// تصدير تطبيق Express لكي يتم التعامل معه بواسطة Vercel
module.exports = app;