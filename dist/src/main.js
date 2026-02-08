"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const http_exception_filter_1 = require("./shared/filters/http-exception.filter");
const http_logging_interceptor_1 = require("./shared/interceptors/http-logging.interceptor");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
    app.useGlobalInterceptors(new http_logging_interceptor_1.HttpLoggingInterceptor());
    const port = process.env.PORT ? Number(process.env.PORT) : 3000;
    await app.listen(port);
    console.log(JSON.stringify({
        level: 'info',
        msg: 'API started',
        port,
        timestamp: new Date().toISOString(),
    }));
}
bootstrap();
//# sourceMappingURL=main.js.map