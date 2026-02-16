import { Inngest } from "inngest";
import prisma from "../configs/prisma"

export const inngest = new Inngest({ id: "my-app" });

// Your new function:
const helloWorld = inngest.createFunction(
  { id: "sync-user-from-clerk" },
  { event: "clerk/user.created" },
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
                email:data?.email_addresses[0]?.email.address,
                name: data?.first_name+" "+data?.last_name,
                
            }
        })
    }
  },
);

// Add the function to the exported array:
export const functions = [
  helloWorld
];