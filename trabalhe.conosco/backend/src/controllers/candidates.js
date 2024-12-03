import Joi from 'joi';
import CandidatesDataAccess from '../dataAccess/candidates.js';
import { ok, notFound, serverError } from '../helpers/httpResponse.js';

// Schema para validação
const candidateSchema = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().pattern(/^[0-9]{10,11}$/).required(), 
    experience: Joi.string().allow(''),
    interestArea: Joi.string().required(),
});

export default class CandidatesController {
    constructor() {
        this.dataAccess = new CandidatesDataAccess();
    }

    async addCandidate(candidateData) {
        try {
            // Validação
            const { error } = candidateSchema.validate(candidateData);
            if (error) {
                return {
                    success: false,
                    statusCode: 400,
                    body: error.details[0].message,
                };
            }

            // Inserção no banco
            const result = await this.dataAccess.addCandidate(candidateData);
            return ok(result);
        } catch (error) {
            return serverError(error);
        }
    }

    async getAllCandidates() {
        try {
            const candidates = await this.dataAccess.getAllCandidates();
            return ok(candidates);
        } catch (error) {
            return serverError(error);
        }
    }

    async getCandidateById(candidateId) {
        try {
            const candidate = await this.dataAccess.getCandidateById(candidateId);
            return candidate ? ok(candidate) : notFound();
        } catch (error) {
            return serverError(error);
        }
    }

    async updateCandidate(candidateId, candidateData) {
        try {
            const result = await this.dataAccess.updateCandidate(candidateId, candidateData);
            return result ? ok(result) : notFound();
        } catch (error) {
            return serverError(error);
        }
    }

    async deleteCandidate(candidateId) {
        try {
            const result = await this.dataAccess.deleteCandidate(candidateId);
            return result ? ok(result) : notFound();
        } catch (error) {
            return serverError(error);
        }
    }
}
