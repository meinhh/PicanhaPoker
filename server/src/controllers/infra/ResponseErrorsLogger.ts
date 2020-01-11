import {RequestHandler, NextFunction} from 'express'
import { Request, Response } from "express";

export default (body: any, req: Request, res: Response) => {
    if (res.statusCode != 500)
        console.error(`ERROR on [${req.method.toUpperCase()}] '${req.url}'`, body);
}