import mongoose from "mongoose";

const permissionSchema = new mongoose.Schema({

    permission_name:{
        type:String,
        required:true
    },
    is_default:{
        type:Number,
        default:0 // 0 -> Not Default, 1 -> Default
    }

});

export const Permission = mongoose.model('Permission', permissionSchema);