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
import AddProperty from '../Addprojectui/AddProperty';
import StatusFilterTabs from '../../common/StatusFilterTabs';
 import { useRef } from 'react';

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
  const { data: locations } = useQuerygetiteams('location', 'location');
  const { data: Currencydata } = useQuerygetiteams('currency', 'currency');
  const { data: regionData } = useQuerygetiteams('region', 'region');
  const { data: Area } = useQuerygetiteams('arae', 'arae');
  const { data: FirsPaymentData } = useQuerygetiteams(
    'firstpayment',
    'firstpayment',
  );
      const { data:MonthlyPaymentData } = useQuerygetiteams("monthPayment", "monthPayment");
    const { data:FloorNumbertData } = useQuerygetiteams("FloorNumber", "FloorNumber");

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
  const [Currency, setCurrency] = useState('');
  const CurrentProject = data?.data;
  const navigate = useNavigate();
  const [images_video, setimages_video] = useState([]);
  const [relatedTypes, setRelatedType] = useState([]);
  const [projectCheck, setProjectCheck] = useState(false);

  const [projectData, setprojectData] = useState({
    projectOwner: '',
    projectOwnerPhone: '',
    governoate: '',
    projectName: '',
    estateType: '',
    detailedAddress: '',
   
    projectDetails: '',
    projectads: '',
    projectSatatus: '',
    pymentType: '',
    estatePrice: '',
    materPriec: '',
    installmentsFirstPyment: '',
    InstallmentPeriod: '',
    installmentsFirstPermonth: '',
    clientType: '',
    areaMatter: '',

    typeOfSpaceoutside: '',
    spaceOuteside: '',
    city: '',
    relatedtype: '',
    availableFloors:[] ,
    Barkaaraemater:"" ,
    countOfperiod:"" ,
    installmentPeriod:""
  });
  const [relatedRegions, setRelatedRegion] = useState([]);
  const [docs, setDocs] = useState([]);
  const [viewmenu, setViewmenu] = useState(false);
  const formContainerRef = useRef(null);
  const [properties, setProperties] = useState([]);
const [propertyRelated , setPropertyRelated] = useState([])
   const [images_videoProperty , setimages_videoProperty] = useState([])
  const [docsProperty , setDocsProperty] = useState([])
const [propertyForm, setPropertyForm] = useState({
  floorType:"",
  floorTypeFlow:"",
  floorNumber:"",
  areaOutside:"",
  areaTarth:"",
  areaBark:"",
propertyStatus: "", 
  unitName: "",
  floor: "",
  rooms: "",
  bathrooms: "",
  area: "",
  price: "",
  downPayment: "",
  monthlyInstallment: "",
  propertyNote:"",
  FloorDetails:"",
  imagesURLs:[],
  docsURLs:[]

});
  const statusConfig = {
 
    info: {
      label: "بيانات المشروع" ,
      className: "text-yellow-600 hover:text-yellow-700",
      icon: "clock"
    },
    properties: {
      label: "تفاصيل الشقق" ,
      className: "text-green-600 hover:text-green-700",
      icon: "check-circle"
    },

 
 
 

  }; 
  const [CurrenTap , setCurrentTap] = useState("info")  

const [editIndex, setEditIndex] = useState(null);

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
const toggleFloor = (floor) => {
  setprojectData(prev => ({
    ...prev,
    availableFloors: prev.availableFloors.includes(floor)
      ? prev.availableFloors.filter(f => f !== floor)
      : [...prev.availableFloors, floor],
  }));
};


  const handelSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    

const cleanedProperties = properties.map((property) => ({

  ...property,

  imagesURLs:
    property.imagesURLs?.filter(
      (item) => item?.fileURL
    ) || [],

  docsURLs:
    property.docsURLs?.filter(
      (item) => item?.fileURL
    ) || [],

  videosURLs:
    property.videosURLs?.filter(
      (item) => item?.fileURL
    ) || [],

}));
formData.append(
  "properties",
  JSON.stringify(cleanedProperties)
);
  formData.append("availableFloors", JSON.stringify(projectData.availableFloors));

    formData.set("operationType" , opeartionType)
    formData.set("installments" , chasSelectedtype)
    docs.forEach((item) => {
      formData.append('projectFiles', item);
    });
    images_video.forEach((item) => {
      formData.append('projectFiles', item);
    });

properties.forEach((property, index) => {

  // IMAGES + VIDEOS
  property.imagesURLs?.forEach((item) => {

    // لو صورة جديدة مرفوعة
    if (item?.file instanceof File) {

      formData.append(
        `propertyImages_${index}`,
        item.file
      );

    }

  });

  // DOCS
  property.docsURLs?.forEach((item) => {

    if (item?.file instanceof File) {

      formData.append(
        `propertyDocs_${index}`,
        item.file
      );

    }

  });

});


