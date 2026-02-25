import { useAuth } from '@clerk/clerk-react';
import { Loader2Icon, Upload } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom'
import api from '../config/axios';
import { getAllPublicListing, getAllUserListing } from '../app/features/listingSlice';

const Managelisting = () => {

  const { id } = useParams();
  const navigate = useNavigate();
  const { userlistings = [] } = useSelector((state) => state.listing);
  
  const {getToken}=useAuth();
  const dispatch=useDispatch();


  const [loadingListing, setLoadingListing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setformData] = useState({
    title: '',
    platform: '',
    username: '',
    followers_count: '',
    engagement_rate: '',
    monthly_views: '',
    niche: '',
    price: '',
    description: '',
    verified: false,
    monetized: false,
    country: '',
    age_range: '',
    images: [],
  });

  const platform = ['youtube', 'instagram', 'tiktok', 'facebook', 'twitter', 'linkedin', 'pinterest', 'snapchat', 'twitch', 'discord'];

  const niches = ['lifestyle', 'fitness', 'food', 'travel', 'tech', 'gaming', 'fashion', 'beauty', 'business', 'education', 'entertainment', 'music', 'art', 'sports', 'health', 'finance', 'other'];

  const ageRanges = ['13-17 years', '18-24 years', '25-34 years', '35-44 years', '45-54 years', '55+ years', 'Mixed ages'];

  const handleInputChange = (field, value) => {
    setformData((prev) => ({ ...prev, [field]: value }));
  }

  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (!files.length) return;
    if (files.length + formData.images.length > 5) {
      return toast.error("You can add up to 5 images");
    }

    setformData((prev) => ({ ...prev, images: [...prev.images, ...files] }));
  }

  const removeImage = (indexToRemove) => {
    setformData((prev) => ({
      ...prev, images: prev.images.filter((_, i) => i !== indexToRemove)
    }));
  }

  useEffect(() => {
    if (!id) return;
    setIsEditing(true);
    setLoadingListing(true);
    const listing = userlistings.find((listing) => listing.id === id)
    if (listing) {
      setformData(listing);
      setLoadingListing(false);
    } else {
      toast.error("Listing not found");
      navigate("/Mylisting");
    }
  }, [id])

  const handleformSubmit = async (e) => {
    e.preventDefault();
    toast.loading("Saving...");
    const datacopy=structuredClone(formData);
    try {
      if(isEditing){
        datacopy.images=formData.images.filter((image)=> typeof image==='string');

        const fromDataInstance=new FormData()
        fromDataInstance.append('accountDetails',JSON.stringify(datacopy));

        formData.images.filter((image)=>typeof image!== 'string').forEach((image)=>{fromDataInstance.append('images',image)});

        const token=await getToken();

        const {data}=await api.put('/api/listing',fromDataInstance,{headers:{Authorization : `Bearer ${token}`}})
        toast.dismissAll();
        toast.success(data.message)
        dispatch(getAllUserListing({getToken}))
        dispatch(getAllPublicListing())
        navigate('/Mylisting')
      }
      else{
        delete datacopy.images;
        const formDataInstance= new FormData();
        formDataInstance.append('accountDetails',JSON.stringify(datacopy));
        formData.images.forEach((image)=>{
          formDataInstance.append('images',image)
        })
        const token= await getToken();
        const {data} = await api.post('/api/listing',formDataInstance,{headers:{Authorization:`Bearer ${token}`}})
        toast.dismissAll();
        toast.success(data.message)
        dispatch(getAllUserListing({getToken}))
        dispatch(getAllPublicListing())
        navigate('/Mylisting')
    }
    } catch (error) {
      toast.dismissAll();
      toast.error(error.message)
      // console.log(error);
    }

  };

  if (loadingListing) {
    return (
      <div className='h-screen flex items-center justify-center'>
        <Loader2Icon className='size-7 animate-spin text-indigo-600' />
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-slate-50 pt-24 pb-16 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-4xl mx-auto'>
        <div className='mb-8'>
          <h1 className='text-3xl md:text-4xl font-bold text-gray-900'>
            {isEditing ? "Edit listing" : "List your account"}
          </h1>
          <p className='text-gray-500 mt-2 text-sm md:text-base'>
            {isEditing ? 'Update your existing account listing ' : 'Create a mock listing to display your account info'}
          </p>
        </div>

        <form onSubmit={handleformSubmit} className='space-y-8'>
          {/* Basic Info  */}
          <Section title='Basic Information'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <InputField label='Listing Title *' value={formData.title} placeholder="e.g. , Premium travel Instagram Account" onChange={(v) => handleInputChange('title', v)} required={true} />

              <SelectField label='Platform *' options={platform} value={formData.platform} onChange={(v) => handleInputChange('platform', v)} required={true} />

              <InputField label='Username/Handle *' value={formData.username} placeholder="@username" onChange={(v) => handleInputChange('username', v)} required={true} />

              <SelectField label='Niche/Cateogory *' options={niches} value={formData.niche} onChange={(v) => handleInputChange('niche', v)} required={true} />
            </div>
          </Section>

          {/* Account Metrics  */}
          <Section title='Account Metrics'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-6'>

                <InputField label='Followers count *' min={0} 
                type='number' value={formData.followers_count} placeholder="10000" onChange={(v) => handleInputChange('followers_count', v)} required={true} />
                
                <InputField label='Engagement Rate(%)' min={0} 
                type='number' value={formData.engagement_rate} placeholder="4" onChange={(v) => handleInputChange('engagement_rate', v)} max={100} />
                
                <InputField label='Monthly views/impression' type='number' min={0} value={formData.monthly_views} placeholder="100000" onChange={(v) => handleInputChange('monthly_views', v)} />
                
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
                <InputField label='Primary Audience Contry' value={formData.country} placeholder="USA" onChange={(v) => handleInputChange('country', v)}/>

                <SelectField label='Primary Audience Age Range' options={ageRanges} value={formData.age_range} onChange={(v) => handleInputChange('age_range', v)}/>                
            </div>
            <div className='space-y-3'>
                <Checkboxx label='Account is verified on the platform' checked={formData.verified} onChange={(v)=>handleInputChange('verified',v)}/>
                <Checkboxx label='Account is monetized ' checked={formData.monetized} onChange={(v)=>handleInputChange('monetized',v)}/>
            </div>
          </Section>
          
          {/* Pricing  */}
          <Section title='Pricing & description *'>
            <InputField label='Asking Price' type='number' min={0} value={formData.price} placeholder="2500.0" onChange={(v) => handleInputChange('price', v)} required={true}/>
            <TextAreafield label="Description *" value={formData.description} onChange={(v)=>handleInputChange('description',v)} required={true}/>
          </Section>

          <Section title='Screenshot & Proofs'>
            <div className='border-2 border-dashed border-gray-300 rounded-lg p-6 text-center'>
                <input type='file' id='images' multiple accept='image' onChange={handleImageUpload} className='hidden'/>
                <Upload className='w-12 h-12 text-gray-400 mx-auto mb-4'/>
                <label htmlFor="images" className='px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer'>
                  Choose files
                </label>
                <p className='text-sm text-gray-500 mt-2'>Upload screenshots & proof of account analytics</p>
            </div>
            {formData.images.length > 0 && (
              <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mt-4'>
                {formData.images.map((image,index)=>(
                  <div className='relative' key={index}>
                    <img src={typeof image === 'string' ? image : URL.createObjectURL(image)} alt={`image ${index+1}`} className='w-full h-24 object-cover rounded-lg'/>
                    <button type='button' onClick={()=>removeImage(index)} className='absolute -top-2 -right-2 size-6 bg-red-600 text-white rounded-full hover:bg-red-700'>
                      x
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Section>
          <div className='flex justify-end gap-3 text-sm'>
            <button
              type='button'
              onClick={() => navigate(-1)}
              className='px-6 py-2 rounded-xl border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors'
            >
              Cancel
            </button>
            <button
              type='submit'
              className='px-7 py-2.5 rounded-xl premium-gradient text-white font-semibold shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-95 transition-all'
            >
              {isEditing ? 'Update Listing' : 'Create listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// common Element 
const Section = ({ title, children }) => (
  <div className='glass-card rounded-3xl p-6 md:p-7 space-y-6'>
    <h2 className='text-lg font-semibold text-gray-900'>{title}</h2>
    {children}
  </div>
)

const InputField = ({ label, value, onChange, placeholder, type = 'text', required = false, min = null, max = null }) => (
  <div>
    <label className='block text-sm font-medium text-gray-700 mb-2'>{label}</label>
    <input
      type={type}
      min={min}
      max={max}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className='w-full rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500'
      required={required}
    />
  </div>
)

const SelectField = ({ label, options, value, onChange, required = false }) => (
  <div className=''>
    <label className='block text-sm font-medium text-gray-700 mb-2'>{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className='w-full rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500'
      required={required}
    >
      <option value=''>Select...</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
)

const Checkboxx=({label,checked , onChange ,required=false})=>(
  <label className='flex items-center space-x-2 cursor-pointer'>
    <input type="checkbox" checked={checked} onChange={(e)=>onChange(e.target.checked)} className='size-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500' required={required}/>
    <span className='text-sm text-gray-700'>{label}</span>
  </label>
)


const TextAreafield=({label,value,onChange,required=false})=>(
  <div>
    <label className='block text-sm font-medium text-gray-700 mb-2'>{label}</label>
    <textarea
      rows={5}
      value={value}
      onChange={(e)=>onChange(e.target.value)}
      className='w-full rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500'
      required={required}
    />
  </div>
)

export default Managelisting