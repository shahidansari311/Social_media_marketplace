import express from 'express';
import { addCredential, addListings, deleteuserlisting, getAllpubliclisting, getAlluserlisting, getAllUserOrders, markedFeatured, purschaseAccount, toggleStatus, updateListing, WithdrawAmaount } from '../controllers/listingcontroller.js';
import { protect } from '../middlewares/authMiddleware.js';
import upload from '../configs/multer.js';

const listingRouter=express.Router();

listingRouter.post('/',upload.array("images",5),protect,addListings);
listingRouter.put('/',upload.array("images",5),protect,updateListing);
listingRouter.get('/public',getAllpubliclisting);
listingRouter.get('/user',protect,getAlluserlisting);
listingRouter.put('/:id/status',protect,toggleStatus);
listingRouter.delete('/:listingId',protect,deleteuserlisting);
listingRouter.post('/add-credential',protect,addCredential);
listingRouter.put('/featured/:id',protect,markedFeatured);
listingRouter.get('/user-orders',protect,getAllUserOrders);
listingRouter.post('/withdraw',protect,WithdrawAmaount);
listingRouter.post('/purchase-account/:id',protect,purschaseAccount);


export default listingRouter;