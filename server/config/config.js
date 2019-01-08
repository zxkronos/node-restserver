//=========================
// Puerto
// ========================
process.env.PORT = process.env.PORT || 3000;

//=========================
// Entorno
// ========================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


//=========================
// Entorno
// ========================
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb://cafe-user:zx8090@ds151614.mlab.com:51614/cafe';
}
process.env.URLDB = urlDB;