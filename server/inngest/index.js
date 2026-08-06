import { Inngest } from "inngest";
import {prisma} from "../configs/prisma.js"

export const inngest = new Inngest({ id: "my-app" , eventKey: process.env.INNGEST_EVENT_KEY,});


// Your new function:
const syncuserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk", triggers: [{ event: "clerk/user.created" }] },
  async ({ event}) => {
    const {data}=event;

    //Check if already
    const user= await prisma.user.findFirst({
        where: {id:data.id}
    })
    if(user){
        //Update user data if exists
        await prisma.user.update({
            where:{id:data.id},
            data:{
                email:data?.email_addresses[0]?.email_address,
                name: data?.first_name+" "+data?.last_name,
                image: data?.image_url,
            }
        })
        return ;
    }
    await prisma.user.create({
        data:{
            id: data.id,
            email:data?.email_addresses[0]?.email_address,
            name: data?.first_name+" "+data?.last_name,
            image: data?.image_url,
        }
    })
  },
);

//Inngest 
const syncuserDeletion = inngest.createFunction(
  { id: "delete-user-from-clerk", triggers: [{ event: "clerk/user.deleted" }] },
  async ({ event}) => {
    const {data}=event;
    
    const listings = await prisma.listing.findMany({
        where:{ownerId:data.id}
    })

    const chats = await prisma.chat.findMany({
        where:{OR : [{ownerUserId:data.id}, {chatUserId : data.id}]}
    })

    const transactions = await prisma.transaction.findMany({
        where:{userId:data.id}
    })

    if(listings.length === 0 && chats.length === 0 && transactions.length === 0){
        await prisma.user.delete({ where : {id : data.id}})
    }else{
        await prisma.listing.updateMany({
            where:{ownerId : data.id },
            data: { status : "inactive"}
        })
    }
    },
);

const syncuserUpdation = inngest.createFunction(
  { id: "update-user-from-clerk", triggers: [{ event: "clerk/user.updated" }] },
  async ({ event}) => {
    const {data}=event;
    await prisma.user.update({
        where:{ id:data.id },
        data:{
            email:data?.email_addresses[0]?.email_address,
            name:data?.first_name + " "+data?.last_name,
            image:data?.image_url,
        }
    })
  },
);

// Add the function to the exported array:
export const functions = [
  syncuserCreation,
  syncuserDeletion,
  syncuserUpdation
];