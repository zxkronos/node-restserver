const express = require('express');
const _ = require('underscore');

const { verificarToken, verificarAdmin_Rol } = require('../middlewares/autenticacion');
//const jwt = require('jsonwebtoken');
let Categoria = require('../models/categoria');
const app = express();



//=============================
// mostrar todas las categorias
//=============================
app.get('/categoria', verificarToken, (req, res) => {
    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                categorias
            });


        })

});
//=========================
//mostrar categoria por id
//=========================
app.get('/categoria/:id', verificarToken, (req, res) => {
    let id = req.params.id;
    //console.log(id);
    //Categoria.findByID ();
    Categoria.findById(id, (err, categoria) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'id no encontrado'
                }
            })
        }
        if (categoria === null) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrada'
                }
            })
        }
        res.json({
            ok: true,
            categoria
        })
    })
});
//======================
//Crear nueva categoria
//======================
app.post('/categoria', [verificarToken, verificarAdmin_Rol], (req, res) => {
    let nom = req.body.descripcion;
    //console.log(req.usuario._id);
    let categoria = new Categoria({
        descripcion: nom,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }


        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });

});
//====================================
// actualiza el nombre de la categoria
//====================================
app.put('/categoria/:id', [verificarToken, verificarAdmin_Rol], (req, res) => {
    let id = req.params.id;
    //console.log(id);
    let body = req.body;
    // console.log('object');
    let nom = {
        nombre: body.descripcion
    }
    Categoria.findByIdAndUpdate(id, nom, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoriaAntigua: categoriaDB,
            categoriaNueva: nom
        })
    })

});
//===========================
//borra una categoria por id
//===========================
app.delete('/categoria/:id', [verificarToken, verificarAdmin_Rol], (req, res) => {
    let id = req.params.id;

    Categoria.findByIdAndUpdate(id, { estado: false }, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no existe'
                }
            });
        }

        res.json({
            ok: true,
            categoriaDB,
            message: 'Categoría borrada'
        })
    })

});
module.exports = app;