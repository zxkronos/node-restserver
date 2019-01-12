const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');

const Usuario = require('../models/usuario');
const { verificarToken, verificarAdmin_Rol } = require('../middlewares/autenticacion');

const app = express();

app.get('/usuario', verificarToken, function(req, res) {

    return res.json({
        usuario: req.usuario,
        nombre: req.usuario.nombre,
        email: req.usuario.email
    })


    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Usuario.find({ estado: true }, 'nombre email role estado google img')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Usuario.count({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    cuantos: conteo,
                    usuarios

                });
            });
        });

})

app.post('/usuario', [verificarToken, verificarAdmin_Rol], function(req, res) {
    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });


    usuario.save((err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }


        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });

})

app.put('/usuario/:id', [verificarToken, verificarAdmin_Rol], verificarToken, function(req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);


    Usuario.findOneAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    })


})

app.delete('/usuario/:id', [verificarToken, verificarAdmin_Rol], verificarToken, function(req, res) {
    let id = req.params.id;
    console.log(id);
    let cambiaEstado = {
        estado: false
    }

    Usuario.findByIdAndUpdate(id, { estado: false }, { new: true }, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (usuarioBorrado === null) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'usuario no encontrado'
                }
            });
        }

        //  usuarioBorrado.estado = false;

        res.json({
            ok: true,
            usuario: usuarioBorrado
        })
    })

});

module.exports = app;