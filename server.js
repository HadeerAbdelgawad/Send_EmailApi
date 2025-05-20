// Server file for local development
const app = require('./index');
const port = process.env.PORT || 3000;
const { connectToDatabase } = require('./src/db/mongoose');

// اتصل بقاعدة البيانات ثم ابدأ الخادم
connectToDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
      console.log(`API endpoint available at: http://localhost:${port}/api/order`);
      console.log(`Health check available at: http://localhost:${port}/health`);
    });
  })
  .catch(err => {
    console.error('Failed to connect to database on startup:', err);
    process.exit(1);
  });
