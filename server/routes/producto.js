const express = require('express');

const { verificaToken } = require('../middleware/autentication');

const _ = require('underscore');

var app = express();
var Producto = require('../../models/producto')


/*
VER
https://code.tutsplus.com/es/articles/an-introduction-to-mongoose-for-mongodb-and-nodejs--cms-29527
*/

// =======================
// Obtener productos
// =======================
app.get('/productos', verificaToken, (req, res) =>{
    // Trae todos los productos
    // populate
    // paginado

    let desde = Number(req.query.desde) || 0;
    let limite = Number(req.query.limite) || 5;

    Producto.find({ disponible: true })
            .skip(desde)
            .limit(limite)
            .populate('Categoria', 'descripcion')
            .populate('usuario', 'nombre email')
            .sort('nombre')
            .exec( ( err, productosDB ) =>{
                
                if ( err ) {
                    return res.status(500).json({
                        ok: false, 
                        err: err
                    });
                }

                if( !productosDB ) {
                    return res.status(400).json({
                        ok: false,
                        err: err
                    });
                }

                res.json({
                    ok: true,
                    productos: productosDB
                });

            });

});

// =======================
// Obtener producto por ID
// =======================
app.get('/productos/:id', verificaToken, (req, res) => {
    // Traepopulate: usuario categoria
    // populate

    let id = req.params.id;

    Producto.findById( id )
        .populate('Categoria', 'descripcion')
        .populate('usuario', 'nombre email')
        .exec( (err, productoDB ) =>{
        if ( err ) {
            return res.status(500).json({
                ok: false,
                err: err
            });
        }

        if( !productoDB ){
            return res.status(400).json({
                ok:fakse, 
                err: err
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });

    });

});


// =======================
// Buscar producto
// =======================
app.get('/productos/buscar/:termino', verificaToken, (req, res ) => {

    let termino = req.params.termino;

    // Expresión regular que es (i) insesible a las mayus y minus
    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
    .populate('Categoria', 'nombre')
    .exec( (err, productosDB )=>{
        if(err) {
            return res.status(500).json({
                ok: false, 
                err: err
            });

        }

        res.json({
            ok: true,
            productos: productosDB
        });
    });
});

// =======================
// Crear un nuevo producto
// =======================
app.post('/productos', verificaToken, (req, res)=>{
    // grabar el usuario
    // grabar una categoria del listado

    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        Categoria: body.categoria,
        usuario: req.usuario._id
    });

    console.log(producto);

    producto.save( (err, productoDB ) => {

        if ( err ){
            return res.status(500).json({
                ok: falase,
                err: err
            });
        }

        res.status(201).json({
            ok: true, 
            producto: productoDB
        });

    });

});

// =======================
// Actualizar un producto
// =======================
app.put('/productos/:id', verificaToken, (req, res)=>{
    // grabar el usuario
    // grabar una categoria del listado

 /*  
    -- Opción del tutor
    let id = req.params.id;
    let body = req.body;

    // let data = _.pick( body , ['nombre', 'precioUni', 'descripcion', 'usuario', 'categoria'] );

    Producto.findByIdAndUpdate( id, body, { new: true } , ( err, productoDB ) =>{
        if ( err ) {
            return res.status(500).json({
                ok: false, 
                err: err
            });
        }

        if ( !productoDB ) {
            return res.status(400).json({
                ok: false, 
                err: {
                    message: 'El ID no es correcto.'
                }
            });
        }

        productoDB.nombre = body.nombre;
        // productoDB.usuario = body.usuario;
        productoDB.categoria = body.categoria;
        productoDB.disponible = body.disponible;
        productoDB.precioUni = body.precioUni;
        productoDB.descripcion = body.descripcion;

        productoDB.save( (err, productoGuardado ) => {
            if ( err ) {
                return res.status(500).json({
                    ok: false, 
                    err: err
                });
            }

            res.json({
                ok: true,
                producto: productoGuardado
            })
        });


    }); */

    // La opción que realice
    let id = req.params.id;
    let body = req.body;
    body.usuario = req.usuario._id;

    body = _.pick( body, ['nombre', 'usuario', 'categoria', 'disponible', 'precioUni', 'descripcion'] );

    Producto.findByIdAndUpdate( id, body, {new:true}, (err, productoDB ) =>{
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
                    message: 'El ID no es correcto'
                }
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });
    });

    /* 
    -- Opción 3. La más fácil
    let id = req.params.id;
    let body = req.body;
 
    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' })
        .populate('Categoria')
        .populate('Usuario')
        .exec((err, productoDB) => {
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
                        message: 'El ID no es correcto'
                    }
                });
            }
 
            res.json({
                ok: true,
                producto: productoDB
            });
        });
 */
    

});


// =======================
// Borra un producto
// =======================
app.delete('/productos/:id', (req, res)=>{
    // Actualizar Disponible = False
    // El mensaje de salida si debe indicar que se ha borrado

    let id = req.params.id;
    let body = {
        disponible: false
    }

    Producto.findByIdAndUpdate( id, body, {new: true}, ( err, productoDB )=>{
        if ( err ) {
            res.status(500).json({
                ok: false,
                err: err
            });
        }

        if( !productoDB ) {
            res.status(400).json({
                ok: false,
                err: err
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });

    });

});


module.exports = app;