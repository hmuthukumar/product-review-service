import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import * as config from "config";
import { ExpressMiddlewareInterface } from "routing-controllers";


export class AuthCheckMiddleware implements ExpressMiddlewareInterface {
  use(req: any, res: any, next: (err?: any) => any) {
    //Get the auth (JWT) token from the HTTP headers
    const token = <string>req.headers["auth"];
    let jwtPayload;
    //Try to validate the token and get data
    try {
      jwtPayload = <any>jwt.verify(token, config.get("jwtSecret"));
      res.locals.jwtPayload = jwtPayload;
    } catch (error) {
      //If token is not valid, respond with 401 (unauthorized)
      res.status(401).send();
      return;
    }

    //The token is valid for 15 minutes
    //Send a new token on every request to keep the client session valid for the client
    //Client could keep updating the token as and when a new request is made
    const { userId, username } = jwtPayload;
    const newToken = jwt.sign({ userId, username }, config.get("jwtSecret"), {
      expiresIn: "1h"
    });
    res.setHeader("token", newToken);
    //Call the next middleware or controller
    next();
  }
}