import { ObjectId } from'mongodb';
import express from "express";
import cors from "cors";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import getCollections from "./connectToMong.js";
import * as env from 'dotenv';
import { validateUserToken } from './validateToken.js';
import { validateAddTodo, validateDeleteTodo, validateEditTodo} from './validater.js';
env.config();

const PORT = process.env.PORT;
const accessTokenString = process.env.ACCESS_TOKEN_PRIVATE_KEY;

const app = express();
app.use(cors());

app.use(express.json());

const {usersCollection,profileCollection,todosCollection} = await getCollections();

app.get('/',(req,res)=>{
    res.status(200);
    res.send("<h1 style='color:green'>Server running at PORT: 3000</h1> <p>Hello, Welcome to the Vedamanikanta's BE Server</p>");
});

app.post('/createuser',async(req,res)=>{
    try{
        const {username,password,childname} = req.body;
    const hashedPassword = await bcrypt.hash(password,10);
    const userDeatails = {username,password:hashedPassword,childname};
    userDeatails['isUserVerified'] = false;
    usersCollection.insertOne(userDeatails);
    res.send({message:"User Creacted",status:200}); 
    }catch(e){
        res.send({status:500,message:"Something wrong, went into catch"})
    }
    
})

app.post('/login',async(req,res)=>{

    try{
        const {username,password}=req.body;
        const selectUser =await usersCollection.findOne({username});
        let selectProfile;
        if (selectUser.isUserVerified){
            selectProfile = await profileCollection.findOne({_id:new ObjectId(selectUser.profile_id)});
        }
        if (selectUser&&selectUser.password){
            const isPasswordMatched =await bcrypt.compare(password,selectUser.password);
            if (isPasswordMatched){
                const payload = {username};
                const jwtToken = jwt.sign(payload,String(process.env.ACCESS_TOKEN_PRIVATE_KEY));
                const data = {jwtToken,isUserVerified:selectUser.isUserVerified,_id:selectUser._id};
                if(!!selectProfile){
                    data['profileDetials']=selectProfile;
                }
                res.status(200);
                res.send({status:200,message:'Login Successfull',data});
            }else{
                res.status(400);
                res.send({status:400,message:'Invalid Password'});
            }
        }else{
            res.status(400);
            res.send({status:400,message:'Invalid User'});
        }
    }catch(e){
        res.send({status:500,message:"Someting wrong, went into catch"});
    }
})

app.put('/profilecreate',async(req,res)=>{
    try{
        const payload = req.body;
        // const users = await profileCollection.findOne();
        const insertOne =await profileCollection.insertOne(payload);

        if (insertOne.acknowledged){
            const updateUserVerified =await usersCollection.updateOne(
                { _id: new ObjectId(payload.user_id) }, 
                { $set: { isUserVerified:true, profile_id : insertOne.insertedId } }, 
                { upsert: true } 
                );
        }
        res.send({status:200,message:'Got the request for update profile',})
    }catch (e){
        res.send({status:500,message:"Someting wrong, went into catch"})
    }
})

app.post('/addtodo',validateUserToken,validateAddTodo,async(req,res)=>{
    try {
        const {title, description, status}=req.body;
        const dbRes = await todosCollection.insertOne({...req.body});
        if (dbRes.acknowledged===true){
            res.send({message:"Todo Creacted",status:200});
        }else{
            res.send({message:'Db error',status:502});
        }
        
        } catch (error) {
            res.send({message:'Internal error',status:500});
    }
});

app.delete('/deletetoto',validateUserToken,validateDeleteTodo,async(req,res)=>{
    try{
        const {id} = req.body;
        const deleteTodoDbResponse = await todosCollection.deleteOne({_id:new ObjectId(id)});

        if (deleteTodoDbResponse.acknowledged===true){
            res.send({status:200,message:'Deleted Todo Successfully'});
        }else{
            res.send({status:502,message:'Db error'});///404 user not found
        }
    }catch(error){
        res.send({status:502,message:'Internal error'});
    }
})

app.get('/todos',async(req,res)=>{
    try {
        // let responseArr = [];
        const dbTodos = await todosCollection.find({}).toArray();

        res.send({status:200,data:dbTodos});
    } catch (error) {
        res.send({status:502,message:'Internal error'});
    }
})

app.put('/edittodo',validateUserToken,validateEditTodo,async(req,res)=>{
    try {
        const {_id,description,status, title}=req.body;
        const dbUpdateTodoRes = await todosCollection.updateOne(
            { _id: new ObjectId(_id) }, 
            { $set: { description,status, title } }, 
            { upsert: true } 
        )
        if (dbUpdateTodoRes.acknowledged===true){
            res.send({status:200,message:'Updated Todo'});
        }else{
            res.send({status:500,message:'Error in DB update'})
        }
    } catch (error) {
        res.send({status:500,message:"Someting wrong, went into catch,while adding previous todo"})
    }
})

app.listen(PORT,()=>console.log("server running at 3001"));
