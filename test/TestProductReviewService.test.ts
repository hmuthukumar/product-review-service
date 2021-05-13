import * as request from 'supertest';
import app from '../dist/Index'
import * as assert from 'assert';
import { isEqual } from 'lodash'

const apptest = request(app.server);

describe("GET a non existing product /review/AB0000", () => {
    it("should return 404 ", async () => {
        return apptest.get("/review/AB0000")
            .expect(404)
    });
});
//Assumption:- product GN3500 is not in review database andnot used for testing review write APIs
describe("GET an existing product but no review summary /review/GN3500", () => {
    it("should return 404", async () => {
        return apptest.get("/review/GN3500")
            .expect(404)
    });
});
//Assumption:- product C77154 is not in review database andnot used for testing review write APIs
describe("GET an existing product with review summary /review/C77154", () => {
    it("should return 200", async () => {
        return apptest.get("/review/C77154")
            .expect(200)
            .then(response => {
                let expectedData = JSON.parse('{"product":{"id":"C77154","totalScore":8,"numberOfReviews":2,"averageReviewScore":4}}')
                let productReviewSummary = JSON.parse(response.text)
                assert(productReviewSummary !== undefined, "There should be some data in review summary")
                assert(isEqual(productReviewSummary, expectedData), "Review summary data not matching")
            });
    });
});

/*
This test suite must run for all test casesto complete a testing cycle, 
otherwise stale data must be left and further tests may fail
Remedy is to clean the stale data manually.  
*/

let emptyReviewPostData = {}
let invalidReviewPostData1 = { reviewText: "Invalid review 1" }
let invalidReviewPostData2 = { reviewText: "Invalid review 2", reviewedBy: "user0000" }
let validReviewPostData1 = { "reviewText": "Valid Review 1", "reviewedBy": "user1111", "score": 5 }
let expectedSummary1 = { "product": { "id": "DZ1410", "totalScore": 5, "numberOfReviews": 1, "averageReviewScore": 5 } }
let validReviewPostData2 = { "reviewText": "Valid Review 1", "reviewedBy": "user1111", "score": 3 }
let expectedSummary2 = { "product": { "id": "DZ1410", "totalScore": 8, "numberOfReviews": 2, "averageReviewScore": 4 } }

describe("Test all APIs with product DZ1410 /review/DZ1410", () => {

    it("Step 0: Delete review data for DZ1410 as a safety net", async () => {
        return apptest.delete("/review/DZ1410")
    });

    it("Step 1: Check for existance of DZ1410 in review db and should not present", async () => {
        return apptest.get("/review/DZ1410")
            .expect(404)
    });

    it("Step 2: Try creation of first review for DZ1410 with 0 valid and 3 invalid data", async () => {
        return apptest.put("/review/DZ1410")
            .send(emptyReviewPostData)
            .expect(500)
            .then(response => {
                let result = JSON.parse(response.text)
                assert(result.status === 401, "Validation error must be thrown")
                assert(result.data.length === 3, "Number of validations errors must be 3")
            });
    });

    it("Step 3: Try creation of first review for DZ1410 with 1 valid and 2 invalid data", async () => {
        return apptest.put("/review/DZ1410")
            .send(invalidReviewPostData1)
            .expect(500)
            .then(response => {
                let result = JSON.parse(response.text)
                assert(result.status === 401, "Validation error must be thrown")
                assert(result.data.length === 2, "Number of validations errors must be 3")
            });
    });

    it("Step 4: Try creation of first review for DZ1410 with 2 valid and 1 invalid data", async () => {
        return apptest.put("/review/DZ1410")
            .send(invalidReviewPostData2)
            .expect(500)
            .then(response => {
                let result = JSON.parse(response.text)
                assert(result.status === 401, "Validation error must be thrown")
                assert(result.data.length === 1, "Number of validations errors must be 3")
            });
    });

    it("Step 5: Try creation of first review for DZ1410 with 2 valid and 1 invalid data", async () => {
        return apptest.put("/review/DZ1410")
            .send(invalidReviewPostData2)
            .expect(500)
            .then(response => {
                let result = JSON.parse(response.text)
                assert(result.status === 401, "Validation error must be thrown")
                assert(result.data.length === 1, "Number of validations errors must be 3")
            });
    });

    
    it("Step 6: Try creation of first review for DZ1410 with all valid data", async () => {
        return apptest.put("/review/DZ1410")
            .send(validReviewPostData1)
            .expect(200)
            .then(response => {
                let result = JSON.parse(response.text)
                assert(result.product.averageReviewScore === 5, 
                    "Average score not matching expeted ")
                assert(isEqual(result, expectedSummary1), "Result not matching the expected value")
            });
    });

        
    it("Step 7: Try creation of second review for DZ1410 with all valid data", async () => {
        return apptest.put("/review/DZ1410")
            .send(validReviewPostData2)
            .expect(200)
            .then(response => {
                let result = JSON.parse(response.text)
                assert(result.product.averageReviewScore === 4, "Average score not matching, got" + result.product.averageReviewScore)
                assert(isEqual(result, expectedSummary2), "Result not matching the expected value")
            });
    });

    it("Step 8: Delete review data of DZ1410", async () => {
        return apptest.delete("/review/DZ1410")
            .expect(200)
    });

});



