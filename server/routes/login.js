const express = require('express');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

const Usuario = require('../../models/usuario');

const app = express();


app.post('/login', (req, res) => {

    // Obtener datos del body
    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB ) => {

        if ( err ) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if( !usuarioDB ) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o contraseña incorrectos'
                }
            });
        }

        // Comparar contraseñas
        if( !bcrypt.compareSync( body.password, usuarioDB.password )) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o contraseña incorrectos'
                }
            });
        }

        // Generar token
        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN }); // Expire en 30 días

        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });

    });

});


// Configuraciones de Google
async function verify( token ) {

    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];
    
    console.log(payload.name);
    console.log(payload.email);
    console.log(payload.picture);

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    };
};


app.post('/google', async (req, res) => {

    let token = req.body.idtoken;
    let googleUser;

    try {
        googleUser = await verify( token );
    } catch ( err ) {
            return res.status(403).json({
                ok: false,
                err:  'Token no Valido. ERROR 403: ' + e
            });
    }
    
                        
    
    // Buscar el usuario en el correo.
    Usuario.findOne( {email: googleUser.email }, ( err, usuarioDB )=>{
        if ( err ) {
            return res.status(500).json({
                ok: false,
                err
            });
        };

        if ( usuarioDB ) {
            
            // Uusario ya existe pero se autenticó normalmente
            if ( usuarioDB.google === false ) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "Debe de usar su autenticación normal."
                    }
                });
            } else {
                // Usuario autenticado con Google
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN }); // Expire en 30 días

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                });
            }
        } else {
            // Si el usuario no existe en nuestra base de datos.
            let usuarioA = new Usuario({
                nombre: googleUser.nombre
            });
            
            console.log('usuarioA:', usuarioA, ' GoogleNombre:', googleUser.nombre);

            let usuario = new Usuario();

            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':D';

            // Grabar usuario en la base de datos
            usuario.save( (err, usuarioDB) => {

                if (err) {
                    return res.status(500).json({
                        ok:false,
                        err: {
                            message: 'ERROR 500 ' + err
                        }
                    });
                };

                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN }); // Expire en 30 días

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                });

            });
        }

    });

    /* res.json({
        usuario: googleUser
    }); */



});

module.exports = app;