import { ProductReviewRepo, IProductReviewDocument } from "../repositories/ProductReviewRepository";
import { logger } from "../../middleware/common/Logging"

export class SeededDataSetup {

    static DATA1 = {
        _id: 'C77154',
        totalScore: 8,
        numberOfReviews: 2,
        reviews: [
            {
                reviewedBy: 'user1111',
                score: 5,
                reviewText: 'Valid Review 1'
            },
            {
                reviewedBy: 'user1111',
                score: 3,
                reviewText: 'Valid Review 2'
            }
        ]
    }


    static DATA2 = {
        _id: 'GN2300',
        totalScore: 11,
        numberOfReviews: 3,
        reviews: [
            {
                reviewedBy: 'user1111',
                score: 5,
                reviewText: 'Valid Review 1'
            },
            {
                reviewedBy: 'user2222',
                score: 3,
                reviewText: 'Valid Review 2'
            },
            {
                reviewedBy: 'user3333',
                score: 3,
                reviewText: 'Valid Review 3'
            }
        ]
    }

    /** 
     * Implementation only for Development environments
    */

    async addSeededProducts(): Promise<any> {
        try {
            await ProductReviewRepo.updateOne(
                { _id: 'C77154' },
                <IProductReviewDocument><unknown>(SeededDataSetup.DATA1),
                { upsert: true }
            )
            await ProductReviewRepo.updateOne(
                { _id: 'GN2300' },
                <IProductReviewDocument><unknown>(SeededDataSetup.DATA2),
                { upsert: true }
            )
        }
        catch (err) {
            logger.error("initial seeded data already added, ignore this error")
        }
    }
}