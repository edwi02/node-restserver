const jwt = require('jsonwebtoken');

// =======================
// Verificar Token
// =======================

let verificaToken = ( req, res, next ) => {

    let token = req.get('token'); // Para obtener los valores de los Headers

    jwt.verify( token, process.env.SEED, (err, decoded) =>{
        
        if ( err ) {
            return res.status(401).json({
                ok: false, 
                err: {
                    message: 'Token no válido'
                }
            });
        }

        req.usuario = decoded.usuario;
        next(); // Es necesario para que continue, de lo contrario no avanza
    });
    /* 
    res.json({
        token
    }); 
    console.log(token);
    next();
    */
};

// =======================
// Verificar AdminRole
// =======================
let verificaAdmin_Role = ( req, res, next) => {
    
    let usuario = req.usuario;

    if ( usuario.role === "ADMIN_ROLE") {
        next();
    } else {

        return res.status(401).json({
            ok: false, 
            err: {
                message: 'El usuario no es administrador'
            }
        });

    }
    

    /* res.json({
        ok: true
    });  */
};

// =======================
// Verifica Token en imagen
// =======================
let verificaTokenImg = ( req, res, next) => {
    
    let token = req.query.token;

    jwt.verify( token, process.env.SEED, (err, decoded) =>{
        
        if ( err ) {
            return res.status(401).json({
                ok: false, 
                err: {
                    message: 'Token no válido'
                }
            });
        }

        req.usuario = decoded.usuario; // Decodificar el usuario
        next();
    });
};


module.exports = {
    verificaToken,
    verificaAdmin_Role,
    verificaTokenImg
};