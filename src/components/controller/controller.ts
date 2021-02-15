import { Request, Response, NextFunction } from "express";

export interface IUseCaseController {
    handle(req: Request, res: Response, next: NextFunction): Promise<Response>;
}