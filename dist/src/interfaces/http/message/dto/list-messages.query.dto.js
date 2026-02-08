"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListMessagesQueryDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const DATE_ONLY_REGEX = /^\d{4}-\d{2}-\d{2}$/;
class ListMessagesQueryDto {
}
exports.ListMessagesQueryDto = ListMessagesQueryDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => (typeof value === 'string' ? value.trim() : value)),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(80),
    __metadata("design:type", String)
], ListMessagesQueryDto.prototype, "sender", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Matches)(DATE_ONLY_REGEX, {
        message: 'startDate must be in format YYYY-MM-DD (e.g., 2026-02-06)',
    }),
    __metadata("design:type", String)
], ListMessagesQueryDto.prototype, "startDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Matches)(DATE_ONLY_REGEX, {
        message: 'endDate must be in format YYYY-MM-DD (e.g., 2026-02-08)',
    }),
    __metadata("design:type", String)
], ListMessagesQueryDto.prototype, "endDate", void 0);
//# sourceMappingURL=list-messages.query.dto.js.map