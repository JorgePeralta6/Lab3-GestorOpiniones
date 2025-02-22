import { Schema, model } from "mongoose";

const categorySchema = Schema ({
    name: {
        type: String,
        required: [true, 'Name is required'],
    },
    text:{
        type: String,
        required: [true, 'The category need a text']
    },
    admin: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    status:{
        type: Boolean,
        default: true
    }
});

export default model('Category', categorySchema);