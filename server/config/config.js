// ============= 
// Puerto
// =============
process.env.PORT = process.env.PORT || 3000;

// ============= 
// Entorno
// =============
// Si la variable no existe, entonces estamos en desarrollo (local)
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ============= 
// Base de Datos
// =============
let urlDB;

if ( process.env.NODE_ENV == 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    // urlDB = 'mongodb+srv://MonoQr:pQgBnuvs7VkZAJPn@cluster0-vfmsu.mongodb.net/cafe';
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;