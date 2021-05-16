import { ProductReviewRepo, IProductReviewDocument } from "../repositories/ProductReviewRepository";
import { logger } from "../../middleware/common/Logging";
import { SeededDataSetup } from './SeededDataSetup'
export class ProductReviewDataAccess {
    constructor() {
        //Implementation only for the development environment to add the seeded data
        new SeededDataSetup().addSeededProducts()
    }


    async createNewProductReview(review: any): Promise<any> {
        //Upsert review 
        let updatedReviews = await ProductReviewRepo.updateOne(
            { _id: review.productId },
            {
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
            },
            { upsert: true }
        );
        //If the inserted/updated record count is not one then there is something wrong with the update
        //and hence throw error
        if (updatedReviews.ok != 1) {
            return { thrown: true, success: false, status: 422, message: "db is currently unable to process request" }
        }
        //Read the latest DB state to post the result back to the caller. 
        // Arguably this read could go into controller
        let productReviews = await ProductReviewRepo.findById(review.productId);
        return productReviews
    }

    async getReviewByProductId(productId: string): Promise<any> {

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
