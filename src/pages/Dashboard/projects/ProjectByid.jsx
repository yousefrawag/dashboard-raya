import React from 'react'
import image1 from "../../../images/brand/brand-01.svg"
import image2 from "../../../images/brand/brand-02.svg"
import image3 from "../../../images/brand/brand-03.svg"
import { FaFilePdf } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import { HiMiniViewfinderCircle } from "react-icons/hi2";
import HeadPagestyle from '../../../components/common/HeadPagestyle';

import Loader from '../../../components/common/Loader';
import useQuerygetSpacficIteam from '../../../services/QuerygetSpacficIteam';
import { useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns';
import useQueryDelete from '../../../services/useQueryDelete';
import useGetUserAuthentications from '../../../middleware/GetuserAuthencations';
import PopupCheckdelete from '../../../components/common/popupmdules/PopupCheckdelete';
import { useDashboardContext } from '../../../context/DashboardProviedr';
const ProjectByid = () => {
  const {id} =  useParams()
  const {data , isLoading} = useQuerygetSpacficIteam("projects" , "projects" , id)
  const { CanAdd, CanDelte, CanEdit, CanView, isAdmin } = useGetUserAuthentications("Projects");
  const {  setModuleDelete } =  useDashboardContext()
  const navigate = useNavigate()
  const Currentitem = data?.data



  if(isLoading){
    return <Loader />
  }
  return (
    <div className='w-full h-full'>
        <HeadPagestyle pageName="بيانات الخدمة" to="/projects-main" title="عوده" />

          <span>
            إجراء
           </span>
            
           <div  className='flex gap-5 m-5'>
       
            {
              isAdmin || CanEdit ?    <Link to={`/edtit-project/${id}`} className='w-20 p-2 bg-main text-white rounded-md text-center'>تعديل</Link>
              : null
            }
                <Link to="/projects-main"  className='w-20 p-2 text-center bg-main text-white rounded-md'>
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
                        إسم  المشروع
                 </span>
                 <p className=" dark:border-form-strokedark dark:bg-form-input  text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
                
                >
                  {Currentitem?.projectName}
                </p>
              
               </div>
            
              
            
               <div className="mb-6 flex flex-col  gap-2">
                 <span
                   htmlFor="name"
                   className="w-full text-lg font-medium text-gray-700 dark:text-white"
                 >
                  حاله  المشروع
                 </span>
                 <p className=" dark:border-form-strokedark dark:bg-form-input  text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
                
                >
                 {Currentitem?.projectSatatus}
                </p>
              
               </div>
    
   
             
               <div className="mb-6 flex flex-col  gap-2">
                 <span
                   htmlFor="name"
                   className="w-full text-lg font-medium text-gray-700 dark:text-white"
                 >
                 مالك العقار   
                 </span>
                 <p className=" dark:border-form-strokedark dark:bg-form-input  text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
                
                >
                      {Currentitem?.projectOwner}
                </p>
              
               </div>
               <div className="mb-6 flex flex-col  gap-2">
                 <span
                   htmlFor="name"
                   className="w-full text-lg font-medium text-gray-700 dark:text-white"
                 >
              جوال مالك العقار
                 </span>
                 <p className=" dark:border-form-strokedark dark:bg-form-input  text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
                
                >
                      {Currentitem?.projectOwnerPhone || ""}
                </p>
              
               </div>
               <div className="mb-6 flex flex-col  gap-2">
                 <span
                   htmlFor="name"
                   className="w-full text-lg font-medium text-gray-700 dark:text-white"
                 >
              مضاف من قبل
                 </span>
                 <p className=" dark:border-form-strokedark dark:bg-form-input  text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
                
                >
                           {Currentitem?.addedBy?.fullName}
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
                           {Currentitem?.estateType}
                </p>
              
               </div> 
                  <div className="mb-6 flex flex-col  gap-2">
                 <span
                   htmlFor="name"
                   className="w-full text-lg font-medium text-gray-700 dark:text-white"
                 >
            التابع
                 </span>
                 <p className=" dark:border-form-strokedark dark:bg-form-input  text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
                
                >
                           {Currentitem?.relatedtype}
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
                 {Currentitem?.governoate}
                </p>
              
               </div>
                 <div className="mb-6 flex flex-col  gap-2">
                 <span
                   htmlFor="name"
                   className="w-full text-lg font-medium text-gray-700 dark:text-white"
                 >
            الموقع
                 </span>
                 <p className=" dark:border-form-strokedark dark:bg-form-input  text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
                
                >
                 {Currentitem?.city}
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
                    {Currentitem?.detailedAddress}
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
                    {Currentitem?.projectDetails}
                </p>
              
               </div>
               <div className="mb-6 flex flex-col  gap-2">
                 <span
                   htmlFor="name"
                   className="w-full text-lg font-medium text-gray-700 dark:text-white"
                 >
            نص الإعلان
                 </span>
                 <p className=" dark:border-form-strokedark dark:bg-form-input  text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
                
                >
                    {Currentitem?.projectads}
                </p>
              
               </div>
               <div className="mb-6 flex flex-col  gap-2">
                 <span
                   htmlFor="name"
                   className="w-full text-lg font-medium text-gray-700 dark:text-white"
                 >
            نوع العملية
                 </span>
                 <p className=" dark:border-form-strokedark dark:bg-form-input  text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
                
                >
                 {Currentitem?.operationType}
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
                 {Currentitem?.projectSatatus}
                </p>
              
               </div>
               <div className="mb-6 flex flex-col  gap-2">
                 <span
                   htmlFor="name"
                   className="w-full text-lg font-medium text-gray-700 dark:text-white"
                 >
        نوع العملة
                 </span>
                 <p className=" dark:border-form-strokedark dark:bg-form-input  text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
                
                >
                 {Currentitem?.pymentType}
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
                 {Currentitem?.estatePrice}
                </p>
              
               </div>
               <div className="mb-6 flex flex-col  gap-2">
                 <span
                   htmlFor="name"
                   className="w-full text-lg font-medium text-gray-700 dark:text-white"
                 >
        سعر  المتر
                 </span>
                 <p className=" dark:border-form-strokedark dark:bg-form-input  text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
                
                >
                 {Currentitem?.materPriec}
                </p>
              
               </div>
               <div className="mb-6 flex flex-col  gap-2">
                 <span
                   htmlFor="name"
                   className="w-full text-lg font-medium text-gray-700 dark:text-white"
                 >
      إمكانيه التقسيط
                 </span>
                 <p className=" dark:border-form-strokedark dark:bg-form-input  text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
                
                >
                 {Currentitem?.installments}
                </p>
              
               </div>
               <div className="mb-6 flex flex-col  gap-2">
                 <span
                   htmlFor="name"
                   className="w-full text-lg font-medium text-gray-700 dark:text-white"
                 >
      الدفعة الإولى
                 </span>
                 <p className=" dark:border-form-strokedark dark:bg-form-input  text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
                
                >
                 {Currentitem?.installmentsFirstPyment}
                </p>
              
               </div>
               <div className="mb-6 flex flex-col  gap-2">
                 <span
                   htmlFor="name"
                   className="w-full text-lg font-medium text-gray-700 dark:text-white"
                 >
      مده التقسيط
                 </span>
                 <p className=" dark:border-form-strokedark dark:bg-form-input  text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
                
                >
                 {Currentitem?.InstallmentPeriod}
                </p>
              
               </div>
               <div className="mb-6 flex flex-col  gap-2">
                 <span
                   htmlFor="name"
                   className="w-full text-lg font-medium text-gray-700 dark:text-white"
                 >
   الدفعة الشهرية
                 </span>
                 <p className=" dark:border-form-strokedark dark:bg-form-input  text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
                
                >
                 {Currentitem?.installmentsFirstPermonth}
                </p>
              
               </div>
               <div className="mb-6 flex flex-col  gap-2">
                 <span
                   htmlFor="name"
                   className="w-full text-lg font-medium text-gray-700 dark:text-white"
                 >
    الطوابق المتوفره
                 </span>
                 <p className=" dark:border-form-strokedark dark:bg-form-input  text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
                
                >
                 {Currentitem?.clientType}
                </p>
              
               </div>
               <div className="mb-6 flex flex-col  gap-2">
                 <span
                   htmlFor="name"
                   className="w-full text-lg font-medium text-gray-700 dark:text-white"
                 >
     المساحة متر
                 </span>
                 <p className=" dark:border-form-strokedark dark:bg-form-input  text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
                
                >
                 {Currentitem?.areaMatter}
                </p>
              
               </div>
               <div className="mb-6 flex flex-col  gap-2">
                 <span
                   htmlFor="name"
                   className="w-full text-lg font-medium text-gray-700 dark:text-white"
                 >
    المساحة / الخارجيه للعقار*


                 </span>
                 <p className=" dark:border-form-strokedark dark:bg-form-input  text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
                
                >
                 {Currentitem?.spaceOuteside}
                </p>
              
               </div>
               <div className="mb-6 flex flex-col  gap-2">
                 <span
                   htmlFor="name"
                   className="w-full text-lg font-medium text-gray-700 dark:text-white"
                 >
   نوع المساحة / الخارجية*




                 </span>
                 <p className=" dark:border-form-strokedark dark:bg-form-input  text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
                
                >
                 {Currentitem?.typeOfSpaceoutside}
                </p>
              
               </div>
               <div className="mb-6 flex flex-col  gap-2">
                 <span
                   htmlFor="name"
                   className="w-full text-lg font-medium text-gray-700 dark:text-white"
                 >
 ملاحظات العقار





                 </span>
                 <p className=" dark:border-form-strokedark dark:bg-form-input  text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
                
                >
                 {Currentitem?.projectNotes}
                </p>
              
               </div>
             
     </div>
     <br />
     <h2 className='mb-10 mt-5'>مرفقات المشروع</h2>
     <div className='w-full h-full grid grid-cols-1 gap-2 xl:grid-cols-2'>
      {
        Currentitem?.imagesURLs?.map((item) => {
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
        Currentitem?.docsURLs?.map((item) => {
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
     <PopupCheckdelete value={"archiev"} navigatepage="/projects-main" deleteKey="projects" titale="المشروع" id={id} />

              <span>
            إجراء
           </span>
            
           <div  className='flex gap-5 m-5'>
       
            {
              isAdmin || CanEdit ?    <Link to={`/edtit-project/${id}`} className='w-20 p-2 bg-main text-white rounded-md text-center'>تعديل</Link>
              : null
            }
                <Link to="/projects-main"  className='w-20 p-2 text-center bg-main text-white rounded-md'>
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

export default ProjectByid