import {MongoClient} from 'mongodb';
import * as env from 'dotenv';
env.config();
const str = process.env.MONGOCONNECT;

const connectToCliuster=async(uri)=>{
    let mongoCliet;
    try{
        mongoCliet = new MongoClient(uri);
        await mongoCliet.connect;
        console.log("Connection to Mongo DB Atlas Success!");
        return mongoCliet;
    }catch(er){
        console.log("Connection to Mongo DB Atlas failed!",er);
    }
}

const getCollections =async()=>{
    let mongoCliet;
    try{
        mongoCliet = await connectToCliuster(str);
        const db = await mongoCliet.db('users');
        const usersCollection = await db.collection('users');
        const profileCollection = await db.collection('profile_details');
        const todosCollection = await db.collection('todos');
        return {usersCollection,profileCollection,todosCollection};
    }finally{

    }
}

export default getCollections;
