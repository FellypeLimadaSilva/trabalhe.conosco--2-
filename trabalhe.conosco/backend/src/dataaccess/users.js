import { mongo } from "../database/mongo.js";
import { ObjectId } from "mongodb";
import crypto from 'crypto'

const collectionName = "users";

export default class UsersDataAccess {
    async getUsers() {
        const result = await mongo.db
            .collection(collectionName)
            .find({})
            .toArray();

        return result;
    }

    async deleteUser(userId) {
        if (!ObjectId.isValid(userId)) {
            throw new Error("Invalid user ID format");
        }

        const result = await mongo.db
            .collection(collectionName)
            .findOneAndDelete({ _id: new ObjectId(userId) });

        return result.value ? { message: "User deleted successfully" } : { message: "User not found" };
    }

    async updateUser(userId, userData) {
        if (!ObjectId.isValid(userId)) {
            throw new Error("Invalid user ID format");
        }
    
        // Verifica se a senha precisa ser atualizada
        if (userData.password) {
            const salt = crypto.randomBytes(16);
    
            // Usando uma promise para lidar com a senha
            const hashedPassword = await new Promise((resolve, reject) => {
                crypto.pbkdf2(userData.password, salt, 310000, 16, 'sha256', (err, derivedKey) => {
                    if (err) reject(err);
                    resolve(derivedKey);
                });
            });
    
            // Adiciona os novos valores ao userData
            userData.password = hashedPassword;
            userData.salt = salt;
        }
    
        // Realiza a atualização no MongoDB
        const result = await mongo.db
            .collection(collectionName)
            .findOneAndUpdate(
                { _id: new ObjectId(userId) }, // Filtro
                { $set: userData },           // Atualização
                { returnDocument: "after" }   // Retorna o documento atualizado
            );
    
        return result.value
            ? { message: "User updated successfully", user: result.value }
            : { message: "User not found" };
    }
    
}
