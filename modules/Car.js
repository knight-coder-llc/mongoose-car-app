const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/cars4sale', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  }); // db name

const carSchema = new mongoose.Schema({
    cid: {type: Number, required: true, min: 0, unique: true},
    year: {type: Number, required: true, min: 0 },
    make: {type: String, required: true },
    model: {type: String, required: true, unique: true},
    miles: {type: Number, required: true, min: 0},
    price: {type: Number, required: true, min: 0},
    dealer_id: {type: String, required: true, unique: true},
});

module.exports = mongoose.model('Car', carSchema);