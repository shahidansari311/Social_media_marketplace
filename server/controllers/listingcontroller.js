import { protect } from "../middlewares/authMiddleware";
import { prisma } from "../configs/prisma";
import imagekit from "../configs/imagekit";
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
        accountDetails.platform=accountDetails.platform.tolowerCase();
        accountDetails.niche=accountDetails.niche.tolowerCase();

        accountDetails.username.startsWith('@') ? accountDetails.username= accountDetails.username.slice(1) : null ;

        const uploadImages = req.files.map(async (file)=>{
            const response = await imagekit.files.upload({
                file: fs.createReadStream(file.path),
                fileName: `${Date.now}.png`,
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

        return res.json({listing});

    } catch (error) {
       console.log(error);
        return res.status(500).json({
            message:"Error while uploading account detials"
        }) 
    }
}