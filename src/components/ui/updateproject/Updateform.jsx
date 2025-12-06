import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { FaRegPenToSquare } from 'react-icons/fa6';
import { FiPlus } from 'react-icons/fi';
import { useState } from 'react';
import vactor from '../../../images/icon/vactor.svg';
import vactor2 from '../../../images/icon/Group.svg';
import UpoladFiles from '../../../hooks/UpoladFiles';
import useQuerygetSpacficIteam from '../../../services/QuerygetSpacficIteam';
import SelectoptionHook from '../../../hooks/SelectoptionHook';
import useQueryupdate from '../../../services/useQueryupdate';
import Loader from '../../common/Loader';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import useQuerygetiteams from '../../../services/Querygetiteams';
const Updateform = ({ id }) => {
  const { data, isLoading } = useQuerygetSpacficIteam(
    'projects',
    'projects',
    id,
  );

  const { isLoading: SubmitLoading, updateiteam } = useQueryupdate(
    'projects',
    'projects',
  );
  const { data:locations } = useQuerygetiteams("location", "location");
  const { data:Currencydata } = useQuerygetiteams("currency", "currency");
  const { data: regionData } = useQuerygetiteams('region', 'region');
    const { data:Area } = useQuerygetiteams("arae", "arae");
  
  const { data: projectStatuts } = useQuerygetiteams(
    'projectStatuts',
    'projectStatuts',
  );
  const cashTypes = ['نعم', 'لا'];
  const [chasSelectedtype, setCahselectedType] = useState('');
  const finishing_c = ['بيع', 'شراء', 'تبديل', 'ضمان', 'إستثمار'];
  const [opeartionType, setOpeartiontype] = useState('');
  const [governote, setGovernote] = useState('');
  const [EstateType, setEstateType] = useState('');
  const [projectStauts, setProjectSatuts] = useState('');
  const [Currency , setCurrency] = useState("")
  const CurrentProject = data?.data;
  const navigate = useNavigate();
  const [images_video, setimages_video] = useState([]);
    const [relatedTypes , setRelatedType] = useState([])
  
 const [projectData , setprojectData] = useState({
    projectOwner:"" ,
    projectOwnerPhone:"" ,
    governoate:"" ,
    projectName:"" ,
    estateType:"" ,
    detailedAddress:"" ,
    availableFloors:"",
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
    relatedtype:""

  })
  const [relatedRegions , setRelatedRegion] = useState([])
  const [docs, setDocs] = useState([]);

  const [viewmenu, setViewmenu] = useState(false);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setimages_video((prevFiles) => [...prevFiles, ...selectedFiles]);
    e.target.value = '';
  };
  const handelDoc = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setDocs((prevFiles) => [...prevFiles, ...selectedFiles]);
    e.target.value = '';
  };

  const handelSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const data = Object.fromEntries(formData);
 
    docs.forEach((item) => {
      formData.append('files', item);
    });
    images_video.forEach((item) => {
      formData.append('files', item);
    });
