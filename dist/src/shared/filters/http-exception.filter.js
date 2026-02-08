"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
let HttpExceptionFilter = class HttpExceptionFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const req = ctx.getRequest();
        const res = ctx.getResponse();
        const timestamp = new Date().toISOString();
        const path = req.originalUrl || req.url;
        const method = req.method;
        const requestId = req.requestId;
        let status = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        let error = 'Internal Server Error';
        let message = 'Unexpected error';
        if (exception instanceof common_1.HttpException) {
            status = exception.getStatus();
            const responseBody = exception.getResponse();
            if (typeof responseBody === 'string') {
                message = responseBody;
                error = exception.name;
            }
            else {
                const anyBody = responseBody;
                message = anyBody.message ?? exception.message;
                error = anyBody.error ?? exception.name;
            }
        }
        else if (exception instanceof Error) {
            message = exception.message || message;
        }
        const payload = {
            statusCode: status,
            error,
            message,
            path,
            method,
            timestamp,
            requestId,
        };
        const level = status >= 500 ? 'error' : 'warn';
        const log = {
            level,
            ...payload,
            stack: status >= 500 && exception instanceof Error ? exception.stack : undefined,
        };
        if (level === 'error') {
            console.error(JSON.stringify(log));
        }
        else {
            console.warn(JSON.stringify(log));
        }
        res.status(status).json(payload);
    }
};
exports.HttpExceptionFilter = HttpExceptionFilter;
exports.HttpExceptionFilter = HttpExceptionFilter = __decorate([
    (0, common_1.Catch)()
], HttpExceptionFilter);
//# sourceMappingURL=http-exception.filter.js.map