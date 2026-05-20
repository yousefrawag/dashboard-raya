import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { FaRegPenToSquare } from "react-icons/fa6";
import { FiPlus } from "react-icons/fi";
import { useState } from 'react';
import vactor from "../../../images/icon/vactor.svg"
import vactor2 from "../../../images/icon/Group.svg"
import UpoladFiles from "../../../hooks/UpoladFiles"
import SelectoptionHook from '../../../hooks/SelectoptionHook';
import useQueryadditeam from '../../../services/Queryadditeam';
import Loader from '../../common/Loader';
import toast from 'react-hot-toast';
import useQuerygetiteams from '../../../services/Querygetiteams';
import StatusFilterTabs from '../../common/StatusFilterTabs';
import { current } from '@reduxjs/toolkit';
import AddProperty from './AddProperty';
const AddprojectForm = () => {
  const {addIteam , isLoading} = useQueryadditeam("projects" , "projects")
  const { data:regionData } = useQuerygetiteams("region", "region");
  const { data:projectStatuts } = useQuerygetiteams("projectStatuts", "projectStatuts");
  const { data:locations } = useQuerygetiteams("location", "location");
  const { data:Currency } = useQuerygetiteams("currency", "currency");
  const { data:FirsPaymentData } = useQuerygetiteams("firstpayment", "firstpayment");
  const { data:MonthlyPaymentData } = useQuerygetiteams("monthPayment", "monthPayment");
  const { data:FloorNumbertData } = useQuerygetiteams("FloorNumber", "FloorNumber");
  const statusConfig = {
 
    info: {
      label: "بيانات المشروع" ,
      className: "text-yellow-600 hover:text-yellow-700",
      icon: "clock"
    },
    properties: {
      label: "إضافه شقة" ,
      className: "text-green-600 hover:text-green-700",
      icon: "check-circle"
    },

 
 
 

  }; 
  const [CurrenTap , setCurrentTap] = useState("info")
  const { data:Area } = useQuerygetiteams("arae", "arae");
  const [relatedTypes , setRelatedType] = useState([])
  const [images_video , setimages_video] = useState([])
  const [projectCheck, setProjectCheck] = useState(false);
  const [projectData , setprojectData] = useState({
    projectOwner:"" ,
    projectOwnerPhone:"" ,
    governoate:"" ,
    Barkaaraemater:"" ,
    projectName:"" ,
    estateType:"" ,
    detailedAddress:"" ,
    projectDetails:"" ,
    projectads:"" ,
    projectSatatus:"" ,
    pymentType:"" ,
    estatePrice:"" ,
    materPriec:"" ,
    installmentsFirstPyment:"" ,
    InstallmentPeriod:"" ,
    installmentsFirstPermonth:"" ,
    clientType:"" ,
    areaMatter:"" ,
    typeOfSpaceoutside:"" ,
    spaceOuteside:"" ,
    city:"" ,
    relatedtype:"" ,
    availableFloors:[] ,
    countOfperiod:"" ,
    installmentPeriod:""

  })
  const [relatedRegions , setRelatedRegion] = useState([])
  
  const [docs , setDocs] = useState([])
  const [viewmenu , setViewmenu] = useState(false)
  const cashTypes = ["نعم" , "لا"]
 const [chasSelectedtype , setCahselectedType] = useState("")
const [properties, setProperties] = useState([]);
const [propertyForm, setPropertyForm] = useState({
  unitName: "",
  floor: "",
  rooms: "",
  bathrooms: "",
  area: "",
  price: "",
  downPayment: "",
  monthlyInstallment: "",
  propertyNote:""
});


  const handelInputschage = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setprojectData((prev) => ({ ...prev, [name]: value }));
    if(name === "governoate"){
      const CurrentRegion = locations?.data?.data?.find((item) => item.name === value)
      if(CurrentRegion){
setRelatedRegion(CurrentRegion?.relatedRegions)
      } else{
        setRelatedRegion([])
      }
      
      
    }
        if(name === "estateType"){
      const CurrentRegion = regionData?.data?.data?.find((item) => item.name === value)
      if(CurrentRegion){
setRelatedType(CurrentRegion?.relatedRegions)
      } else{
        setRelatedType([])
      } }
  };
  const finishing_c = ["بيع" , "شراء" ,"تبديل"  , "ضمان" ,   "إستثمار" ]
  const [opeartionType , setOpeartiontype] = useState("")

  const navigate = useNavigate()
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setimages_video((prevFiles) => [...prevFiles, ...selectedFiles]);
    e.target.value = "";
  };
  const handelDoc = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setDocs((prevFiles) => [...prevFiles, ...selectedFiles]);
    e.target.value = "";
  };
