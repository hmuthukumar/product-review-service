import { IProductReviewDocument } from "data-layer/repositories/ProductReviewRepository";

export class ProductReviewModel{
    private _useModel:IProductReviewDocument;

    constructor(iProductDocument:IProductReviewDocument){
        this._useModel=iProductDocument;
    }

    get id(): string{
        return (this._useModel._id).toString();
    }

    get totalScore():number{
        return this._useModel.totalScore;
    }

    get numberOfReviews():number{
        return this._useModel.numberOfReviews;
    }
    
    get averageReviewScore():number{
        return this._useModel.totalScore / this._useModel.numberOfReviews;
    }
    
    getClientProductModel(){
        return Object.seal({
            id:this._useModel._id,
            totalScore:this._useModel.totalScore,
            numberOfReviews:this._useModel.numberOfReviews,
            averageReviewScore:this._useModel.totalScore / this._useModel.numberOfReviews,
        })
    }
}