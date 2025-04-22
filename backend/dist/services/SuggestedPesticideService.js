"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PackingUnit = void 0;
const prismaInit_1 = __importDefault(require("../lib/prismaInit"));
const prismaErrorHandler_1 = __importDefault(require("../utils/prismaErrorHandler"));
var PackingUnit;
(function (PackingUnit) {
    PackingUnit["MG"] = "mg";
    PackingUnit["G"] = "g";
    PackingUnit["KG"] = "kg";
    PackingUnit["ML"] = "ml";
    PackingUnit["L"] = "l";
})(PackingUnit || (exports.PackingUnit = PackingUnit = {}));
class SuggestedPesticideService {
    getDosageByFarmId(farm_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const dosage = yield prismaInit_1.default.dosage.findMany({
                    where: { farm_id },
                    include: { suggestions: { include: { product: { select: { name: true } } } } }
                });
                const transformedDosages = dosage.map((dosage) => (Object.assign(Object.assign({}, dosage), { suggestions: dosage.suggestions.map((suggestion) => (Object.assign(Object.assign({}, suggestion), { product: suggestion.product.name }))) })));
                const openDosage = [], closeDosage = [];
                transformedDosages.forEach((td) => td.isClosed ? closeDosage.push(td) : openDosage.push(td));
                return { open: openDosage, closed: closeDosage };
            }
            catch (error) {
                throw (0, prismaErrorHandler_1.default)(error);
            }
        });
    }
    getDosageByDosageId(dosage_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const dosage = yield prismaInit_1.default.dosage.findUnique({
                    where: { dosage_id },
                    include: { suggestions: { include: { product: true } }, farm: true }
                });
                return dosage;
            }
            catch (error) {
                throw (0, prismaErrorHandler_1.default)(error);
            }
        });
    }
    addDosage(dosageData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { suggestions } = dosageData, dosageInfo = __rest(dosageData, ["suggestions"]);
                const dosage = yield prismaInit_1.default.dosage.create({
                    data: Object.assign(Object.assign({}, dosageInfo), { suggestions: {
                            create: (suggestions === null || suggestions === void 0 ? void 0 : suggestions.map((pack) => ({
                                product_id: pack.product_id,
                                note: pack.note
                            }))) || []
                        } }),
                    include: {
                        suggestions: true
                    }
                });
                return dosage;
            }
            catch (error) {
                throw (0, prismaErrorHandler_1.default)(error);
            }
        });
    }
    markDosageAsPurchased(dosage_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const dosage = yield prismaInit_1.default.dosage.update({ where: { dosage_id }, data: { isClosed: true } });
                return dosage;
            }
            catch (error) {
                throw (0, prismaErrorHandler_1.default)(error);
            }
        });
    }
    updateDosage(dosage_id, dosageData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { suggestions } = dosageData, dosageInfo = __rest(dosageData, ["suggestions"]);
                if (suggestions && suggestions.length > 0) {
                    yield prismaInit_1.default.suggestedPesticide.deleteMany({
                        where: { dosage_id }
                    });
                }
                const updatedDosage = yield prismaInit_1.default.dosage.update({
                    where: { dosage_id },
                    data: {
                        farm_id: dosageInfo.farm_id,
                        suggestions: suggestions
                            ? {
                                create: suggestions.map((pack) => ({
                                    product_id: pack.product_id,
                                    note: pack.note
                                }))
                            }
                            : undefined
                    }
                });
                return updatedDosage;
            }
            catch (error) {
                console.log('error', error);
                throw (0, prismaErrorHandler_1.default)(error);
            }
        });
    }
    deleteDosage(dosage_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deleted = yield prismaInit_1.default.dosage.delete({
                    where: { dosage_id }
                });
                return deleted;
            }
            catch (error) {
                throw (0, prismaErrorHandler_1.default)(error);
            }
        });
    }
}
exports.default = SuggestedPesticideService;
