import {  Get, JsonController, Post, Put, Param, Delete, Body, OnUndefined, Req, Res, Middleware, UseAfter, UseBefore } from 'routing-controllers';
import { validateProductReviewRequest } from '../../business-layer/validator/ProductReviewValidation';
import { logger } from '../../middleware/common/Logging';
import { ProductReviewDataAccess } from '../../data-layer/data-access/ProductReviewDataAccess';
import { ProductReviewModel } from '../../data-layer/models/ProductReviewModel';
import { AuthCheckMiddleware } from '../../middleware/auth/AuthCheckMiddleware';

@JsonController('/review')
export class ProductReviewController {

    private producReviewDataAccess: ProductReviewDataAccess;
    constructor() {
        this.producReviewDataAccess = new ProductReviewDataAccess();
    }
    /*
     API 1: get product review summary
    */
    @Get('/:productId')
    @OnUndefined(404)
    async getProductReviewSummary(@Param("productId") productId: string): Promise<any> {
        let reviews = await this.producReviewDataAccess.getReviewByProductId(productId)
        var newProductResult: any
        if (reviews) {
            let newProduct = new ProductReviewModel(reviews);
            newProductResult = Object.assign({ product: newProduct.getClientProductModel() });
            return newProductResult;
        }
        return newProductResult
    }


    /*
    API 2: Add or update product review.
    */
    @Put('/:productId')
    @UseBefore(AuthCheckMiddleware)
    async addOrUpdateProductReview(
        @Param("productId") productId: string,
        @Body() request: any,
        @Req() req: any,
        @Res() res: any
    ): Promise<any> {
        request.productId = productId
        let validationErrors: any[] = await validateProductReviewRequest(request);
        logger.debug("Number of validation errors :-", validationErrors.length);
        if (validationErrors.length > 0) {
            throw {
                thrown: false,
                status: 401,
                message: 'Incorrect Input',
                data: validationErrors
            }
        }
        let result = await this.producReviewDataAccess.createNewProductReview(request);
        if (result._id) {
            let newProduct = new ProductReviewModel(result);
            let newProductResult = Object.assign({ product: newProduct.getClientProductModel() });
            return res.json(newProductResult);
        } else {
            throw result;
        }
    }

    /*
    API 3: Update product review for a product by an user
    */
    @Post('/:productId/:reviewedByEmailId')
    @UseBefore(AuthCheckMiddleware)
    @OnUndefined(404)
    async updateProductReview(@Param("productId") productId: string, @Param("reviewedByEmailId") reviewedBy: string): Promise<any> {

        return "To Be Implemented";
    }

    /*
    API 4: Delete product reviews by productId
    */
    @Delete('/:productId')
    @UseBefore(AuthCheckMiddleware)
    @OnUndefined(404)
    async deleteProductReviews(@Param("productId") productId: string): Promise<any> {
        let result = await this.producReviewDataAccess.deleteProductReviews(productId);
        if(result) {
            logger.info("product review data deleted for db for the product: " + productId);
            return {message: "product review data deleted"}
        }
        return undefined;
    }


    /*
    API 5: Delete product reviews by productId
    */
    @Delete('/:productId/:reviewedByEmailId')
    @UseBefore(AuthCheckMiddleware)
    @OnUndefined(404)
    async deleteProductReview(@Param("productId") productId: string, @Param("reviewedByEmailId") reviewedBy: string): Promise<any> {

        return "To Be Implemented";
    }

}

