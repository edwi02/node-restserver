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
        next();
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

module.exports = {
    verificaToken,
    verificaAdmin_Role
};