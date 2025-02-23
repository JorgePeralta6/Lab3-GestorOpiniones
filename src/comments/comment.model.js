import { Schema, model } from "mongoose";

const CommentSchema = new Schema(
    {
        comment: {
            type: String,
            required: true,
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: 'user',
            required: true
        },
        status: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export default model("Comment", CommentSchema);