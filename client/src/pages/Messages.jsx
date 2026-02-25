import React, { useEffect, useMemo, useState } from 'react'
import { MessageCircle, Search } from 'lucide-react';
import { format ,isToday , isYesterday , parseISO } from 'date-fns';
import { useDispatch } from 'react-redux';
import { setChat } from '../app/features/chatSlice';
import { useAuth, useUser } from '@clerk/clerk-react';
import api from '../config/axios';
import toast from 'react-hot-toast';

const Messages = () => {

  const {getToken}=useAuth();
  const { user, isLoaded } = useUser();
  const [chats, setChats] = useState([]);
  const [searchQuery,setSearchQuery]=useState('');
  const [Loading,setLoading]=useState(true);
  const dispatch=useDispatch();

  const formatTime=(dateString)=>{
    if(!dateString) return;

    const date =parseISO(dateString);
    if(isToday(date)){
      return 'Today '+format(date, 'HH:mm'); 
    }
    if(isYesterday(date)){
      return 'Yesterday '+format(date,"HH:mm"); 
    }
    return format(date,"MMM d");
  }

  const filterChats = useMemo(()=>{
    const query = searchQuery.toLowerCase();
    return chats.filter((chatItem)=>{
      const chatUser = chatItem.chatUserId === user?.id ? chatItem?.ownerUser : chatItem?.chatUser;

      return (
        chatItem.listing?.title?.toLowerCase().includes(query) ||
        chatUser?.name?.toLowerCase().includes(query)
      );
    })
  },[chats,searchQuery,user]);

  const openChat=(chats)=>{
      dispatch(setChat({listing: chats.listing , chatId:chats.id}));
  }


  const fetchChats=async ()=>{
    try {
      const token=await getToken();
      const {data}=await api.get('/api/chat/user',{headers:{Authorization:`Bearer ${token}`}})
      setChats(data.chat || []);
      setLoading(false);
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message);
      console.log(error.message);
      setLoading(false);
    }
  }

  useEffect(()=>{
    if(user && isLoaded){
      fetchChats();
      const interval=setInterval(()=>{
        fetchChats();
      }, 10* 1000);
      return ()=> clearInterval(interval);
    }
  },[user,isLoaded])

  return (
    <div className='mx-auto min-h-screen px-6 md:px-16 lg:px-24 xl:px-32 pt-24 pb-20 bg-slate-50'>
      <div className=''>
        <div className='mb-8'>
          <h1 className='text-3xl md:text-4xl font-bold text-gray-900 mb-2'>
            Messages
          </h1>
          <p className='text-gray-500'>Chat with buyers and sellers</p>
        </div>
          <div className='relative max-w-xl mb-8'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5'/>
            <input
              type="text"
              placeholder='Search conversations... '
              value={searchQuery}
              onChange={(e)=>setSearchQuery(e.target.value)}
              className='w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500'
            />
          </div>

          {/* Chat List  */}
          {Loading ? (
            <div className='text-center text-gray-500 py-20'>Loading messages....</div>
          ):filterChats.length === 0 ?(
            <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-16 text-center'>
              <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4' >
                <MessageCircle className='w-8 h-8 text-gray-400'/>
              </div>
              <h3 className='text-xl font-semibold text-gray-900 mb-2'>
                {searchQuery ? "No chats found": "No messages yet"}
              </h3>
              <p className='text-sm text-gray-500 max-w-md mx-auto'>
                {searchQuery ? "Try a different search term." : "Start a conversation by viewing a listing and clicking “Open Negotiation”."}
              </p>
            </div>
          ):(
            <div className='bg-white rounded-lg shadow-xs border border-gray-200 divide-y divide-gray-200'>
              {filterChats.map((chat)=>{
                const chatUser=chat.chatUserId === user?.id ? chat.ownerUser : chat.chatUser;
                return (
                  <button key={chat.id} onClick={()=>openChat(chat)}
                  className='w-full p-4 hover:bg-gray-50 transition-colors text-left'>
                    <div className='flex items-start space-x-4'>
                      <div className='flex-shrink-0'>
                        <img src={chatUser?.image} alt={chat?.chatUser?.name} className='w-12 h-12 rounded-lg object-cover'/>
                      </div>
                      <div className='flex-1 min-w-0'>
                        <div className='flex items-center justify-between mb-1'>
                          <h3 className='font-semibold text-gray-800 truncate'>{chat.listing?.title}</h3>
                          <span className='text-xs text-gray-500 flex-shrink-0 ml-2'>{formatTime(chat.updatedAt)}</span>
                        </div>
                        <p>
                          {chatUser?.name}
                        </p>
                        <p className={`text-sm truncate ${!chat.isLastMessageRead && chat.lastMessageSenderId !== user?.id ? "text-indigo-600 font-medium":" text-gray-500"}`}>
                          {chat.lastMessage || 'No messages yet'}
                        </p>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
      </div>
    </div>
  )
}

export default Messages