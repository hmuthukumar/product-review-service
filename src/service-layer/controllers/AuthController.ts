import { JsonController, Post, Body, Req, Res } from 'routing-controllers';
import * as jwt from "jsonwebtoken";

import * as config from "config";
@JsonController("/auth")
export class AuthController {
    constructor() { }
    @Post("/token")
    async getToken(@Body() request: any, @Req() req: any, @Res() res: any): Promise<any> {
        //Check if username and password are set
        let { username, password } = req.body;
        if (!(username && password)) {
            res.status(400).send();
        }

        /*
        Get service account user credentials from the config
        I could have gone for the individual user credentials for write protecting reviews, 
        but looking at the submit review https://www.adidas.co.uk/bravada-shoes/FV8086/submit-review page
        it suggested that there is no authentication required to submit the review. 
        Hence I have taken this approach of using service account for write protecting. 
        Entire config file can be loaded from production protected file system to avoid unnessary exposure
        */
        let user: any = config.get("serviceAccount");

        //Check if encrypted password match
        if (!(user.username === username && user.password === password)) {
            res.status(401).send();
            return;
        }

        /*Sign JWT, token valid for 1 hour, this can be reduced to 15 minutes for more 
            Default signing algorithm (HS256) with secret implemented assuming all the API clients are trusted parties
            The algorithm could be changed to RSA if the API to be made public
            The production deployment could read the secret from OS environment variable instead of JSON config
            for securing the key
        */
        const token = jwt.sign(
            { userId: user.id, username: user.username },
            config.get("jwtSecret"),
            { expiresIn: "15m" }
        );

        //Send the jwt in the response body
        return { authToken: token }
    };


}