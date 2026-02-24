import { protect } from "../middlewares/authMiddleware.js";
import { prisma } from "../configs/prisma.js";
import imagekit from "../configs/imagekit.js";
import fs from 'fs'

export const addListings=async (req,res)=>{
    try {
        const {userId} = await req.auth();
        if(req.plan !== 'premium'){
            const listingcount= await prisma.listing.count({
                where:{ownerId : userId}
            });
            if(listingcount >= 5){
                return res.status(400).json({
                    message:"you have reached free listing limit"
                });
            }
        }

        const accountDetails=JSON.parse(req.body.accountDetails)

        accountDetails.follower_count=parseFloat(accountDetails.follower_count);
        accountDetails.engagement_rate=parseFloat(accountDetails.engagement_rate);
        accountDetails.monthly_views=parseFloat(accountDetails.monthly_views);
        accountDetails.price=parseFloat(accountDetails.price);
        accountDetails.platform=accountDetails.platform.toLowerCase();
        accountDetails.niche=accountDetails.niche.toLowerCase();

        accountDetails.username.startsWith('@') ? accountDetails.username= accountDetails.username.slice(1) : null ;

        const uploadImages = req.files.map(async (file)=>{
            const response = await imagekit.files.upload({
                file: fs.createReadStream(file.path),
                fileName: `${Date.now()}.png`,
                folder :"socialBazar",
                transformation: {pre: "w-1280 , h-auto"}
            });
            return response.url
        })

        // Wait for all upload to complete
        const images= await Promise.all(uploadImages);
        const listing=await prisma.listing.create({
            data:{
                ownerId:userId,
                images,
                ...accountDetails
            }
        })
        return res.status(201).json({
            message:"Account Listed successfully" , listing
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Error while uploading account detials"
        })
    }
}

// constroller to get all public listing 
export const getAllpubliclisting= async (req,res)=>{
    try {
        
        const listing=await prisma.listing.findMany({
            where:{
                status:'active'
            },
            include :{owner :true},
            orderBy: {createdAt: 'desc'}
        })

        if(!listing || listing.length ===0){
            return res.json({listing:[]});
        }

        return res.json(listing);

    } catch (error) {
       console.log(error);
        return res.status(500).json({
            message:"Error while uploading account detials"
        }) 
    }
}

//Constroller for getting all user listing
export const getAlluserlisting=async (req,res)=>{
    try {

        const {userId} =await req.auth();
        const listing=await prisma.listing.findMany({
            where:{ownerId:userId, status:{not:'deleted'}},
            orderBy:{createdAt:'desc'}
        })

        const user=await prisma.user.findUnique({
            where:{id:userId}
        })

        const balance ={
            earned:user.earned,
            withdrawn:user.withdrawn,
            available : user.earned -user.withdrawn
        }

        if(!listing || listing.length===0){
            return res.json({listing:[],balance})
        }
        return res.json({listing,balance})

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:error.message
        })
    }
}



// constroller for updating listing in database 
export const updateListing=async(req,res)=>{
    try {
        
        const {userId}=await req.auth();
        const accountDetails=JSON.parse(req.body.accountDetails);

        if(req.files.length + accountDetails.images.length > 5){
            return res.status(400).json({message:"YOu can only upload 5 images"});
        }

        accountDetails.follower_count=parseFloat(accountDetails.follower_count);
        accountDetails.engagement_rate=parseFloat(accountDetails.engagement_rate);
        accountDetails.monthly_views=parseFloat(accountDetails.monthly_views);
        accountDetails.price=parseFloat(accountDetails.price);
        accountDetails.platform=accountDetails.platform.tolowerCase();
        accountDetails.niche=accountDetails.niche.tolowerCase();

        accountDetails.username.startsWith('@') ? accountDetails.username= accountDetails.username.slice(1) : null ;

        const listing =await prisma.listing.update({
            where:{id:accountDetails.id , ownerId:userId},
            data:accountDetails
        })

        if(!listing){
            return res.status(404).json({message:"Listing not found"})
        }

        if(listing.status === 'sold'){
            return res.status(404).json({message:"You can't update sold listing"})
        }

        if(req.files.length > 0){
            const uploadImages = req.files.map(async (file)=>{
            const response = await imagekit.files.upload({
                file: fs.createReadStream(file.path),
                fileName: `${Date.now}.png`,
                folder :"socialBazar",
                transformation: {pre: "w-1280 , h-auto"}
            });
            return response.url
        })
        const images= await Promise.all(uploadImages);
        
        const listing=await prisma.listing.update({
            where:{id:accountDetails.id , ownerId:userId},
            data:{
                ownerId:userId,
                ...accountDetails,
                images:[...accountDetails.images, ...images]
            }
        })
        return res.json({message:"Account updated successfully", listing})
    }
       return res.json({message:"Account updated successfully", listing}) 
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:error.message
        })
    }
}

