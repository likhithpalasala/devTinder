const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 50,

    },
    lastName: {
        type: String,
        minLength: 3,
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
        minLength: 4,
        maxLength: 100,
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
        enum: {
          values: ["male", "female", "others"],
          message: `{VALUE} is not valid gender type`
        },
        /*validate(value) {
            if (!["male", "female", "others" ].includes(value)) {
                throw new Error("Gender data is not valid!");
            }
        }, */
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

userSchema.methods.getJWT = async function () {
    const user = this;

    const token = await jwt.sign({_id: user._id}, "DevTinder@NamasteNode", { 
        expiresIn: "10d",


});

return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
    const user = this;
    const passwordHash = user.password;

    const isPasswordValid = await bcrypt.compare(
        passwordInputByUser, 
        passwordHash
    ); 
    return isPasswordValid;
}

 module.exports = mongoose.model("User", userSchema);