const toggleFloor = (floor) => {
  setprojectData(prev => ({
    ...prev,
    availableFloors: prev.availableFloors.includes(floor)
      ? prev.availableFloors.filter(f => f !== floor)
      : [...prev.availableFloors, floor],
  }));
};

const removeFloor = (floor) => {
  setprojectData(prev => ({
    ...prev,
    availableFloors: prev.availableFloors.filter(f => f !== floor),
  }));
};

const addProperty = () => {
  if (!propertyForm.unitName || !propertyForm.price) {
    return toast.error("يجب إدخال بيانات الشقة");
  }

  setProperties((prev) => [...prev, propertyForm]);

  setPropertyForm({
    unitName: "",
    floor: "",
    rooms: "",
    bathrooms: "",
    area: "",
    price: "",
    downPayment: "",
    monthlyInstallment: "",
  });

  toast.success("تم إضافة الشقة");
};
const removeProperty = (index) => {
  setProperties((prev) => prev.filter((_, i) => i !== index));
};
const handelPropertyForm = (e) => {
  const { name, value } = e.target;
  setPropertyForm((prev) => ({
    ...prev,
    [name]: value,
  }));
};
  const handelSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();

  // ✅ ضيف كل projectData
  Object.entries(projectData).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item) => formData.append(`${key}[]`, item));
    } else {
      formData.append(key, value);
    }
  });
    formData.set("operationType" , opeartionType)
    formData.set("installments" , chasSelectedtype)
    projectData.installments = chasSelectedtype
 projectData.availableFloors.forEach((floor) => {
  formData.append("availableFloors[]", floor);
});
 formData.append("properties", JSON.stringify(properties));


    const data = Object.fromEntries(formData);
        docs.forEach((item) => {
          formData.append("files" , item)
        })
        images_video.forEach((item) => {
          formData.append("files" , item)
        })

if(!projectData.projectName){
  return toast.error("يجب إدخال اسم المشروع")
}


if(!projectData.governoate){
  return toast.error("يجب إدخال  المنطقة")
}
if(!projectData.estateType){
  return toast.error("يجب إدخال  نوع العقار")
}
if(!projectData.projectSatatus){
  return toast.error("يجب إدخال حالة المشروع")
}

if(!projectData.pymentType){
  return toast.error("يجب إدخال  العملة")
}
if(!projectData.estatePrice){
  return toast.error("يجب إدخال  سعر العقار الاجمالى")
}
if(!projectData.installments){
  return toast.error("يجب إدخال  حالة التقسيط")
}

