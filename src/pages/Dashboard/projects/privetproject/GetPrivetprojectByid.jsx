import React from 'react'
import image1 from "../../../../images/brand/brand-01.svg"
import image2 from "../../../../images/brand/brand-02.svg"
import image3 from "../../../../images/brand/brand-03.svg"
import { FaFilePdf } from "react-icons/fa6";

import { HiMiniViewfinderCircle } from "react-icons/hi2";
import HeadPagestyle from '../../../../components/common/HeadPagestyle';
import useQuerygetSpacficIteam from '../../../../services/QuerygetSpacficIteam';
import Loader from '../../../../components/common/Loader';
import useGetUserAuthentications from '../../../../middleware/GetuserAuthencations';
import PopupCheckdelete from '../../../../components/common/popupmdules/PopupCheckdelete';
import { Link } from 'react-router-dom';
import { useDashboardContext } from '../../../../context/DashboardProviedr';
import { useParams } from 'react-router-dom';
const GetPrivetprojectByid = () => {
  const {id} = useParams()
  const {data , isLoading} = useQuerygetSpacficIteam("Privetprojects" , "Privetprojects" , id)
    const {CanAdd , CanDelte , CanEdit , CanView , isAdmin} = useGetUserAuthentications("PrivetProjects")
    const {  setModuleDelete } =  useDashboardContext()
  const CurrentItem = data?.project 
  if(isLoading) {
    return <Loader />
  }
  return (
    <div className='w-full h-full'>
    <HeadPagestyle pageName="بيانات الخدمة" to="/privte-projects" title="عوده" />

           <span>
                إجراء
               </span>
                
               <div  className='flex gap-5 m-5'>
          
                {
                  isAdmin || CanEdit ?    <Link to={`/edit-privte-projects/${id}`} className='w-20 p-2 bg-main text-white rounded-md text-center'>تعديل</Link>
                  : null
                }
                     <Link to="/privte-projects"  className='w-20 p-2 text-center bg-main text-white rounded-md'>
                                عوده
                                </Link>
            {
              isAdmin || CanDelte ? 
              <button type='button' onClick={() => setModuleDelete(true)} className='w-20 p-2 bg-main text-white rounded-md'>حذف</button>
              : null
            }
            
               </div>
<div className='w-full h-full grid grid-cols-1 gap-2 xl:grid-cols-2	 shadow-md p-5	'>
           <div className="mb-6 flex flex-col  gap-2">
             <span
               htmlFor="name"
               className="w-full text-lg font-medium text-gray-700 dark:text-white"
             >
                    إسم المهمة
             </span>
             <p className=" dark:border-form-strokedark dark:bg-form-input  text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
            
            >
              {
                CurrentItem?.projectName
              }
            </p>
          
           </div>
        
          
           <div className="mb-6 flex flex-col  gap-2">
             <span
               htmlFor="name"
               className="w-full text-lg font-medium text-gray-700 dark:text-white"
             >
              متطلبات المهمة
             </span>
             <p className=" dark:border-form-strokedark dark:bg-form-input  text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
            
            >
                {
                CurrentItem?.projectDetails
              }
            </p>
          
           </div>
           <div className="mb-6 flex flex-col  gap-2">
             <span
               htmlFor="name"
               className="w-full text-lg font-medium text-gray-700 dark:text-white"
             >
             ملاحظات المهمة
             </span>
             <p className=" dark:border-form-strokedark dark:bg-form-input  text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
            
            >
                 {
                CurrentItem?.notes
              }
            </p>
          
           </div>

      
 </div>
 <br />
    <h2 className='mb-10 mt-5'>مرفقات المهمة</h2>
     <div className='w-full h-full grid grid-cols-1 gap-2 xl:grid-cols-2'>
      {
        CurrentItem?.imagesURLs?.map((item) => {
          return <div key={item?.fileID}  className="relative rounded-lg overflow-hidden group">
                    
          <img
          src={item?.fileURL}
          
          className="w-full h-40 object-cover"
          />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col justify-between p-2 transition">
          <a
          href={item?.fileURL}
              className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-main text-white"
            target="_blank"
          >
              <HiMiniViewfinderCircle />
          </a>
          
          </div>
      
  </div>
        })
      }
          
            
         
     </div>
     <br />
     <div className='mt-10 w-full h-full grid grid-cols-1 gap-2 xl:grid-cols-2'>
      {
        CurrentItem?.docsURLs?.map((item) => {
          return  <div
                  key={item?.fileID}        
          className="relative flex items-center justify-between p-4 h-16 bg-red-100 rounded-lg group"
        >
 
          <FaFilePdf className="text-4xl text-red-500" />
          <a
           href={item?.fileURL}
            className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-main text-white opacity-0 group-hover:opacity-100 transition"
              target="_blank"
          >
            <HiMiniViewfinderCircle />
          </a>
</div>
        })
      }
             
      
     </div>
     <PopupCheckdelete navigatepage="/privte-projects" value={true} deleteKey="Privetprojects" titale="المشروع" id={id} />
             <span>
                إجراء
               </span>
                
               <div  className='flex gap-5 m-5'>
          
                {
                  isAdmin || CanEdit ?    <Link to={`/edit-privte-projects/${id}`} className='w-20 p-2 bg-main text-white rounded-md text-center'>تعديل</Link>
                  : null
                }
                     <Link to="/privte-projects"  className='w-20 p-2 text-center bg-main text-white rounded-md'>
                                عوده
                                </Link>
            {
              isAdmin || CanDelte ? 
              <button type='button' onClick={() => setModuleDelete(true)} className='w-20 p-2 bg-main text-white rounded-md'>حذف</button>
              : null
            }
            
               </div>
</div>
  )
}

export default GetPrivetprojectByid