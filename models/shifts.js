const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/Shifts');
const shiftsSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    id:Number,
    sunday:String,
    monday:String,
    tuesday:String,
    wednesday:String,
    thursday:String,
});


module.exports = mongoose.model('Shifts', shiftsSchema);
