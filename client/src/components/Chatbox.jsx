import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Loader2Icon, Send, X } from 'lucide-react';
import { clearChat } from '../app/features/chatSlice';
import { format } from "date-fns"
import { useAuth, useUser } from '@clerk/clerk-react';
import api from '../config/axios';
import toast from 'react-hot-toast';


const Chatbox = () => {
    const {getToken} =useAuth();
    const { listing, isOpen, chatId } = useSelector((state) => state.chat);
    const dispatch=useDispatch();
    const { user } = useUser();
    
    const [chat, setChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newmessage, setNewMessage] = useState("");
    const [isloading, setisloading] = useState(true);
    const [isSending, setisSending] = useState(false);

    const fetchChat = async () => {
        try {
            const token = await getToken();
            const { data } = await api.post(
                '/api/chat',
                { listingId: listing.id, chatId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setChat(data?.chat);
            setMessages(data?.chat?.messages || []);
            setisloading(false);
        } catch (error) {
            toast.error(error?.response?.data?.message || error?.message);
            console.log(error);
            setisloading(false);
        }
    }


    useEffect(() => {
        if (listing) {
            fetchChat()
            const interval =setInterval(()=>{
                fetchChat();
            },3000)
            return ()=>clearInterval(interval)
        }
    }, [listing, chatId])

    useEffect(() => {
        if (!isOpen) {
            setChat(null);
            setMessages([]);
            setisloading(true);
            setNewMessage("");
            setisSending(false);
        }
    }, [isOpen])
    
    const messagesEndref=useRef(null);
    useEffect(()=>{
        messagesEndref.current?.scrollIntoView({behavior:"smooth"})
    },[messages.length])

    const handlesubmit= async (e)=>{
        e.preventDefault();
        if(!newmessage.trim() || isSending){
            return ;
        }
        try {
            setisSending(true);
            const token = await getToken();
            await api.post(
                '/api/chat/send-message',
                { chatId: chat.id, message: newmessage },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            await fetchChat();
            setNewMessage("");
            setisSending(false);
        } catch (error) {
            toast.error(error?.response?.data?.message || error?.message);
            console.log(error.message);
            setisSending(false);
        }
    }

    if (!isOpen || !listing) {
        return null;
    }

    return (
        <div className='fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-[100] flex items-center justify-center sm:p-4 '>
            <div className='bg-white sm:rounded-xl shadow-2xl w-full max-w-2xl h-screen sm:h-[600px] flex flex-col'>
                
                {/* Header */}
                <div className='bg-gradient-to-r from-indigo-600 to-indigo-400 text-white p-4 sm:rounded-t-lg flex items-center justify-between'>
                    <div className='flex-1 min-w-0'>
                        <h3 className='font-semibold text-lg truncate'>{listing?.title}</h3>
                        <p className='text-sm text-indigo-100truncate'>{user.id===listing?.ownerId ? `Chatting with buyer (${chat?.chatUser?.name || 'Loading...'}) `: `Chatting with Seller (${chat?.ownerUser?.name || 'Loading...'})`}</p>
                    </div>
                    <button onClick={()=>dispatch(clearChat())} className='ml-4 p-1 hover:bg-white/20 hover:bg-opacity-20 rounded-lg transition-colors'>
                        <X className='w-5 h-5 '/>
                    </button>
                </div>

                {/* Messages Area */}
                <div className='flex-1 overflow-y-auto p-4 space-y-4 bg-gray-100'>
                   {isloading ? (
                    <div className='flex items-center justify-center h-full'>
                        <Loader2Icon className='size-6 animate-spin text-indigo-600'/>
                    </div>
                   ):
                   messages.length === 0 ? (
                    <div className='flex items-center justify-center h-full'>
                        <div className='text-center'>
                            <p className='text-gray-500 mb-2'>No messages yet</p>
                            <p className='text-sm text-gray-400'>Start the conversation !</p>
                        </div>
                    </div>
                   ):(
                    messages.map((message)=>(
                        <div key={message.id} className={`flex ${message.sender_id === user.id ? "justify-end" :"justify-start"}`}>
                            <div className={`max-w-[70%] rounded-lg p-3 pb-1 ${message.sender_id === user.id ? "bg-indigo-600 text-white" : "bg-white border border-gray-200 text-gray-800"}`}>
                                <p className='text-sm break-words whitespace-pre-wrap'>{message.message}</p>
                                <p className={`text-[10px] mt-1 ${message.sender_id === user.id ? "text-indigo-200" : "text-gray-400"}`}>
                                    {format(new Date(message.createdAt), "MMM dd 'at' h:mm a")}
                                </p>
                            </div>
                        </div>
                    ))
                   )} 
                   <div ref={messagesEndref} />
                </div>

                {/*Input Area*/}
                {chat?.listing?.status === "active" ? (
                    <form onSubmit={handlesubmit}
                    className='p-4 bg-white border-t border-gray-200 rounded-b-lg'>
                        <div className='flex items-end space-x-2'>

                            <textarea
                            value={newmessage}
                            onChange={(e)=>setNewMessage(e.target.value)}
                            onKeyDown={(e)=>{
                                if(e.key==="Enter" && !e.shiftKey){
                                    e.preventDefault();
                                    handlesubmit(e);
                                }
                            }} 
                            placeholder='Type your message...'
                            className='flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-indigo-500 max-h-32 resize-none'
                            rows={1}
                            />
                            <button disabled={!newmessage.trim() || isSending} type="submit" className='bg-indigo-600 hover:bg-indigo-700 text-white p-2.5 rounded-lg disabled:opacity-50 transition-colors'>
                                {isSending ? <Loader2Icon className='w-5 h-5 animate-spin' /> : <Send className='w-5 h-5'/> }
                            </button>
                        </div>
                    </form>
                ):(
                    <div className='p-4 bg-white border-t border-gray-200 rounded-b-lg'>
                        <p className='text-sm text-gray-600 text-center' >{chat ? `Listing is ${chat?.listing?.status}`:"Loading chat..."}</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Chatbox