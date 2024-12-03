import { MongoClient } from 'mongodb';

export const mongo = {
  async connect({ mongoConnectionString, mongoDbName }) {
    try {
      const client = new MongoClient(mongoConnectionString);

      await client.connect();
      const db = client.db(mongoDbName);

      this.client = client;
      this.db = db;

      console.log('Conexão ao MongoDB realizada com sucesso!');
      return 'connected to mongo';
    } catch (error) {
      console.error('Erro durante a conexão com o MongoDB:', error);
      return { text: 'error during mongo connection', error };
    }
  }
};
