
const express = require('express');

let { verificaToken, verificaAdmin_Role } = require('../middleware/autentication');

const _ = require('underscore'); // El estandar es usar el guión bajo

let app = express();

let Categoria = require('../../models/categoria');

// ==================================
// Mostrar todas las categorias
// ==================================
app.get('/categoria', verificaToken, (req, res) => {

    // Buscar todas las categorias activas
    Categoria.find( {estado: true}, 'nombre descripcion')
                .sort('nombre')
                .populate('usuario', 'nombre email')
                .exec( (err, categoriaDB) => {
                    
                    // Si existe algún error se retorna
                    if ( err ) {
                        return res.status(400).json({
                            ok: true, 
                            err
                        });
                    }

                    // Retornar el resultado de la consulta que obtiene las categorias
                    res.json({
                        ok: true,
                        categoria: categoriaDB
                    });

                });
});

// ==================================
// Mostrar una categoria por ID
// ==================================
app.get('/categoria/:id', verificaToken, (req, res) =>{
    
    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB)=> {

        if( err ) {
            return res.status(500).json({
                ok: false,
                err: err
            });
        }

        if( !categoriaDB ) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'El ID no es correcto'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });
});

// ==================================
// Crear nueva categoria
// ==================================
app.post('/categoria', verificaToken, (req, res)=>{
    // regresa la nueva categoría
    let body = req.body;

    console.log(req);
    let categoria = new Categoria({
        nombre: body.nombre,
        descripcion: body.descripcion,
        usuario: req.usuario._id,
        estado: true
    });

    categoria.save( (err, categoriaDB) => {
        
        // Si no es posible crear la categoria, retornar el error de BD
        if ( err ) {
            return res.status(500).json({
                ok: false,
                err: err
            });
        }

        // 
        /* if (!categoriaDB) {
            return res.status(400).json({
                ok:false, 
                err: err
            });
        }
         */

        // Retornar la categoria creada
        res.json({
            ok: true,
            categoria: categoriaDB
        });


    });



});

// ==================================
// Actualizar la categoria
// ==================================
app.put('/categoria/:id', verificaToken, (req, res)=>{
    
    let id = req.params.id;
    let body = _.pick( req.body, ['descripcion'] );

    //Descripción de la categoria
    Categoria.findByIdAndUpdate( id, body, { new: true, runValidators:true }, ( err, categoriaDB ) => {
        
        if ( err ) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });

});

// ==================================
// Borrar una categoria
// ==================================
app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res)=>{
    // Sólo un admin la puede borrar
    let id = req.params.id;

    let body = {
        estado: false
    };

    Categoria.findByIdAndUpdate( id, body, { new: true } ,(err, categoriaDB) => {

        if (err) {
            res.status(400).json({
                ok: false,
                err: err
            });
        }

        res.json({
            ok: true,
            message: 'Categoria Borrada'
        });

    });


});






module.exports = app;