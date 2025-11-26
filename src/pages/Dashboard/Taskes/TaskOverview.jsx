import React from 'react'
import useQuerygetSpacficIteam from '../../../services/QuerygetSpacficIteam'
import { useParams } from 'react-router-dom'
import { FaFilePdf } from "react-icons/fa6";
import {  FaCheckCircle } from 'react-icons/fa';
import { HiMiniViewfinderCircle } from "react-icons/hi2";
import HeadPagestyle from '../../../components/common/HeadPagestyle'
import Loader from '../../../components/common/Loader';
import { Link } from 'react-router-dom';
import { useDashboardContext } from '../../../context/DashboardProviedr';
import PopupCheckdelete from '../../../components/common/popupmdules/PopupCheckdelete';
import useGetUserAuthentications from '../../../middleware/GetuserAuthencations';
const TaskOverview = () => {
    const {id} = useParams()
    const {data , isLoading} = useQuerygetSpacficIteam("missions" , "missions" , id)
    const Currentitem = data?.data
     const {  setModuleDelete } =  useDashboardContext()
     const {CanAdd , CanDelte , CanEdit , CanView , isAdmin} = useGetUserAuthentications("Missions")
    const Team = Currentitem?.assignedTo
  if(isLoading){
    return <Loader />
  }  
  return (
    <div className='w-full h-full'>
    <HeadPagestyle pageName="بيانات المهمة" to="/Taskes" title="عوده" />

      <span>
        إجراء
       </span>
       <div  className='flex gap-5 m-5'>
              
        {
          isAdmin || CanEdit ?    <Link to={`/edit-Taskes/${id}`} className='w-20 p-2 bg-main text-white rounded-md text-center'>تعديل</Link>
          : null
        }
         <Link to="/Taskes"  className='w-20 p-2 text-center bg-main text-white rounded-md'>
                         عوده
                         </Link>
    {
      isAdmin || CanDelte ? 
      <button onClick={() => setModuleDelete(true)} className='w-20 p-2 bg-main text-white rounded-md'>حذف</button>
      : null
    }
    
       </div>
<div className='w-full h-full grid grid-cols-1 gap-2 xl:grid-cols-2	 shadow-md p-5	'>
         
        
          
           <div className="mb-6 flex flex-col  gap-2">
             <span
               htmlFor="name"
               className="w-full text-lg font-medium text-gray-700 dark:text-white"
             >
             نوع المهمة
             </span>
             <p className=" dark:border-form-strokedark dark:bg-form-input  text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
            
            >
               {Currentitem?.missionType}
            </p>
          
           </div>
       
           {
            Currentitem?.missionType === "مشروع عام"  ? (
    <>
       <div className="mb-6 flex flex-col  gap-2">
                <span
                  htmlFor="name"
                  className="w-full text-lg font-medium text-gray-700 dark:text-white"
                >
                المشروع
                </span>
                <p className=" dark:border-form-strokedark dark:bg-form-input  text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
               
               >
                     {Currentitem?.project?.projectName}
               </p>
             
              </div>
             
              <div className="mb-6 flex flex-col  gap-2">
             <span
               htmlFor="name"
               className="w-full text-lg font-medium text-gray-700 dark:text-white"
             >
           نوع العقار
             </span>
             <p className=" dark:border-form-strokedark dark:bg-form-input  text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
            
            >
               {Currentitem?.project?.estateType}
            </p>
          
           </div>
                <div className="mb-6 flex flex-col  gap-2">
         
                <span
                  htmlFor="name"
                  className="w-full text-lg font-medium text-gray-700 dark:text-white"
                >
                المنطقة
                </span>
                <p className=" dark:border-form-strokedark dark:bg-form-input  text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
               
               >
                     {Currentitem?.project?.governoate}
               </p>
             
              </div>
              <div className="mb-6 flex flex-col  gap-2">
         
         <span
           htmlFor="name"
           className="w-full text-lg font-medium text-gray-700 dark:text-white"
         >
         العنوان بالتفصيل

         </span>
         <p className=" dark:border-form-strokedark dark:bg-form-input  text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
        
        >
              {Currentitem?.project?.detailedAddress}
        </p>
      
       </div>
          
              <div className="mb-6 flex flex-col  gap-2">
                <span
                  htmlFor="name"
                  className="w-full text-lg font-medium text-gray-700 dark:text-white"
                >
                تفاصيل العقار

                </span>
                <p className=" dark:border-form-strokedark dark:bg-form-input  text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
               
               >
                  {Currentitem?.project?.projectDetails}
               </p>
             
              </div>
              <div className="mb-6 flex flex-col  gap-2">
                <span
                  htmlFor="name"
                  className="w-full text-lg font-medium text-gray-700 dark:text-white"
                >
                نص الاعلان

                </span>
                <p className=" dark:border-form-strokedark dark:bg-form-input  text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
               
               >
                          {Currentitem?.project?.projectads}
               </p>
             
              </div> 
              <div className="mb-6 flex flex-col  gap-2">
                <span
                  htmlFor="name"
                  className="w-full text-lg font-medium text-gray-700 dark:text-white"
                >
              حالة المشروع

                </span>
                <p className=" dark:border-form-strokedark dark:bg-form-input  text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
               
               >
                {Currentitem?.project?.projectSatatus }
               </p>
             
              </div>
              <div className="mb-6 flex flex-col  gap-2">
                <span
                  htmlFor="name"
                  className="w-full text-lg font-medium text-gray-700 dark:text-white"
                >
            العملة
                </span>
                <p className=" dark:border-form-strokedark dark:bg-form-input  text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
               
               >
                   {Currentitem?.project?.pymentType}
               </p>
             
              </div>


              <div className="mb-6 flex flex-col  gap-2">
                <span
                  htmlFor="name"
                  className="w-full text-lg font-medium text-gray-700 dark:text-white"
                >
            سعر العقار الإجمالى

                </span>
                <p className=" dark:border-form-strokedark dark:bg-form-input  text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
               
               >
                   {Currentitem?.project?.estatePrice}
               </p>
             
              </div>
              <div className="mb-6 flex flex-col  gap-2">
                <span
                  htmlFor="name"
                  className="w-full text-lg font-medium text-gray-700 dark:text-white"
                >
            سعر المتر
                </span>
                <p className=" dark:border-form-strokedark dark:bg-form-input  text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
               
               >
                   {Currentitem?.project?.materPriec}
               </p>
             
              </div>
              <div className="mb-6 flex flex-col  gap-2">
                <span
                  htmlFor="name"
                  className="w-full text-lg font-medium text-gray-700 dark:text-white"
                >
            هل متاح التقسيط
                </span>
                <p className=" dark:border-form-strokedark dark:bg-form-input  text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
               
               >
                   {Currentitem?.project?.installments}
               </p>
             
              </div>
              {
                Currentitem?.project?.installments === "نعم" && (
                  <div className="mb-6 flex flex-col  gap-2">
                  <span
                    htmlFor="name"
                    className="w-full text-lg font-medium text-gray-700 dark:text-white"
                  >
                  الدفعة الأولى*
                  </span>
                  <p className=" dark:border-form-strokedark dark:bg-form-input  text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
                 
                 >
                     {Currentitem?.project?.installmentsFirstPyment}
                 </p>
               
                </div>
                
                )
              }
           
             
              </>
            ) :     <div className="mb-6 flex flex-col  gap-2">
            <span
              htmlFor="name"
              className="w-full text-lg font-medium text-gray-700 dark:text-white"
            >
            المشروع
            </span>
            <p className=" dark:border-form-strokedark dark:bg-form-input  text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
           
           >
                 {Currentitem?.Privetproject?.projectName}
           </p>
         
          </div>
           }
        

     
           <div className="mb-6 flex flex-col  gap-2">
             <span
               htmlFor="name"
               className="w-full text-lg font-medium text-gray-700 dark:text-white"
             >
         متطلبات المهمة
             </span>
             <p className=" dark:border-form-strokedark dark:bg-form-input  text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
            
            >
                {Currentitem?.projectDetails} 
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
                {Currentitem?.notes} 
            </p>
          
           </div>
 </div>
 
 <h2 className='mb-10 mt-5 text-bold text-3xl'> متطلبات المهمة</h2>
 <div className='w-full h-full grid grid-cols-1 gap-2 xl:grid-cols-2'>
    {
        Currentitem?.requirements?.map((item) => {
            return  <div key={item?._id} className='w-full p-5 flex gap-4 h-full shadow-md'>
            {
                item?.complated ? <FaCheckCircle className="text-green-500" /> : ""
            }
           <span>
            {item?.type}
           </span>
        </div>
        })
    }
    
 </div>

 <h2 className='mb-10 mt-5 text-bold text-3xl'>مرفقات المشروع</h2>
 <div>
    {
        Currentitem?.missionType === "مشروع عام"  ?
         <>
            <div className='w-full h-full grid grid-cols-1 gap-2 xl:grid-cols-2'>
      {
        Currentitem?.project?.imagesURLs?.map((item) => {
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
     <div className='mt-12 mb-5 w-full h-full grid grid-cols-1 gap-2 xl:grid-cols-2'>
      {
        Currentitem?.project?.docsURLs?.map((item) => {
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
        
        </> : <>
            <div className='w-full h-full grid grid-cols-1 gap-2 xl:grid-cols-2'>
      {
        Currentitem?.Privetproject?.imagesURLs?.map((item) => {
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
     <div className='mt-12 mb-5 w-full h-full grid grid-cols-1 gap-2 xl:grid-cols-2'>
      {
        Currentitem?.Privetproject?.docsURLs?.map((item) => {
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
        
        </>
        
       
    }
 </div>
 
 <h2  className='mt-5 text-bold text-3xl'>فريق العمل</h2>
 <div className=' mt-10 w-full h-full grid grid-cols-2 gap-3 xl:grid-cols-3	'>
    
    {
        Team?.map((item) =>{
            return  <div key={item?._id} className='w-full h-full flex flex-col items-center justify-center'>
            <img src={item?.imageURL} style={{borderRadius:"100%"}} alt="user-image" className='w-[150px] h-[150px] ' />
            <span className='mt-4'>{item?.name}</span>
        </div>
        })
    }
   
 </div>
 <PopupCheckdelete navigatepage='/Taskes' deleteKey="missions" titale="المهمة" id={id} />

    <span>
        إجراء
       </span>
       <div  className='flex gap-5 m-5'>
              
        {
          isAdmin || CanEdit ?    <Link to={`/edit-Taskes/${id}`} className='w-20 p-2 bg-main text-white rounded-md text-center'>تعديل</Link>
          : null
        }
         <Link to="/Taskes"  className='w-20 p-2 text-center bg-main text-white rounded-md'>
                         عوده
                         </Link>
    {
      isAdmin || CanDelte ? 
      <button onClick={() => setModuleDelete(true)} className='w-20 p-2 bg-main text-white rounded-md'>حذف</button>
      : null
    }
    
       </div>
 </div>


  )
}

export default TaskOverview