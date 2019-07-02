

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


// Crear la enumeración
let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol válido.'
};

// Crear esquema en Mongoose
let Schema = mongoose.Schema;

// Definir nuevo esquema
let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario.']
    },
    email: {
        type: String,
        unique: true, // Para que no permita repetir el correo
        required: [true, 'El correo es necesario.']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria.']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String, 
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }

});

// Este metodo se llama cuando se intenta imprimir
// No se puede emplear la función de flecha
usuarioSchema.methods.toJSON = function () {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    return userObject;
}

usuarioSchema.plugin(uniqueValidator, { message: '{PATH} {VALUE} ya existe.'});


// Exporta el modelo y le da el nombre que queremos
module.exports = mongoose.model( 'usuario', usuarioSchema);