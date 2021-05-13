import { ProductReviewRepo, IProductReviewDocument } from "../repositories/ProductReviewRepository";
import { logger } from "../../middleware/common/Logging";
import { SeededDataSetup } from './SeededDataSetup'
export class ProductReviewDataAccess {
    constructor() {
        new SeededDataSetup().addSeededProducts()
     }
    

    async createNewProductReview(review: any): Promise<any> {
        let productReview = <IProductReviewDocument>(review);

        var productReviews = await ProductReviewRepo.findById(review.productId);
        if (productReviews) {
            let updatedReviews = await productReviews.update({
                $inc: {
                    numberOfReviews: 1,
                    totalScore: review.score
                },
                $push: {
                    reviews:
                    {
                        reviewedBy: review.reviewedBy,
                        score: review.score,
                        reviewText: review.reviewText
                    }
                }
            }).exec();
            if (updatedReviews.errors) {
                return { thrown: true, success: false, status: 422, message: "db is currently unable to process request" }
            }
            productReviews = await ProductReviewRepo.findById(review.productId);
            return productReviews
        }
        else {
            productReviews = <IProductReviewDocument><unknown>
                ({
                    _id: review.productId,
                    totalScore: review.score,
                    numberOfReviews: 1,
                    reviews: [{
                        reviewedBy: review.reviewedBy,
                        score: review.score,
                        reviewText: review.reviewText
                    }]
                });
            let addedReview = await ProductReviewRepo.create(productReviews)
            if (addedReview.errors) {
                return { thrown: true, success: false, status: 422, message: "db is currently unable to process request" }
            }
            return addedReview
        }
    }

    async getReviewSummaryByProductId(productId: string): Promise<any> {

        let result = await ProductReviewRepo.findById(productId);
        if (result) {
            if (result.errors) {
                return { thrown: true, success: false, status: 422, message: "db is currently unable to process request" }
            }
            return result;
        }
        else {
            return undefined
        }

    }

    async deleteProductReviews(productId: string): Promise<any> {

        let productReviews = await ProductReviewRepo.findByIdAndDelete(productId);
        if (productReviews) {
            if (productReviews.errors) {
                return { thrown: true, success: false, status: 422, message: "db is currently unable to process request" }
            }
            logger.info("result after deletion of review data for product " + productId + ":" + productReviews)
            return productReviews;
        }
        else {
            return undefined
        }

    }

}
