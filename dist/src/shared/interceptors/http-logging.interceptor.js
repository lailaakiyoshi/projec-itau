"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpLoggingInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
let HttpLoggingInterceptor = class HttpLoggingInterceptor {
    intercept(context, next) {
        const http = context.switchToHttp();
        const req = http.getRequest();
        const res = http.getResponse();
        const start = Date.now();
        const method = req.method;
        const path = req.originalUrl || req.url;
        const requestId = req.requestId ||
            req.headers['x-request-id'] ||
            res.getHeader('x-request-id');
        const user = this.safeUser(req.user);
        console.log(JSON.stringify({
            level: 'info',
            event: 'http_request_start',
            requestId,
            method,
            path,
            user,
            timestamp: new Date().toISOString(),
        }));
        return next.handle().pipe((0, operators_1.tap)(() => {
            const durationMs = Date.now() - start;
            const statusCode = res.statusCode;
            console.log(JSON.stringify({
                level: 'info',
                event: 'http_request_end',
                requestId,
                method,
                path,
                statusCode,
                durationMs,
                user,
                timestamp: new Date().toISOString(),
            }));
        }), (0, operators_1.catchError)((err) => {
            const durationMs = Date.now() - start;
            const statusCode = res.statusCode || 500;
            const payload = {
                level: statusCode >= 500 ? 'error' : 'warn',
                event: 'http_request_error',
                requestId,
                method,
                path,
                statusCode,
                durationMs,
                user,
                errorName: err?.name,
                errorMessage: err?.message,
                timestamp: new Date().toISOString(),
            };
            if (statusCode >= 500 && err?.stack) {
                payload.stack = err.stack;
            }
            console.log(JSON.stringify(payload));
            throw err;
        }));
    }
    safeUser(user) {
        if (!user)
            return undefined;
        return {
            sub: user.sub ?? user.id ?? undefined,
            username: user.username ?? user.email ?? undefined,
        };
    }
};
exports.HttpLoggingInterceptor = HttpLoggingInterceptor;
exports.HttpLoggingInterceptor = HttpLoggingInterceptor = __decorate([
    (0, common_1.Injectable)()
], HttpLoggingInterceptor);
//# sourceMappingURL=http-logging.interceptor.js.map