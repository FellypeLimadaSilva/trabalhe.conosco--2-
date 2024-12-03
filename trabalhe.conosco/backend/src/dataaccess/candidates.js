import { mongo } from '../database/mongo.js';
import { ObjectId } from 'mongodb';

const collectionName = 'candidates';

export default class CandidatesDataAccess {
    async addCandidate(candidateData) {
        candidateData.status = 'Pending'; // Status inicial
        const result = await mongo.db.collection(collectionName).insertOne(candidateData);
        return result;
    }

    async getAllCandidates() {
        return await mongo.db.collection(collectionName).find({}).toArray();
    }

    async getCandidateById(candidateId) {
        return await mongo.db.collection(collectionName).findOne({ _id: new ObjectId(candidateId) });
    }

    async updateCandidate(candidateId, candidateData) {
        return await mongo.db.collection(collectionName).findOneAndUpdate(
            { _id: new ObjectId(candidateId) },
            { $set: candidateData },
            { returnDocument: 'after' }
        );
    }

    async deleteCandidate(candidateId) {
        return await mongo.db.collection(collectionName).deleteOne({ _id: new ObjectId(candidateId) });
    }
}
