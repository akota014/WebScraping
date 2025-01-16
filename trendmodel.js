const mongoose = require("mongoose");

const trendSchema = mongoose.Schema({
    trending:{
        type: Map,
        of: String 
    }
})

module.exports=mongoose.model('Trend',trendSchema);