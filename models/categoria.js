var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

// Crear esquema en Mongose
var Schema = mongoose.Schema;

// Definir nuevo esquema
var categoriaSchema = new Schema({
    nombre: {
        type: String,
        unique: true, // Para que no permita repetir el nombre
        required: [true, 'El nombre de la categoria es necesario.']
    },
    descripcion:{
        type: String
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'usuario'
    },
    estado: {
        type: Boolean,
        default: true
    }
});

// Aplicar validador
categoriaSchema.plugin(uniqueValidator, { message: '{PATH} {VALUE} ya existe.'});

// Exportar el modelo y definir el nombre 
module.exports = mongoose.model('Categoria', categoriaSchema);