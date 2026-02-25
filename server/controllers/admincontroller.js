
export const isAdmin=async(req,res)=>{
    try {
        return res.json({isAdmin:true})
    } catch (error) {
        console.log(error);
        res.status(400).json({message:error.code || error.message})
    }
}