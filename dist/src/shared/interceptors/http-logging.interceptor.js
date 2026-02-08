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
        return next.handle().pipe((0, operators_1.tap)({
            next: () => {
                const durationMs = Date.now() - start;
                const log = {
                    level: 'info',
                    msg: 'HTTP request',
                    requestId: req.requestId,
                    method: req.method,
                    path: req.originalUrl || req.url,
                    statusCode: res.statusCode,
                    durationMs,
                    user: req.user?.sub ?? req.user?.id ?? undefined,
                };
                console.log(JSON.stringify(log));
            },
        }));
    }
};
exports.HttpLoggingInterceptor = HttpLoggingInterceptor;
exports.HttpLoggingInterceptor = HttpLoggingInterceptor = __decorate([
    (0, common_1.Injectable)()
], HttpLoggingInterceptor);
//# sourceMappingURL=http-logging.interceptor.js.map