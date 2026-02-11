import type { VercelRequest, VercelResponse } from '@vercel/node';
import { match } from 'path-to-regexp';

type Handler = (req: any, res: VercelResponse) => Promise<any> | any;

interface Route {
    method: string;
    path: string;
    handler: Handler;
    matchFn: ReturnType<typeof match>;
}

export class Router {
    private routes: Route[] = [];

    add(method: string, path: string, handler: Handler) {
        this.routes.push({
            method: method.toUpperCase(),
            path,
            handler,
            matchFn: match(path, { decode: decodeURIComponent }),
        });
    }

    get(path: string, handler: Handler) { this.add('GET', path, handler); }
    post(path: string, handler: Handler) { this.add('POST', path, handler); }
    put(path: string, handler: Handler) { this.add('PUT', path, handler); }
    delete(path: string, handler: Handler) { this.add('DELETE', path, handler); }

    async handle(req: VercelRequest, res: VercelResponse) {
        const { method, url } = req;
        if (!url || !method) return res.status(400).json({ error: 'Invalid Request' });

        // Normalize URL: remove query string for matching
        const [path] = url.split('?');

        for (const route of this.routes) {
            if (route.method !== method.toUpperCase() && route.method !== 'ALL') continue;

            const result = route.matchFn(path);
            if (result) {
                // Inject params into query
                req.query = { ...req.query, ...result.params as Record<string, string> };
                return route.handler(req, res);
            }
        }

        return res.status(404).json({ error: 'Not Found' });
    }
}