export const toggleStatus=async (req,res)=>{
    try {
        
        const {id}=req.params;
        const {userId} =await req.auth();
        const listing =await prisma.listing.findUnique({
            where:{id, ownerId:userId},
        })
        if(!listing){
            return res.status(404).json({
                message:"Listing not found"
            })
        }

        if(listing.status==='active' || listing.status=='inactive'){
             await prisma.listing.update({
                where:{id,ownerId:userId},
                data:{status:listing.status ==='active' ? 'inactive':'active'}
             })  
        }else if(listing.status === 'ban'){
            return res.status(400).json({message:"Your listing is banned"})
        }else if(listing.status==='sold'){
            return res.status(400).json({message:"Your listing is sold"})
        }


        return res.json({message:"listing status updated successfully ",listing:updated})

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:error.message
        })
    }
}

export const deleteuserlisting=async(req,res)=>{
    try {

        const {userId}=await req.auth();
        const {listingId}= req.params;
        const listing=await prisma.listing.findFirst({
            where:{id:listingId,ownerId:userId},
            include:{owner:true},
        })

        if(!listing){
            return res.status(404).json({message:"Listing not foound"});
        }
        if(listing.status==='sold'){
            return res.status(404).json({message:"Sold listing acnnot be deleted"});
        }
        // If password has been changed 
        if(listing.isCredentialChanged){
            //send email to owner
        }

        await prisma.listing.update({
            where:{id:listingId,ownerId:userId},
            data:{status:"deleted"}
        })

        return res.json({message:"listing deleted successfully"});
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:error.message
        })
    }
}


export const addCredential=async(req,res)=>{
    try {

        const {userId}=await req.auth();
        const {listingId,credential}= req.body;
        
        if(credential.length === 0 || !listingId){
           return res.status(400).json({message:"Missing fields"}) 
        }

        const listing=await prisma.listing.findFirst({
            where:{id:listingId,ownerId:userId}
        })

        if(!listing){
            return res.status(404).json({
                message:"Listing not found or you are not the owner"
            });
        }

        await prisma.credential.create({
            data:{
                listingId,
                originalCredential:credential
            }
        })

        await prisma.credential.update({
            where:{id:listingId},
            data:{isCredentialSubmitted:true}
        })

        return res.json({message:"Credential Changed"});
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:error.message
        })
    }
}

export const markedFeatured=async(req,res)=>{
    try {
        
        const {userId}=await req.auth();
        const {id}=req.params;
        if(req.plan!=='premium'){
            return res.status(400).json({message:"Premium plan required"})
        }

        // Unset all other listing 
        await prisma.listing.updateMany({
            where:{ownerId:userId},
            data:{featured:false}
        })

        // mark the listing as fetured 
        await prisma.listing.update({
            where:{id},
            data:{featured:true}
        })

        return res.json({message:"Listing marked as featured"});

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:error.message
        })
    }
}


export const getAllUserOrders =async (req,res)=>{
    try {
       const {userId}=await req.auth();
       let orders=await prisma.transaction.findMany({
        where:{userId, isPaid:true},
        include:{listing:true}
       })

       if(!orders || orders.length ===0){
        return res.json({orders:[]});
       }

       //Attch the credential
       const credential = await prisma.credential.findMany({
        where:{listingId:{in :orders.map((order)=>order.listingId)}}
       })

       const ordersWithCredentials= orders.map((order)=>{
        const credential=credential.find((cred)=>cred.listingId===order.listingId)
        return {...order, credential}
       })
        
       return res.json({orders:ordersWithCredentials});

    } catch (error) {
       console.log(error);
        return res.status(500).json({
            message:error.message
        }) 
    }
}

export const WithdrawAmaount =async (req,res)=>{
    try {
       const {userId}= await req.auth();
       const {amount , account}=req.body;

       const user=await prisma.user.findUnique({where:{id:userId}});

       const balance=user.earned- user.withdrawn;

       if(amount>balance){
        return res.status(400).json({message:"Insufficient Balance"});
       }
        
       const withdrawal=await prisma.withdrawal.create({
        data:{
            userId, amount, account
        }
       })

       await prisma.user.update({
        where:{id:userId},
        data:{
            withdrawn:{increment:amount}
        }
       })

       return res.json({message:"Applied for withdrawal", withdrawal});

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:error.message
        })
    }
}


export const purschaseAccount=async (req,res)=>{
    
}