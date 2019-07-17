const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../../models/usuario');
const Producto = require('../../models/producto');

const fs = require('fs');
const path = require('path');
const uniqid = require('uniqid');


// default options
app.use(fileUpload());


app.put('/upload/:tipo/:id', function(req, res) {

    let tipo = req.params.tipo;
    let id = req.params.id;

    // Valida que exista un archivo
    if (!req.files) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'No se ha seleccionado ningún archivo'
                }
            });
    }

    // Valida Tipo ['productos', 'usuarios']
    let tiposValidos = ['productos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos permitidas son ' + tiposValidos.join(', ')
            }
        })
    }

    let archivo = req.files.archivo;
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length - 1];

    // Extensiones permitidas
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones permitidas son ' + extensionesValidas.join(', '),
                ext: extension
            }
        })
    }

    // Cambiar nombre al archivo
    let uniq = uniqid.time();
    // let nombreArchivo = `${ id }-${ new Date().getMilliseconds()  }.${ extension }`;
    let nombreArchivo = `${ id }-${ uniq  }.${ extension }`;


    // Mover la imgen 
    archivo.mv(`uploads/${ tipo }/${ nombreArchivo }`, (err) => {

        if (err)
            return res.status(500).json({
                ok: false,
                err: err
            });

        switch(tipo){
            case 'productos':
                imagenProducto(id, res, nombreArchivo);
                break;
            case 'usuarios':
                imagenUsuario(id, res, nombreArchivo);
                break;
        }
    });

});

function imagenUsuario(id, res, nombreArchivo) {

    Usuario.findById(id, (err, usuarioDB) => {

        if (err) {
            // Si genera error el archivo ya se ha cargado
            borraArchivo(nombreArchivo, 'usuarios');

            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            // No se encontró el usuario en la BD
            borraArchivo(nombreArchivo, 'usuarios');

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuaro no existe'
                }
            });
        }

        // Borrar para que no se genere "Basura"
        borraArchivo(usuarioDB.img, 'usuarios')

        usuarioDB.img = nombreArchivo;

        usuarioDB.save((err, usuarioGuardado) => {

            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            });

        });


    });


}



function imagenProducto(id, res, nombreArchivo) {

     let imagen = {
        img: nombreArchivo
    };

    Producto.findOneAndUpdate( {_id: id}, imagen/*, { new: true }*/, (err, productoDB)=>{
        if (err) {
            // Si genera error el archivo ya se ha cargado
            borraArchivo(nombreArchivo, 'productos');

            return res.status(500).json({
                ok: false,
                err: err
            });
        }

        if (!productoDB) {

            // No se encontró el producto en la BD
            
            borraArchivo(nombreArchivo, 'productos');

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no existe'
                }
            });
        }

        borraArchivo(productoDB.img, 'productos');

        res.json({
            ok: true,
            producto: productoDB,
            imgNew: nombreArchivo
        });

    }); 

  /*    Producto.findById(id, (err, productoDB) => {

        console.log('productoDB:', productoDB);
        if (err) {
            // Si genera error el archivo ya se ha cargado
            borraArchivo(nombreArchivo, 'productos');

            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {

            // No se encontró el producto en la BD
            borraArchivo(nombreArchivo, 'productos');

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no existe'
                }
            });
        }

        console.log(productoDB);
        // Borrar para que no se genere "Basura"
        borraArchivo(productoDB.img, 'productos');

        productoDB.img = nombreArchivo;
        productoDB.Categoria = '55d24775d5c786c327cc2cd8b';
        console.log(productoDB.categoria);

        productoDB.save((err, productoGuardado) => {

            if(err){
                return res.status(400).json({
                    ok: false,
                    err: err
                });
            }
            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchivo
            });

        });


    });  */


}



async function borraArchivo(nombreImagen, tipo) {

    let pathImagen = path.resolve(__dirname, `../../uploads/${ tipo }/${ nombreImagen }`);
    if (fs.existsSync(pathImagen)) {
        await fs.unlinkSync(pathImagen);
    }

}

module.exports = app;