import { RouteAction, HttpMethod } from "./RouteAction";
import { Router, IRouterMatcher } from "express";
import { IRouter } from "express-serve-static-core";

export abstract class BaseApiRouter {
    private _router: IRouter;

    public constructor() {
        this.createRouter();
    }

    public router(): IRouter {
        return this._router;
    }

    private createRouter(): void {
        this._router = Router();
        this.buildRoutes().forEach((route: RouteAction) => {
            let routeMatcher: IRouterMatcher<IRouter> = this.findRouterMatcher(route.method);
            if (!routeMatcher) {
                throw new Error(`could not handle route action ${JSON.stringify(route)}`);
            };
            
            routeMatcher.call(this._router, route.path, route.handler.bind(this));
        })
    }

    private findRouterMatcher(httpMethod: HttpMethod): IRouterMatcher<IRouter> {
        switch (httpMethod) {
            case HttpMethod.GET: 
                return this._router.get;
            case HttpMethod.POST:
                return this._router.post;
            case HttpMethod.PUT:
                return this._router.put;
            case HttpMethod.DELETE:
                return this._router.delete;
            default:
                return null;
        }
    }

    protected abstract buildRoutes(): RouteAction[];
}