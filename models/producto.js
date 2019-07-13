var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var productoSchema = new Schema({
    nombre: { type: String, require: [true, 'El nombre es necesario']},
    precioUni: { type: Number, require: [true, 'El precio únitario es necesario']},
    descripcion: { type: String, require: false },
    disponible: { type: Boolean, require: true, default: true },
    Categoria: {type: Schema.Types.ObjectId, ref: 'Categoria', required: true },
    usuario: { type: Schema.Types.ObjectId, ref:'usuario'}
});

module.exports = mongoose.model('Producto', productoSchema);