if(chasSelectedtype === "نعم"){ 
  if(!projectData.installmentPeriod){
  return toast.error("يجب إدخال   مده التقسيط")
  }
    if(!projectData.countOfperiod){
  return toast.error("يجب إدخال  مده التقسيط سواء على كام سنه او شهر")
  }
      if(!projectData.installmentsFirstPyment){
  return toast.error("يجب إدخال  الدفعة الاولى")
  }
        if(!projectData.installmentsFirstPermonth){
  return toast.error("يجب إدخال  الدفعة الشهرية")
  }


}
         if(!projectData.availableFloors.length){
  return toast.error("يجب إدخال   عدد الطوابق")
  }
           if(!projectData.areaMatter){
  return toast.error("يجب إدخال  المساحه متر")
  }


    try {
    
        
        addIteam(formData , {
            onSuccess:() =>{
             
                e.target.reset()
                setDocs([])
                setimages_video([])
                toast.success("تم إضافه مشروع جديد")
                navigate("/projects-main")
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
    <form onSubmit={handelSubmit} className='w-full mt-[-20px] h-full bg-white rounded-[10px] dark:bg-form-input' >
            <StatusFilterTabs  statusConfig={statusConfig} onStatusChange={(key) => setCurrentTap(key)} selectedStatus={CurrenTap}/>
{
  CurrenTap === "info" &&  <div className='main-section w-full max-h-[400px] min-h-[100px] p-4 overflow-auto	'>
            <div className="mb-6 flex flex-col  gap-2">
                        <label
                            htmlFor="projectOwner"
                            className="w-full text-lg font-medium text-black dark:text-white"
                        >
                            مالك العقار
                        </label>
                        <input
                            type="text"
                            id="projectOwner"
                            name="projectOwner"
                            onChange={handelInputschage}
                            value={projectData.projectOwner}
                            className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
                        />
                    
            </div>
         
            <div className="mb-6 flex flex-col  gap-2">
                        <label
                            htmlFor="projectOwnerPhone"
                            className="w-full text-lg font-medium text-black dark:text-white"
                        >
                           رقم جوال مالك المشروع
                        </label>
                        <input
                          onChange={handelInputschage}
                            type="text"
                            id="projectOwnerPhone"
                            name="projectOwnerPhone"
                            value={projectData.projectOwnerPhone}
                            className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
                        />
                    
            </div>

             
                <div className="mb-6 flex flex-col  gap-2">
                        <label
                            htmlFor="governoate"
                            className="w-full text-lg font-medium text-black dark:text-white"
                        >
                          المنطقة
                        </label>
                        <select required   onChange={handelInputschage}  value={projectData.governoate} name="governoate" defaultValue="القدس"  className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"                        >
                        <option value="">
                                أختر المنطقة
                            </option>
                        {
                          locations?.data?.data?.map((item) => {
                            return    <option key={item?._id} value={item?.name}>
                                  {
                                    item?.name
                                  }
                        </option>
                          })
                        }
                         
                        </select>
                     
                    
                </div>


  <div className="mb-6 flex flex-col gap-2">
  <label htmlFor="city" className="w-full text-lg font-medium text-black dark:text-white">
    الموقع*
  </label>
  <select
    name="city"
    id="city"
    required
    value={projectData.city}
    onChange={handelInputschage}
    className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
  >
    <option>قم بالإختيار</option>
    {relatedRegions?.map((region, index) => (
      <option key={index} value={region}>
        {region}
      </option>
    ))}
  </select>
</div>

                <div className="mb-6 flex flex-col  gap-2">
                        <label
                            htmlFor="projectName"
                            className="w-full text-lg font-medium text-black dark:text-white"
                        >
                        إسم المشروع
                        </label>
                        <input
                          onChange={handelInputschage}
                            type="text"
                            id="projectName"
                            name="projectName"
                            value={projectData.projectName}
                            required
                            className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
                        />
                    
            </div>

       
       <div className="mb-6 flex flex-col  gap-2">
                        <label
                            htmlFor="detailedAddress"
                            className="w-full text-lg font-medium text-black dark:text-white"
                        >
                       العنوان بالتفصيل
                        </label>
                        <input
                            type="text"
                            id="detailedAddress"
                             name="detailedAddress"
                              value={projectData.detailedAddress}
                                onChange={handelInputschage}
                                required
                            className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
                        />
                    
            </div>



            <div className="mb-6 flex flex-col  gap-2">
                        <label
                            htmlFor="estateType"
                            className="w-full text-lg font-medium text-black dark:text-white"
                        >
                          نوع العقار
                        </label>
                        <select   onChange={handelInputschage} value={projectData.estateType} name="estateType"  className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"                        >
                        <option value="">
                                أختر النوع
                            </option>
                            {regionData?.data?.data?.map((item) => {
                        return (
                          <option key={item._id} value={item.name}>
                            {item.name}
                          </option>
                        );
                          })}
                         
                        </select>
                     
                    
                </div> 
                 <div className="mb-6 flex flex-col gap-2">
  <label htmlFor="relatedtype" className="w-full text-lg font-medium text-black dark:text-white">
    التابع*
  </label>
  <select
    name="relatedtype"
    id="relatedtype"
    required
    value={projectData.relatedtype}
    onChange={handelInputschage}
    className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
  >
    <option>قم بالإختيار</option>
    {relatedTypes?.map((region, index) => (
      <option key={index} value={region}>
        {region}
      </option>
    ))}
  </select>
</div>
       
            <div className="mb-6 flex flex-col  gap-2">
                        <label
                            htmlFor="projectDetails"
                            className="w-full text-lg font-medium text-black dark:text-white"
                        >
                           تفاصيل العقار
                        </label>
                        <textarea   onChange={handelInputschage} value={projectData.projectDetails}  name="projectDetails" className="focus:border-primary min-h-[150px] max-h-[200px]  active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500" >

                        </textarea>
                    
                </div>
                <div className="mb-6 flex flex-col  gap-2">
                        <label
                            htmlFor="projectads"
                            className="w-full text-lg font-medium text-black dark:text-white"
                        >
                         نص الاعلان 
                        </label>
                        <textarea   onChange={handelInputschage} value={projectData.projectads} name='projectads'  className="focus:border-primary min-h-[150px] max-h-[200px]  active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500" >

                        </textarea>
                    
                </div>
                <span>  وضع العقار</span>
                <div className='flex gap-3 '>
                {finishing_c.map((item, index) => {
                  return (
                    <button
                      onClick={() => setOpeartiontype(item)}
                      className={opeartionType === item ? "p-3  px-7 rounded-[10px] text-white   bg-main" : "p-3 px-7 rounded-[10px] dark:text-white  border-[1px] border-[#eee]"}
                      type="button"
                      key={index}
                    >
                      {item}
                    </button>
                  );
                })}
                </div>
                <div className="mb-6 flex flex-col  gap-2">
                        <label
                            htmlFor="projectSatatus"
                            className="w-full text-lg font-medium text-black dark:text-white"
                        >
                         حالة المشروع
                        </label>
                        <select   onChange={handelInputschage} value={projectData.projectSatatus} name="projectSatatus"  className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"                        >
                        <option value="">
                                أختر النوع
                            </option>
                            {projectStatuts?.data?.data?.map((item) => {
                            return (
                              <option key={item._id} value={item.name}>
                                {item.name}
                              </option>
                            );
                          })}
                         
                        </select>
                     
                    
                </div> 
                <div className="mb-6 flex flex-col  gap-2">
                        <label
                            htmlFor="pymentType"
                            className="w-full text-lg font-medium text-black dark:text-white"
                        >
                       العملة
                        </label>
                        <select   onChange={handelInputschage} value={projectData.pymentType} name="pymentType"  className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"                        >
                        <option value="">
                                أختر النوع
                            </option>
                   {
                    Currency?.data?.data?.map((item) => {
                      return       <option key={item?._id} value={item?.name}>
                      {
                        item?.name
                      }
                  </option>
                    })
                   }
                         
                        </select>
                     
                    
                </div> 
                <div className="mb-6 flex flex-col  gap-2">
                        <label
                            htmlFor="estatePrice"
                            className="w-full text-lg font-medium text-black dark:text-white"
                        >
                    سعر العقار الإجمالى
                        </label>
                        <input
                            type="number"
                            id="estatePrice"
                            name="estatePrice"
                            value={projectData.estatePrice}
                              onChange={handelInputschage}
                            className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
                        />
                    
            </div>
            <div className="mb-6 flex flex-col  gap-2">
                        <label
                            htmlFor="materPriec"
                            className="w-full text-lg font-medium text-black dark:text-white"
                        >
                    سعر  المتر
                        </label>
                        <input
                            type="text"
                            id="materPriec"
                            name="materPriec"
                            value={projectData.materPriec}
                              onChange={handelInputschage}
                            className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
                        />
                    
            </div>
                <span  className='mb-5 text-lg'> حاله التقسيط</span>
            <div className='flex gap-3'>
                  {
                    cashTypes?.map((item) => {
                      return (
                        <button
                        onClick={() => setCahselectedType(item)}
                        className={chasSelectedtype === item ? "p-3  px-7 rounded-[10px] text-white   bg-main" : "p-3 px-7 rounded-[10px] dark:text-white  border-[1px] border-[#eee]"}
                        type="button"
                        key={item}
                      >
                        {item}
                      </button>
                      )
                    })
                  }
            </div>
        
            <div>
              {
                chasSelectedtype === "نعم"  ?
                <div>
         {/* الدفعة الأولى */}
            <div className="mb-6 flex flex-col  gap-2">
                        <label
                            htmlFor="installmentPeriod"
                            className="w-full text-lg font-medium text-black dark:text-white"
                        >
                        مده التقسيط
                        </label>
                        <select   onChange={handelInputschage} value={projectData.installmentPeriod} name="installmentPeriod"  className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"                        >
                        <option value="">
                                أختر النوع
                            </option>
                              <option value="سنوى">
                                سنوى
                            </option>
                                  <option value="شهرى">
                                شهرى
                            </option>
                     
                         
                        </select>
                     
                    
                </div> 
                
        {
          projectData?.installmentPeriod &&
           <div className="mb-6 flex flex-col  gap-2">
                  <label
                      htmlFor="countOfperiod"
                      className="w-full text-lg font-medium text-black dark:text-white"
                  >
      تقسيط على كام {projectData?.installmentPeriod} *
                  </label>
                  <input
                      type="number"
                      id="countOfperiod"
                      name="countOfperiod"
                      value={projectData.countOfperiod}
                        onChange={handelInputschage}
                      className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
                  />
              
                </div> 
        }       
<div className="mb-6 flex flex-col gap-2">
  <label
    htmlFor="installmentsFirstPyment"
    className="w-full text-lg font-medium text-black dark:text-white"
  >
    الدفعة الأولى*
  </label>
  <select
    id="installmentsFirstPyment"
    name="installmentsFirstPyment"
    value={projectData.installmentsFirstPyment}
    onChange={handelInputschage}
    className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
  >
    <option value="">اختر الدفعة الأولى</option>
 {
  FirsPaymentData?.data?.data?.map((item) => {
    return <option value={item?.name} key={item?._id}>{item?.name.toLocaleString('en-US')}</option>
  })
 }
  </select>
</div>

{/* مدة التقسيط */}


{/* الدفعة الشهرية */}
<div className="mb-6 flex flex-col gap-2">
  <label
    htmlFor="installmentsFirstPermonth"
    className="w-full text-lg font-medium text-black dark:text-white"
  >
    الدفعة الشهرية*
  </label>
  <select
    id="installmentsFirstPermonth"
    name="installmentsFirstPermonth"
    value={projectData.installmentsFirstPermonth}
    onChange={handelInputschage}
    className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
  >
    <option value="">اختر الدفعة الشهرية</option>
 {
  MonthlyPaymentData?.data?.data?.map((item) => {
    return <option value={item?.name} key={item?._id}>{item?.name.toLocaleString('en-US')}</option>
  })
 }
  </select>
</div>

          
                </div>
    : null

              }

<div className="mb-6 flex flex-col gap-2">
  <label className="w-full text-lg font-medium text-black dark:text-white">
    عدد الطوابق *
  </label>

  <div className="relative">
    <button
      type="button"
      onClick={() => setProjectCheck(!projectCheck)}
      className="w-full text-right p-3 border border-gray-300 rounded-md bg-white flex justify-between items-center"
    >
      <span className="text-gray-500">
        {projectData.availableFloors.length > 0
          ? `تم اختيار ${projectData.availableFloors.length} طابق`
          : "قم بالإختيار"}
      </span>

      <svg
        className={`w-5 h-5 text-gray-400 transition-transform ${
          projectCheck ? "rotate-180" : ""
        }`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    {projectCheck && (
      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
        {FloorNumbertData?.data?.data?.map((floor, index) => {
         
          const isSelected = projectData.availableFloors.includes(floor?.name);

          return (
            <div
              key={floor?._id}
              onClick={() => toggleFloor(floor?.name)}
              className={`flex items-center justify-between px-4 py-3 cursor-pointer ${
                isSelected
                  ? "bg-blue-50 text-blue-700"
                  : "hover:bg-gray-50 text-gray-700"
              }`}
            >
              <span className="text-sm font-medium">
                الطابق {floor?.name}
              </span>

              {isSelected && (
                <svg
                  className="w-5 h-5 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
          );
        })}
      </div>
    )}
  </div>

  {projectData.availableFloors.length > 0 && (
    <div className="mt-3 flex flex-wrap gap-2">
      {projectData.availableFloors.map((floor) => (
        <span
          key={floor}
          className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
        >
          الطابق {floor}
          <button
            type="button"
            onClick={() => removeFloor(floor)}
            className="text-blue-600 hover:text-blue-800 text-lg leading-none"
          >
            ×
          </button>
        </span>
      ))}
    </div>
  )}
</div>


            <div className="mb-6 flex flex-col gap-2">
  <label
    htmlFor="areaMatter"
    className="w-full text-lg font-medium text-black dark:text-white"
  >
    المساحة / متر*
  </label>
  <select
    id="areaMatter"
    name="areaMatter"
    value={projectData.areaMatter}
    onChange={handelInputschage}
    className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
  >
   

               <option value="">
                                أختر المساحه
                            </option>
                            {Area?.data?.data?.map((item) => {
                        return (
                          <option key={item._id} value={item.name}>
                            {item.name + "م²"}
                          </option>
                        );
                          })}
  </select>
</div>

<div className="mb-6 flex flex-col gap-2">
  <label
    htmlFor="spaceOuteside"
    className="w-full text-lg font-medium text-black dark:text-white"
  >
    المساحة الخارجية للعقار
  </label>
  <select
    id="spaceOuteside"
    name="spaceOuteside"
    value={projectData.spaceOuteside}
    onChange={handelInputschage}
    className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
  >
        <option value="">
                                أختر المساحه
                            </option>
                            {Area?.data?.data?.map((item) => {
                        return (
                          <option key={item._id} value={item.name}>
                            {item.name + "م²"}
                          </option>
                        );
                          })}
  </select>
</div>

            <div className="mb-6 flex flex-col gap-2">
  <label
    htmlFor="Barkaaraemater"
    className="w-full text-lg font-medium text-black dark:text-white"
  >
      مساحه البركه*
  </label>
  <select
    id="Barkaaraemater"
    name="Barkaaraemater"
    value={projectData.Barkaaraemater}
    onChange={handelInputschage}
    className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
  >
   

               <option value="">
                                أختر المساحه
                            </option>
                            {Area?.data?.data?.map((item) => {
                        return (
                          <option key={item._id} value={item.name}>
                            {item.name + "م²"}
                          </option>
                        );
                          })}
  </select>
</div>

                <div className="mb-6 flex flex-col  gap-2">
                  <label
                      htmlFor="typeOfSpaceoutside"
                      className="w-full text-lg font-medium text-black dark:text-white"
                  >
     نوع المساحه الخارجيه للعقار*
                  </label>
                  <input
                      type="text"
                      id="typeOfSpaceoutside"
                      name="typeOfSpaceoutside"
                      value={projectData.typeOfSpaceoutside}
                        onChange={handelInputschage}
                      className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
                  />
              
                </div> 
                <div className="mb-6 flex flex-col  gap-2">
                  <label
                      htmlFor="imageLink"
                      className="w-full text-lg font-medium text-black dark:text-white"
                  >
     لينك الصوره*
                  </label>
                  <input
                      type="text"
                      id="imageLink"
                      name="imageLink"
            
                      className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
                  />
              
                </div> 
                <div className="mb-6 flex flex-col  gap-2 mt-4">
                  <label
                      htmlFor="videoLink"
                      className="w-full text-lg font-medium text-black dark:text-white"
                  >
    لينك الفيديو*
                  </label>
                  <input
                      type="text"
                      id="videoLink"
                      name="videoLink"
            
                      className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
                  />
              
                </div> 
            </div>
                <div className="mb-6 flex flex-col  gap-2">
                        <label
                            htmlFor="notes"
                            className="w-full text-lg font-medium text-black dark:text-white"
                        >
                           ملاحظات المشروع
                        </label>
                        <textarea name='notes'  className="focus:border-primary min-h-[150px] max-h-[200px] active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500" >

                        </textarea>
                    
                </div>
        <div className="add_files p-4">
      <div className="relative inline-block text-left">
        <button
          className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-white bg-main rounded-md "
          type="button"
          id="menu-button"
          aria-expanded="true"
          aria-haspopup="true"
          onClick={() => setViewmenu(!viewmenu)}
        >
          <div className="flex items-center gap-2">
            <FiPlus /> إضافة مرفقات
          </div>
        </button>

        {/* Dropdown menu */}
        {
          viewmenu &&  <div
          className="absolute right-0 z-10 w-56 mt-2 bg-white border border-gray-200 rounded-md shadow-lg focus:outline-none"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
        >
          <label
            htmlFor="files"
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
            role="menuitem"
          >
            <img src={vactor} alt="Vector" />
            اختر من الملفات
          </label>
          <input
            type="file"
            multiple
            className="hidden"
            name="files"
            id="files"
            onChange={handelDoc}
             accept="
    application/pdf,
    application/msword,
    application/vnd.openxmlformats-officedocument.wordprocessingml.document,
    application/zip
    application/x-rar-compressed 
    application/octet-stream

  "
          />
          <label
            htmlFor="image-video"
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
            role="menuitem"
          >
            <img src={vactor2} alt="Group" />
            اختر صورة او فيديو
          </label>
          <input
            type="file"
            name="files"
            onChange={handleFileChange}
            accept="image/png, image/jpeg, video/mp4"
            multiple
            className="hidden"
            id="image-video"
          />
        </div>
        }
      
      </div>
      {images_video.length > 0 || docs.length > 0 ? (
                <UpoladFiles
                  images={images_video}
                  setImages={setimages_video}
                  docs={docs}
                  setDocs={setDocs}
                />
              ) : null}
              <br />
        </div>
   </div>
}
   {
    CurrenTap === "properties" && <AddProperty propertyForm={propertyForm} removeProperty={removeProperty} addProperty={addProperty}  properties={properties} handelPropertyForm={handelPropertyForm}/>
   }
  
  

    <div className="add_return flex justify-between items-center mt-4 shadow-lg p-4 bg-white dark:bg-form-input">
    <div className="add_btn">
        <button type="submit"  className={` py-2 px-6 rounded-md bg-main text-white hover:bg-transparent hover:border hover:border-blue-600 hover:text-blue-600`}>
         إضافة
        </button>
      </div>
      <div className="return_btn">
        <NavLink to="/projects-main" className="bg-gray-300 text-gray-700 py-2 px-6 rounded-md">عوده</NavLink>
      </div>
    
    </div>

  </form>
  )
}

export default AddprojectForm