const data = Object.fromEntries(formData);
if(!projectData.projectName){
  return toast.error("يجب إدخال اسم المشروع")
}








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


const addProperty = () => {


  if (editIndex !== null) {
    // ✅ update
    const updated = [...properties];
    updated[editIndex] = propertyForm;
    setProperties(updated);
    setEditIndex(null);
    toast.success("تم تعديل الشقة");
  } else {
    // ✅ add
  setProperties((prev) => [
  ...prev,
  {
    ...propertyForm,
    imagesURLs: propertyForm.imagesURLs?.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    })) || [],
        docsUrl: propertyForm.docsUrl?.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    })) || [],
  },
]);
    toast.success("تم إضافة الشقة");
  }

  setPropertyForm({
  floorType:"",
  floorTypeFlow:"",
  propertyStatus: "", 
  floorNumber:"",
  areaOutside:"",
  areaTarth:"",
  areaBark:"",
  floor: "",
  rooms: "",
  bathrooms: "",
  area: "",
  price: "",
  downPayment: "",
  monthlyInstallment: "",
  propertyNote:"",
  FloorDetails:"",
  imagesURLs:"",
  });
  setimages_videoProperty([])
  setDocsProperty([])
};
  const removeProperty = (index) => {
      const confirmed = window.confirm("هل أنت متأكد أنك تريد الحذف؟");
      if(confirmed) {
    setProperties((prev) => prev.filter((_, i) => i !== index));
    toast.success("تم الحذف بنجاح")
      } else {
        toast.success("تم الغاء الحذف بنجاح")
      }

  };
  const removeFloor = (floor) => {
  setprojectData(prev => ({
    ...prev,
    availableFloors: prev.availableFloors.filter(f => f !== floor),
  }));
};
const handelPropertyForm = (e) => {
  const { name, value } = e.target;
console.log("name - value" , name , value)
  setPropertyForm((prev) => ({
    ...prev,
    [name]: value,
  })
)

    if(name === "floorType"){
      const CurrentRegion = regionData?.data?.data?.find((item) => item.name === value)
      console.log(regionData?.data?.data)
console.log(value)
      if(CurrentRegion){
setPropertyRelated(CurrentRegion?.relatedRegions)

      } else{
        setPropertyRelated([])
      }
      
      
    }
};
  const handelInputschage = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setprojectData((prev) => ({ ...prev, [name]: value }));
    if (name === 'governoate') {
      const CurrentRegion = locations?.data?.data?.find(
        (item) => item.name === value,
      );
      if (CurrentRegion) {
        setRelatedRegion(CurrentRegion?.relatedRegions);
      } else {
        setRelatedRegion([]);
      }
    }
    if (name === 'estateType') {
      const CurrentRegion = regionData?.data?.data?.find(
        (item) => item.name === value,
      );
      if (CurrentRegion) {
        setRelatedType(CurrentRegion?.relatedRegions);
      } else {
        setRelatedType([]);
      }
    }
  };
  const editProperty = (index) => {
  setPropertyForm(properties[index]);
  setEditIndex(index);
  console.log("edit");
  

  formContainerRef.current?.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};
  useEffect(() => {
    if (CurrentProject) {
   setprojectData({
  projectOwner: CurrentProject?.projectOwner,
  projectOwnerPhone: CurrentProject?.projectOwnerPhone,

  governoate: CurrentProject?.governoate,
  projectName: CurrentProject?.projectName,
  estateType: CurrentProject?.estateType,
  detailedAddress: CurrentProject?.detailedAddress,

  projectDetails: CurrentProject?.projectDetails,
  projectads: CurrentProject?.projectads,
  projectSatatus: CurrentProject?.projectSatatus,
  pymentType: CurrentProject?.pymentType,

  estatePrice: CurrentProject?.estatePrice,
  materPriec: CurrentProject?.materPriec,
installments:CurrentProject?.installments,
  installmentsFirstPyment: CurrentProject?.installmentsFirstPyment,
  InstallmentPeriod: CurrentProject?.InstallmentPeriod,
  installmentsFirstPermonth: CurrentProject?.installmentsFirstPermonth,

  clientType: CurrentProject?.clientType,

  areaMatter: CurrentProject?.areaMatter,
  typeOfSpaceoutside: CurrentProject?.typeOfSpaceoutside,
  spaceOuteside: CurrentProject?.spaceOuteside,

  city: CurrentProject?.city,
  relatedtype: CurrentProject?.relatedtype,

  availableFloors: CurrentProject?.availableFloors || [],

  Barkaaraemater: CurrentProject?.Barkaaraemater,
  countOfperiod: CurrentProject?.countOfperiod,
  installmentPeriod: CurrentProject?.installmentPeriod,
});
setProperties(CurrentProject?.properties || [])
      setOpeartiontype(CurrentProject?.operationType);

      setProjectSatuts(CurrentProject?.projectSatatus);
      setCurrency(CurrentProject?.pymentType);
      setCahselectedType(CurrentProject?.installments);
    }
  }, [CurrentProject]);

  useEffect(() => {
    if (!CurrentProject || !locations?.data?.data) return;
    const CurrentRegionsRelated = locations?.data?.data?.find(
      (item) => item.name === CurrentProject?.governoate,
    );
    setRelatedRegion(CurrentRegionsRelated?.relatedRegions);
  }, [CurrentProject, locations]);

  useEffect(() => {
    if (!CurrentProject || !regionData?.data?.data) return;
    const CurrenttypesRelated = regionData?.data?.data?.find(
      (item) => item.name === CurrentProject?.estateType,
    );
    setRelatedType(CurrenttypesRelated?.relatedRegions);
  }, [CurrentProject, regionData]);
