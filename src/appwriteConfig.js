import { Client, Account, Databases } from 'appwrite';

export const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT
export const PROJECT_ID = '65f306bea3edb4f3b118'
export const DATABASE_ID = '65f3085f52ec8cd592e9'
export const COLLECTION_ID_MESSAGES = '65f30872cecbc3225308'
//took ids from appwrite 
const client = new Client();

client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('65f306bea3edb4f3b118');  

export const account = new Account(client);
export const databases = new Databases(client)

export default client;