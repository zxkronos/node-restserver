//=========================
// Puerto
// ========================
process.env.PORT = process.env.PORT || 3000;

//=========================
// Entorno
// ========================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//=========================
// Vencimiento del token
// ========================
// 60 seg
// 60 min
// 24 horas
// 30 días
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

//=========================
// Seed de autenticacion
// ========================
process.env.SEED = process.env.SEED | 'Seed-secreto';

//=========================
// Entorno
// ========================
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URL;
}
process.env.URLDB = urlDB;