console.log("project" , data);
  if (isLoading || SubmitLoading) {
    return <Loader />;
  }



  return (
    <form
      onSubmit={handelSubmit}
      className="w-full h-full bg-white rounded-[10px] dark:bg-form-input"
    >

            <StatusFilterTabs  statusConfig={statusConfig} onStatusChange={(key) => setCurrentTap(key)} selectedStatus={CurrenTap}/>
      {
        CurrenTap === "info" &&      <div className="main-section w-full max-h-[400px] min-h-[100px] p-4 overflow-auto" > 
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
            value={projectData?.projectOwner}
             onChange={handelInputschage}
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
            value={projectData?.projectOwnerPhone}
             onChange={handelInputschage}
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
            {locations?.data?.data?.map((item) => {
              return (
                <option key={item?._id} value={item?.name}>
                  {item?.name}
                </option>
              );
            })}
          </select>
        </div>

        <div className="mb-6 flex flex-col gap-2">
          <label
            htmlFor="city"
            className="w-full text-lg font-medium text-black dark:text-white"
          >
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
             onChange={handelInputschage}
            value={projectData?.projectName}
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
                  onChange={handelInputschage}
            value={projectData?.detailedAddress}
           
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
            onChange={handelInputschage}
            value={projectData.estateType}
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
          <label
            htmlFor="relatedtype"
            className="w-full text-lg font-medium text-black dark:text-white"
          >
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
                      onChange={handelInputschage}
            value={projectData?.projectDetails}
       
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
               onChange={handelInputschage}
            value={projectData?.projectads}
           
            className="focus:border-primary min-h-[150px] max-h-[200px]  active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
          ></textarea>
        </div>

        <span> وضع العقار</span>
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
            {Currencydata?.data?.data?.map((item) => {
              return (
                <option key={item?._id} value={item?.name}>
                  {item?.name}
                </option>
              );
            })}
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
            onChange={handelInputschage}
            value={projectData?.estatePrice}
         
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
             onChange={handelInputschage}
            value={projectData?.materPriec}
          
            className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
          />
        </div>
        <span className="mb-5 text-lg"> حاله التقسيط</span>
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
              <span className="text-red-500">
                {' '}
                هذه البيانات تعرض بشكلها القديم يرجى تصحييها بالاسلوب الجديد
                للحفاظ على بيانات
              </span>
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
 {
  FirsPaymentData?.data?.data?.map((item) => {
    return <option value={item?.name} key={item?._id}>{item?.name.toLocaleString('en-US')}</option>
  })
 }
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
             {
  MonthlyPaymentData?.data?.data?.map((item) => {
    return <option value={item?.name} key={item?._id}>{item?.name.toLocaleString('en-US')}</option>
  })
 }
                </select>
              </div>
            </div>
          ) : null}

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
              <option value="">أختر المساحه</option>
              {Area?.data?.data?.map((item) => {
                return (
                  <option key={item._id} value={item.name}>
                    {item.name + 'م²'}
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
              <option value="">أختر المساحه</option>
              {Area?.data?.data?.map((item) => {
                return (
                  <option key={item._id} value={item.name}>
                    {item.name + 'م²'}
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
               onChange={handelInputschage}
            value={projectData?.typeOfSpaceoutside}
            
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
                   onChange={handelInputschage}
            value={projectData?.imageLink}
           
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
                        onChange={handelInputschage}
            value={projectData?.videoLink}
             
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
                     onChange={handelInputschage}
            value={projectData?.projectNotes}
          
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
      }

      {
    CurrenTap === "properties" && <AddProperty formContainerRef={formContainerRef} setDocsProperty={setDocsProperty} images_videoProperty={images_videoProperty} propertyRelated={propertyRelated}  setimages_videoProperty={setimages_videoProperty} docsProperty={docsProperty}   editProperty={editProperty}
  editIndex={editIndex} propertyForm={propertyForm} removeProperty={removeProperty} addProperty={addProperty}  properties={properties} handelPropertyForm={handelPropertyForm}/>
   }
 

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
