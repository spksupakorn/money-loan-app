const mongoose = require('mongoose');
const User = require('../models/user');
const Transaction = require('../models/transaction');
const Debt = require('../models/debt');

// Helper function to check if a string is a valid ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Add money to a user's account
const addMoney = async (req, res) => {
    const { userId, amount } = req.body;

    if (req.user._id !== userId) {
        return res.status(403)
                .json({
                    success: false,
                    message: 'You can only add money for yourself.'
                })
    }

    // Validate if amount is a number
    if (isNaN(amount)) {
        return res.status(400)
                .json({
                    success: false,
                    error: 'Amount must be a valid number.'
                })
    }

    const total = Number(amount);

    // Validate input
    if (!userId || !total || total <= 0) {
        return res.status(400)
                .json({
                    success: false,
                    error: 'Invalid userId or amount.'
                })
    }

    try {
        // Find user by userId
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404)
                .json({
                    success: false,
                    error: 'User not found.'
                })
        }

        // Add money to user's balance
        user.balance += total;
        await user.save();

        return res.status(200)
                .json({
                    success: true,
                    message: `Successfully added ${total} to user balance.`,
                    balance: user.balance
                })
    } catch (error) {
        return res.status(500)
                .json({
                    success: false,
                    message: 'An error occurred while adding money.',
                })
    }
};

const borrowMoney = async (req, res) => {

    try {
        const { borrowerId, lenderId, amount } = req.body;

        // Validate if amount is a number
        if (isNaN(amount)) {
            return res.status(400)
                    .json({
                        success: false,
                        error: 'Amount must be a valid number.'
                    })
        }

        let total = Number(amount);

        if (req.user._id !== borrowerId) {
            return res.status(403)
                    .json({
                        success: false,
                        message: 'You can only borrow for yourself.'
                    })
        }

        const borrower = await User.findById(borrowerId);
        const lender = await User.findById(lenderId);
        
        if (!lender || lender.balance < total) {
            return res.status(400)
                    .json({
                        success: false,
                        message: 'Lender does not have enough balance.'
                    })
        }
        
        borrower.balance += total;
        lender.balance -= total;
        await borrower.save();
        await lender.save();

        const transaction = new Transaction({ 
            borrowerId, 
            lenderId, 
            amount: total, 
            type: 'borrow' 
        });
        await transaction.save();

        let debt = await Debt.findOne({ borrowerId, lenderId });
        if (debt) {
            debt.amountOwed += total;
        } else {
            debt = new Debt({ 
                borrowerId, 
                lenderId, 
                amountOwed: total 
            });
        }
        await debt.save();

        return res.status(200)
                .json({ 
                    success: true,
                    results: transaction 
                })
    } catch(error) {
        return res.status(500)
                .json({
                    success: false,
                    message: `Internal server error:${error}`
                })
    }
}

// Repay money
const repayMoney = async (req, res) => {
    const { borrowerId, lenderId, amount } = req.body;

    // Validate if amount is a number
    if (isNaN(amount)) {
        return res.status(400)
                .json({
                    success: false,
                    error: 'Amount must be a valid number.'
                })
    }

    let total = Number(amount);

    if (req.user._id !== borrowerId) {
        return res.status(403)
                .json({
                    success: false,
                    message: 'You can only repay for yourself.'
                })
    }

    const borrower = await User.findById(borrowerId);
    const lender = await User.findById(lenderId);
    const debt = await Debt.findOne({ borrowerId, lenderId });

    if (!debt || debt.amountOwed < total) {
        return res.status(400)
                .json({
                    success: false,
                    message: 'Invalid repayment amount.'
                })
    } 

    borrower.balance -= total;
    lender.balance += total;
    await borrower.save();
    await lender.save();

    debt.amountOwed -= total;
    if (debt.amountOwed <= 0) await Debt.deleteOne({ borrowerId, lenderId });
    else await debt.save();

    const transaction = new Transaction({ 
        borrowerId, 
        lenderId, 
        amount: total, 
        type: 'repayment' 
    });
    await transaction.save();

    return res.status(200)
            .json({ 
                success: true,
                results: transaction 
            })
};

// Get all debts
const allDebt = async (req, res) => {
    const debts = await Debt.find().populate('borrowerId lenderId', 'username');
    return res.status(200)
            .json({ 
                success: true,
                results: debts 
            })
};

// Get all transactions
const allTransaction = async (req, res) => {
    const transactions = await Transaction.find().populate('borrowerId lenderId', 'username');
    return res.status(200)
            .json({ 
                success: true,
                results: transactions 
            })
};

// Get debts for a specific user by userId
const getDebts = async (req, res) => {
    const userId = req.params.userId;

    // Validate the ObjectId format
    if (!isValidObjectId(userId)) {
        return res.status(404)
            .json({ 
                success: false,
                message: 'Invalid user ID format.'
            })
    }

    // Find debts where the user is either a borrower or a lender
    const debts = await Debt.find({
        $or: [{ borrowerId: userId }, { lenderId: userId }]
    }).populate('borrowerId lenderId', 'username');

    if (!debts.length) {
        return res.status(404)
            .json({ 
                success: false,
                message: 'No debts found for this user.'
            })
    }

    return res.status(200)
            .json({ 
                success: true,
                results: debts 
            })
};

// Get transactions for a specific user by userId
const getTransactions = async (req, res) => {
    const userId = req.params.userId;

    // Validate the ObjectId format
    if (!isValidObjectId(userId)) {
        return res.status(404)
            .json({ 
                success: false,
                message: 'Invalid user ID format.'
            })
    }

    // Find transactions where the user is either a borrower or a lender
    const transactions = await Transaction.find({
        $or: [{ borrowerId: userId }, { lenderId: userId }]
    }).populate('borrowerId lenderId', 'username');

    if (!transactions.length) {
        return res.status(404)
            .json({ 
                success: false,
                message: 'No transactions found for this user.'
            })
    }

    return res.status(200)
            .json({ 
                success: true,
                results: transactions 
            })
};

module.exports = { 
    addMoney,
    borrowMoney, 
    repayMoney, 
    allDebt, 
    allTransaction,
    getDebts,
    getTransactions
};