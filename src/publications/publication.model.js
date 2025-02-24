import {Schema, model} from "mongoose";

const PublicationSchema = Schema({

    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    maintext: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    comment: {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
        required: false
    },
    state: {
        type: Boolean,
        default: true,
    }
},
    {
        timestamps: true,
        versionKey: false
    }
);

export default model('Publication', PublicationSchema)