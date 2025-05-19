const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true,
        validate: {
            validator: function (v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: props => `${props.value} is not a valid email address!`
        }
    },
    details: {
        type: String,
        required: [true, 'Order details are required'],
        trim: true,
        minlength: [5, 'Details must be at least 5 characters']
    },
    phoneNumber: {
        required: [true, 'Phone number are required'],
        type: String,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
})

const Order = mongoose.model('Order', orderSchema)

module.exports = Order
