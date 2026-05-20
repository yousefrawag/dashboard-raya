import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { FaRegPenToSquare } from "react-icons/fa6";
import { FiPlus } from "react-icons/fi";
import { useState } from 'react';

import useQueryadditeam from '../../../services/Queryadditeam';
import Loader from '../../../components/common/Loader/index';
import toast from 'react-hot-toast';
import UploadSingalefile from '../../../hooks/UploadSingalefile';
import SelectoptionHook from '../../../hooks/SelectoptionHook';
import useQuerygetiteams from '../../../services/Querygetiteams';
const Adduser = () => {
  const [image , setimage] = useState({})
  const [role , setRole] = useState("")
  const {data } = useQuerygetiteams("roles" , "roles")

  const {addIteam , isLoading} = useQueryadditeam("users" , "users")
  const navigate = useNavigate()
  const handleFileChange = (e) => {
   const file  = e.target.files[0]
   setimage({
    file,
    view:URL.createObjectURL(file)
   })
    e.target.value = "";
  };
 
  const handelSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
  
    const data = Object.fromEntries(formData);
    formData.append("image" , image.file)
    if(!data.fullName){
      toast.error("يجب إضافه اسم المستخدم")
        return ;
    }

    if(!data.email){
      toast.error("يجب إضافه الإيميل الخاص بالمستخدم")
      return ;
    }
    if(!data.phoneNumber){
        toast.error("يجب إضافه الجوال الخاص بالمستخدم")
        return ;
      }
      if(!data.job){
        toast.error("يجب إضافه وظيفة مستخدم")
        return ;
      }
      if(!data.type){
        toast.error("يجب إضافه نوع حساب مستخدم")
        return ;
      }
      if(!data.password){
        toast.error("يجب إضافه كلمة مرور الى حساب مستخدم")
        return ;
      }
      // Log FormData for debugging
  for (let [key, value] of formData.entries()) {
    console.log(key, value);
  }
      
    try {
    
        
        addIteam(formData, {
            onSuccess:() =>{
             
                e.target.reset()
                
                toast.success("تم إضافه مستخدم جديد")
                navigate("/All-users")
            },  
             onError: (error) => {
              if (error.response && error.response.data && error.response.data.mesg) {
                toast.error(error.response.data.mesg);
              } else {
                toast.error("An error occurred. Please try again.");
              }
            }
        })
    } catch (error) {
        console.log(error);
        toast.error(error.response?.data?.mesg)
    }
   }

 if(isLoading){
  return <Loader />
 }  
  return (
    <form onSubmit={handelSubmit} className='w-full h-full bg-white rounded-[10px] dark:bg-form-input' >
    <div className="dark:bg-form-input flex items-center shadow-lg gap-4 mb-4 w-full h-full p-4 bg-white rounded-[10px]">
      <div className="icon p-2 bg-main rounded-full">
        <FaRegPenToSquare />
      </div>
      <p className="font-semibold text-lg">ادخل بيانات المستخدم</p>
    </div>
   
   <div className='main-section w-full max-h-[400px] min-h-[100px] p-4 overflow-auto	'>
            <div className="mb-6 flex flex-col  gap-2">
                        <label
                            htmlFor="name"
                            className="w-full text-lg font-medium text-black dark:text-white"
                        >
                           اسم المستخدم
                        </label>
                        <input
                            type="text"
                            id="fullName"
                            name="fullName"
                    
                            className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
                        />
                    
            </div>
            <div className="mb-6 flex flex-col  gap-2">
                        <label
                            htmlFor="email"
                            className="w-full text-lg font-medium text-black dark:text-white"
                        >
                          الايميل
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                    
                            className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
                        />
                    
            </div>
            <div className="mb-6 flex flex-col  gap-2">
                        <label
                            htmlFor="phoneNumber"
                            className="w-full text-lg font-medium text-black dark:text-white"
                        >
                          جوال
                        </label>
                        <input
                            type="text"
                            id="phoneNumber"
                            name="phoneNumber"
                    
                            className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
                        />
                    
            </div>
            <div className="mb-6 flex flex-col  gap-2">
                        <label
                            htmlFor="job"
                            className="w-full text-lg font-medium text-black dark:text-white"
                        >
                          الوظيفة
                        </label>
                        <input
                            type="text"
                            id="job"
                            name="job"
                    
                            className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
                        />
                    
            </div>
            <div className="mb-6 flex flex-col  gap-2">
                        <label
                            htmlFor="type"
                            className="w-full text-lg font-medium text-black dark:text-white"
                        >
                         نوع الحساب
                        </label>
                        <select name='type' className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
                        >
                        <option value="">اختر</option>
                        
                        <option value="admin">أدمن</option>
                        <option value="employee">موظف</option>
                            <option value="brokker">مسوق تحت التدريب</option>
                        </select>
                    
            </div>
            <div className="mb-6 flex flex-col  gap-2">
                        <label
                            htmlFor="password"
                            className="w-full text-lg font-medium text-black dark:text-white"
                        >
                          كلمة المرور
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                    
                            className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
                        />
                    
            </div>
            <div className="mb-6 flex flex-col  gap-2">
                        <label
                            htmlFor="role"
                            className="w-full text-lg font-medium text-black dark:text-white"
                        >
                         الصلاحية 
                        </label>
                        <select name='role' className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
                        >
                        <option value="">اختر</option>
                        {
                          data?.data?.map((item) => {
                            return  <option key={item?._id} value={item?._id}>{item?.name}</option>
                          })
                        }
                       
                       
                        </select>
                    
            </div>
            
           
         
              
     <UploadSingalefile  images={image} handelFile={handleFileChange}  id="user"/>
   </div>
  

    <div className="add_return flex justify-between items-center mt-4 shadow-lg p-4 bg-white dark:bg-form-input">
    <div className="add_btn">
        <button type="submit"  className={` py-2 px-6 rounded-md bg-main text-white hover:bg-transparent hover:border hover:border-blue-600 hover:text-blue-600`}>
         إضافة
        </button>
      </div>
      <div className="return_btn">
        <NavLink to="/All-users" className="bg-gray-300 text-gray-700 py-2 px-6 rounded-md">عوده</NavLink>
      </div>
    
    </div>
  </form>
  )
}

export default Adduser