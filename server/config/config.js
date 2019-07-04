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
// Vencimiento del Token
// =============
// 60 Segundos
// 60 minutos
// 24 horas
// 30 días
process.env.CADUCIDAD_TOKEN = 60 * 60 * 34 * 30;

// ============= 
// SEED  de autenticación
// =============
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

// ============= 
// Base de Datos
// =============
let urlDB;

if ( process.env.NODE_ENV == 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

// ============= 
// Google Client ID
// =============
process.env.CLIENT_ID = process.env.CLIENT_ID || '477123512460-fqc4furshv54dmqb6q5g6fcps9qeb0h0.apps.googleusercontent.com';