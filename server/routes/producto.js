const express = require('express');

const { verificarToken } = require('../middlewares/autenticacion');

let app = express();
let Producto = require('../models/producto');

//==================
//Obtener productos
//==================
app.get('/productos', verificarToken, (req, res) => {

    //trae todos los productos
    //populate: usuario categoria
    //paginado
    let desde = req.query.desde || 0;
    desde = Number(desde);

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(5)
        .sort('nombre')
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
            });


        })
});
//==================
//Buscar productos
//==================
app.get('/productos/buscar/:termino', verificarToken, (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('categoria', 'nombre')
        .exec((err, productos) => {


            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
            })

        })


});



//==================
//Obtener un producto por id
//==================
app.get('/productos/:id', verificarToken, (req, res) => {
    //populate us cat

    //paginado
    let id = req.params.id;
    //console.log(id);
    //Categoria.findByID ();
    Producto.findById(id, (err, producto) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'id no encontrado'
                }
            })
        }
        if (producto === null) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'producto no encontrado'
                }
            })
        }
        res.json({
            ok: true,
            producto
        })
    })
});


//==================
//crear un producto por id
//==================
app.post('/productos', verificarToken, (req, res) => {
    //grabar us
    //grabar cat
    //nombre   
    let body = req.body;


    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, productoBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!productoBD) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            productoBD
        });
    })
});
//==================
//actualizar producto
//==================
app.put('/productos/:id', (req, res) => {
    //grabar us
    //grabar cat
    //nombre
    let id = req.params.id;
    //console.log(id);
    let body = req.body;
    // console.log('object');

    Producto.findByIdAndUpdate(id, body, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            productoAntiguo: productoDB,
            producto_Actualizado: body
        })
    })
});
//==================
//delete producto
//==================
app.delete('/productos/:id', (req, res) => {
    //grabar us
    //grabar cat
    //nombre
    let id = req.params.id;

    Producto.findByIdAndUpdate(id, { disponible: false }, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no existe'
                }
            });
        }

        res.json({
            ok: true,
            productoDB,
            message: 'Producto borrado'
        })
    })
});
module.exports = app;