console.log(data);

   
    try {
      updateiteam(
        { data: formData, id },
        {
          onSuccess: () => {
            e.target.reset();
            setDocs([]);
            setimages_video([]);
            toast.success('تم تعديل مشروع بنجاح');
            navigate('/projects-main');
          },
          onError: (error) => {
            if (
              error.response &&
              error.response.data &&
              error.response.data.mesg
            ) {
              toast.error(error.response.data.mesg);
            } else {
              toast.error('An error occurred. Please try again.');
            }
          },
        },
      );
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.mesg);
    }
  };

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
  useEffect(() => {
    if (CurrentProject) {
    setprojectData({
    governoate:CurrentProject?.governoate ,
    projectName:"" ,
    estateType:CurrentProject?.estateType ,
    detailedAddress:"" ,
    projectDetails:"" ,
    projectads:"" ,
    projectSatatus:"" ,
    areaMatter:CurrentProject?.areaMatter,
    spaceOuteside:CurrentProject?.spaceOuteside ,
     installmentsFirstPyment:CurrentProject?.installmentsFirstPyment ,
    InstallmentPeriod:CurrentProject?.InstallmentPeriod ,
    installmentsFirstPermonth:CurrentProject?.installmentsFirstPermonth ,

    city:CurrentProject?.city ,
    relatedtype:CurrentProject?.relatedtype ,
    availableFloors:CurrentProject?.availableFloors
    })
    
      setOpeartiontype(CurrentProject?.operationType);
      
      setProjectSatuts(CurrentProject?.projectSatatus)
      setCurrency(CurrentProject?.pymentType)
      setCahselectedType(CurrentProject?.installments)



    }
  }, [CurrentProject ]);

  useEffect(() => {
    if(!CurrentProject ||  !locations?.data?.data) return ;
          const CurrentRegionsRelated = locations?.data?.data?.find((item) => item.name === CurrentProject?.governoate )
      setRelatedRegion(CurrentRegionsRelated?.relatedRegions)
  } , [CurrentProject , locations])

    useEffect(() => {
    if(!CurrentProject ||  !regionData?.data?.data) return ;
                 const CurrenttypesRelated = regionData?.data?.data?.find((item) => item.name === CurrentProject?.estateType )
      setRelatedType(CurrenttypesRelated?.relatedRegions)
  } , [CurrentProject , regionData])


  if (isLoading || SubmitLoading) {
    return <Loader />;
  }
 
  console.log("current-project" , CurrentProject);
  
  return (
    <form
      onSubmit={handelSubmit}
      className="w-full h-full bg-white rounded-[10px] dark:bg-form-input"
    >
     

      <div className="main-section w-full max-h-[400px] min-h-[100px] p-4 overflow-auto	">
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
            defaultValue={CurrentProject?.projectOwner}
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
            type="text"
            id="projectOwnerPhone"
            name="projectOwnerPhone"
            defaultValue={CurrentProject?.projectOwnerPhone}
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
          <select
            name="governoate"
            value={projectData.governoate}
            onChange={handelInputschage}
            defaultValue="القدس"
            className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
          >
            <option value="">أختر الموقع</option>
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
            type="text"
            id="projectName"
            name="projectName"
            defaultValue={CurrentProject?.projectName}
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
            defaultValue={CurrentProject?.detailedAddress}
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
          <select
            name="estateType"
          onChange={handelInputschage} value={projectData.estateType} 
            className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
          >
            <option value="">أختر النوع</option>
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
          <textarea
            defaultValue={CurrentProject?.projectDetails}
            name="projectDetails"
            className="focus:border-primary min-h-[150px] max-h-[200px]  active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
          ></textarea>
        </div>
        <div className="mb-6 flex flex-col  gap-2">
          <label
            htmlFor="projectads"
            className="w-full text-lg font-medium text-black dark:text-white"
          >
            نص الاعلان
          </label>
          <textarea
            name="projectads"
            defaultValue={CurrentProject?.projectads}
            className="focus:border-primary min-h-[150px] max-h-[200px]  active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
          ></textarea>
        </div>

         <span>  وضع العقار</span>
        <div className="flex gap-3 ">
          {finishing_c.map((item, index) => {
            return (
              <button
                onClick={() => setOpeartiontype(item)}
                className={
                  opeartionType === item
                    ? 'p-3  px-7 rounded-[10px] text-white   bg-main'
                    : 'p-3 px-7 rounded-[10px] dark:text-white  border-[1px] border-[#eee]'
                }
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
          <select
          value={projectStauts}
          onChange={(e) => setProjectSatuts(e.target.value)}
            name="projectSatatus"
            className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
          >
            <option value="">أختر النوع</option>
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
          <select
          value={Currency}
          onChange={(e) => setCurrency(e.target.value)}
            name="pymentType"
            className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
          >
            <option value="">أختر النوع</option>
            {
                    Currencydata?.data?.data?.map((item) => {
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
            type="text"
            id="estatePrice"
            defaultValue={CurrentProject?.estatePrice}
            name="estatePrice"
            className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
          />
        </div>
        <div className="mb-6 flex flex-col  gap-2">
          <label
            htmlFor="materPriec"
            className="w-full text-lg font-medium text-black dark:text-white"
          >
            سعر المتر
          </label>
          <input
            type="text"
            id="materPriec"
            name="materPriec"
            defaultValue={CurrentProject?.materPriec}
            className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
          />
        </div>
   <span  className='mb-5 text-lg'> حاله التقسيط</span>
        <div className="flex gap-3">
          {cashTypes?.map((item) => {
            return (
              <button
                onClick={() => setCahselectedType(item)}
                className={
                  chasSelectedtype === item
                    ? 'p-3  px-7 rounded-[10px] text-white   bg-main'
                    : 'p-3 px-7 rounded-[10px] dark:text-white  border-[1px] border-[#eee]'
                }
                type="button"
                key={item}
              >
                {item}
              </button>
            );
          })}
        </div>
        <div>
          {chasSelectedtype === 'نعم' ? (
            <div>







<span  className='text-red-500'> هذه البيانات تعرض بشكلها القديم يرجى تصحييها بالاسلوب الجديد للحفاظ على بيانات</span>
              
              <div className="mb-6 flex flex-col  gap-2">
                <label
                  htmlFor="installmentsFirstPyment"
                  className="w-full text-lg font-medium text-black dark:text-white"
                >
                  الدفعة الأولى*
                </label>
                <input
                  type="text"
                  id="installmentsFirstPyment"
          
                  defaultValue={CurrentProject?.installmentsFirstPyment}
                  className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
                />
              </div>
        <div className="mb-6 flex flex-col gap-2">
  <label
    htmlFor="InstallmentPeriod"
    className="w-full text-lg font-medium text-black dark:text-white"
  >
    مدة التقسيط*
  </label>
  <select
    id="InstallmentPeriod"
    name="InstallmentPeriod"
    value={projectData.InstallmentPeriod}
    onChange={handelInputschage}
    className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
  >
    <option value="">اختر مدة التقسيط</option>
    <option value="شهري">شهري</option>
    <option value="سنوي">سنوي</option>
  </select>
</div>
              {/* <div className="mb-6 flex flex-col  gap-2">
                <label
                  htmlFor="installmentsFirstPermonth"
                  className="w-full text-lg font-medium text-black dark:text-white"
                >
                  الدفعة الشهرية*
                </label>
                <input
                  type="text"
                  id="installmentsFirstPermonth"
                  name="installmentsFirstPermonth"
                  defaultValue={CurrentProject?.installmentsFirstPermonth}
                  className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
                />
              </div> */}
         


                  {/* الدفعة الأولى */}
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
    {Array.from({ length: 100 }, (_, i) => (i + 1) * 100000)
      .filter(v => v <= 10000000)
      .map((value) => (
        <option key={value} value={value}>
          {value.toLocaleString()} 
        </option>
      ))}
  </select>
</div>



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
    {Array.from({ length: 56 }, (_, i) => (i + 1) * 1000 + 4000)
      .filter(v => v <= 60000)
      .map((value) => (
        <option key={value} value={value}>
          {value.toLocaleString()} 
        </option>
      ))}
  </select>
</div>
            </div>
          ) : null}
                  <div className="mb-6 flex flex-col gap-2 mb-3">
  <label
    htmlFor="availableFloors"
    className="w-full text-lg font-medium text-black dark:text-white mb-5 mt-5"
  >
    الطوابق المتوفرة*
  </label>

  <select
    id="availableFloors"
    name="availableFloors"
    value={projectData.availableFloors}
    onChange={handelInputschage}
    className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
  >
    <option value="">اختر عدد الطوابق</option>
    {[...Array(10)].map((_, index) => (
      <option key={index + 1} value={index + 1}>
        {index + 1}
      </option>
    ))}
  </select>
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
              defaultValue={CurrentProject?.typeOfSpaceoutside}
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
              defaultValue={CurrentProject?.imageLink}
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
              defaultValue={CurrentProject?.videoLink}
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
          <textarea
           defaultValue={CurrentProject?.projectNotes}
            name="projectNotes"
            className="focus:border-primary min-h-[150px] max-h-[200px] active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
          ></textarea>
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
            {viewmenu && (
              <div
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
                  accept="application/pdf"
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
            )}
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

      <div className="add_return flex justify-between items-center mt-4 shadow-lg p-4 bg-white dark:bg-form-input">
        <div className="add_btn">
          <button
            type="submit"
            className={` py-2 px-6 rounded-md bg-main text-white hover:bg-transparent hover:border hover:border-blue-600 hover:text-blue-600`}
          >
          حفظ
          </button>
        </div>
        <div className="return_btn">
          <NavLink
            to="/projects-main"
            className="bg-gray-300 text-gray-700 py-2 px-6 rounded-md"
          >
            عوده
          </NavLink>
        </div>
      </div>
    </form>
  );
};

export default Updateform;
