
const express = require('express');

const bcrypt = require('bcrypt');
const _ = require('underscore'); // El estandar es usar el guión bajo

const Usuario = require('../../models/usuario'); // Con la U mayusucla para seguir estandar

const app = express();


app.get('/', function (req, res) {
    res.json('Hello World')
})


app.get('/usuario', function (req, res) {
    
    // Los parametros opcionales caen desde el req.query
    // Si no viene la variable desde entonces se propone la primera página
    let desde = Number(req.query.desde) || 0;


    let limite = Number(req.query.limite) || 5;

    Usuario.find({ estado: true }, 'nombre email role estado google img')
            .limit(limite)
            .skip(desde)
            .exec( (err, usuarios) => {

                if ( err ) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                // Para contar los registros
                Usuario.count({ estado: true }, (err, conteo)=>{

                    res.json({
                        ok: true,
                        usuarios,
                        cuantos: conteo
                    });

                });

            });

});
  
app.post('/usuario', function (req, res) {
    
    let body = req.body;

    // Instanciar el objeto
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync( body.password, 10 ),
        // img: body.img,
        role: body.role,
        google: body.google
    });
    
    // Guardar el objeto en la base de datos
    usuario.save( (err, usuarioDB) => {
        
        if ( err ) {
            return res.status(400).json({
                ok: false,
                err
            });
        }


        // Quitar el password retornado al usuario
        // Se creó usuarioSchema.methods.toJSON en models/usuario.js

        // El estatus 200 (correcto) esta implicito.
        res.json({
            ok: true,
            usuario: usuarioDB
        });

    });


   /*  if ( body.nombre === undefined) {
        res.status(400).json({
            ok: false,
            mensaje: 'El nombre es necesario'
        });
    } else {
        res.json({
            persona: body
        });
    } */

});

app.put('/usuario/:id', function (req, res) {

    let id = req.params.id;
    let body = _.pick( req.body, ['nombre', 'email', 'img', 'role', 'estado'] );


    // delete body.password;
    // delete body.google;

    /* Usuario.findById( id, ( err, usuarioDB ) =>{
        usuarioDB.save();
    }); */

    // Es necesario incluir Options en Moongose para que se
    // obtenga los nuevos valores
    options = {
        new: true,
        runValidators: true
    }
    Usuario.findByIdAndUpdate( id, body, options , ( err, usuarioDB ) =>{

        if ( err ) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB // Se regresó el documento Original
        });
    });

});

app.delete('/usuario1/:id', function (req, res) {
    
    let id = req.params.id;

    Usuario.findByIdAndRemove( id, (err, usuarioBorrado) => {
        if ( err ) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        if ( !usuarioBorrado ) {
            return res.status(400).json({
                ok: false,
                err : {
                    menssage: 'Usuario no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        })
    });

});

app.delete('/usuario/:id', function (req, res) {
    
    let id = req.params.id;
    // Opción 2
    // let body = _.pick( req.body, ['estado'] );
    // body.estado = false;

    // Opción 1
    let body = {
        estado: false
    }

    /*
    Usuario.findById( id, (err, usuarioDB ) => {

         if ( err ) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        usuarioDB.estado = false;
        usuarioDB.save();

        res.json({
            ok: true, 
            usuario: usuarioDB
        });

    });
    */

    Usuario.findByIdAndUpdate( id, body, { new: true }  , ( err, UsuarioDB ) => {
        if ( err ) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        res.json({
            ok: true, 
            usuario: UsuarioDB
        })
    });

});

module.exports = app;