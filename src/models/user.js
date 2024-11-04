const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 50,

    },
    lastName: {
        type: String,
        minLength: 4,
        maxLength: 50,
    },
    emailId: {
        type: String,
        minLength: 6,
        maxLength: 50,
        lowercase: true,
        required: true,
        unique: true,
        trim: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error("Invalid email address: " + value);
            }
        }


    },
    password: {
        type: String,
        minLength: 6,
        maxLength: 20,
        required: true,
        validate(value) {
            if(!validator.isStrongPassword(value)) {
                throw new Error("Enter a strong password: " + value);
            }
        }
    },
    age: {
        type: Number,
        min: 18,
    },
    gender: {
        type: String,
        validate(value) {
            if (!["male", "female", "others" ].includes(value)) {
                throw new Error("Gender data is not valid!");
            }
        },
    },
    photoUrl: {
        type: String,
        default: "https://www.vhv.rs/dpng/d/15-155087_dummy-image-of-user-hd-png-download.png",
        validate(value) {
            if(!validator.isURL(value)) {
                throw new Error("Invalid photo URL: " + value);
            }
        }
    },
    about: {
        type: String,
        default: "This is a default description of the User!"
    },
    skills: {
        type: [String]
    }
    
}, {
    timestamps: true,
});

 module.exports = mongoose.model("User", userSchema);

