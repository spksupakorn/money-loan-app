const mongoose = require('mongoose');

const DebtSchema = new mongoose.Schema({
    borrowerId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    lenderId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    amountOwed: { 
        type: Number, 
        required: true 
    }
});

module.exports = mongoose.model('Debt', DebtSchema);