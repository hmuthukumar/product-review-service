import { IsInt, Length ,IsAlphanumeric, IsNotEmpty, Min, Max } from "class-validator";
import { validate } from "class-validator";
import { forEach, pick} from 'lodash';

class ProductReviewValidationSchema  {
     @IsNotEmpty()
     @Length(6, 6)
     @IsAlphanumeric()
     productId: string;

     @IsInt()
     @Min(1)
     @Max(5)
     score: number;

     @Length(2, 144)
     reviewText: string;

     @Length(8, 8)
     reviewedBy: string;
     
    constructor(productReview:any){
       this.productId = productReview.productId;
       this.score = productReview.score;
       this.reviewedBy = productReview.reviewedBy;
       this.reviewText = productReview.reviewText;
    }
}


async function validateProductReviewRequest(productReviewReqObj:any): Promise<any>{
       let validProductReview = new ProductReviewValidationSchema(productReviewReqObj);
       let validationResults =  await validate(validProductReview);
       let constraints =[]
       if(validationResults &&  validationResults.length > 0 ){
             forEach(validationResults, (item)=>{
                 constraints.push(pick(item, 'constraints', 'property'));
             });
       }
       return constraints;
}



export {validateProductReviewRequest}