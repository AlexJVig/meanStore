const mongoose = require('mongoose');

const branchSchema = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    name: {type:String,required:true},
    address: {type:String,required:true}
});


module.exports = mongoose.model('Branch',branchSchema);