import { Schema as _Schema, model } from 'mongoose';
const Schema = _Schema;
import passportLocalMongoose from 'passport-local-mongoose';

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }, 
    username: { 
        type: String, 
        unique: true 
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpires: {
        type: Date
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    emailToken: {
        type: String
    }


});

UserSchema.plugin(passportLocalMongoose);

export default model('User', UserSchema);