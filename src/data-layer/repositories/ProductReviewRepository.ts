import { Schema, Document, Model, model } from "mongoose";
export interface IProductReviewDocument extends Document {
    _id: string,
    totalScore: number,
    numberOfReviews: number,
    reviews: [{
        reviewedBy: string,
        score: number,
        reviewText: string
    }],
    lastUpdated: Date,
    createdAt: Date
}

const ProductReviewSchema: Schema = new Schema({
    _id: { type: String, required: true },
    totalScore: { type: Number, required: true },
    numberOfReviews: { type: Number, required: true },
    reviews: [{
        reviewedBy: { type: String, required: true },
        score: { type: Number, required: true },
        reviewText: { type: String, required: true }
    }],
    createDate: { type: Date, default: Date.now },
    updatedDate: { type: Date, default: Date.now }
});

export const ProductReviewRepo: Model<IProductReviewDocument> = model<IProductReviewDocument>('productreview', ProductReviewSchema);