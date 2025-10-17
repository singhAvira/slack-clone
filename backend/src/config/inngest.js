import { Inngest } from "inngest";
import { connectDB } from "./db";
import { User } from "../models/user.model.js";//import User model
// Create a client to send and receive events
export const inngest = new Inngest({ id: "slack-site" });

//now we craete a function which is being used to create an user or dlete user
//in database
const syncUser=inngest.createFunction(
    {id: "sync-user"},
    {event: "clerk/user.created"},
    async({event})=>{
     await connectDB()

     const {id, email_addresses,first_name,last_name,image_url }=event.data;

     const newUser={
        clerkId:id,
        email:email_addresses[0]?.email_address,
        name: `${first_name ||""} ${last_name || ""}`,
        image:image_url,
     }

     await User.create(newUser);

     //TODO DO THE MORE THING
    }
)

const deleteUserFromDB = inngest.createFunction(//delete the user from the databse 
    {id: "delete-user-from-db"},
    {event: "clerk/user.deleted"},
    async ({ event }) =>{ //this data is coming from clerk
       await  connectDB()
        const {id }=event.data;
        await User.deletOne({clerkId:id});
    }
)

// Create an empty array where we'll export future Inngest functions
export const functions = [syncUser,deleteUserFromDB];