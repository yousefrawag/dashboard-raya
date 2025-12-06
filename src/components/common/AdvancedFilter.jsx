import React from 'react'
import { FiSearch, FiDownload, FiRefreshCcw, FiChevronDown } from "react-icons/fi";
import useQuerygetiteams from '../../services/Querygetiteams';
import { useState } from 'react';
const AdvancedFilter = ({formData , setFormData}) => {
      const { data } = useQuerygetiteams("requirements", "requirements");
      const { data: locations } = useQuerygetiteams("location", "location");
     const {data:clientWorkdata } = useQuerygetiteams("client-work" , "client-work")
       const {data:customerTypes } = useQuerygetiteams("clientStauts" , "clientStauts")
  const {data:projects } = useQuerygetiteams("projects/selectproject" , "projects/selectproject")
  const {data:customerCeckstauts } = useQuerygetiteams("clientcheckStauts" , "clientcheckStauts")
const [statusCheck, setStatusCheck] = useState(false);
const [statusSearch, setStatusSearch] = useState('');
const [Sourcecheck , setSourcecheck] = useState(false)
const [sourchSearch , setSourceSearch] = useState("")
const [clientWorkChek , setClientworkcheck] = useState(false)
const [clientsearch , setClientWorkSearch] = useState("")
  const [inspectionCheck, setInspectionCheck] = useState(false);
  const [inspectionSearch, setInspectionSearch] = useState('');
    const [projectCheck, setProjectCheck] = useState(false);
  const [projectSearch, setProjectSearch] = useState('');
const clientSources = [
  "حملة إعلانية ممولة",
  "علاقات شخصية", 
  "منصات التواصل الاجتماعي",
  "بحث في جوجل",
  "زيارة مباشرة للموقع",
  "حملة بريد إلكتروني",
  "فعالية أو معرض",
  "اتصال مباشر",
  "عميل حالي قام بالإحالة",
  "حملة واتساب",
  "أخرى"
];
// دالة toggle للاختيار
const toggleStatus = (statusName) => {
  setFormData((prev) => {
    const currentStatuses = prev.clientStatus || [];
    
    if (currentStatuses.includes(statusName)) {
      // إزالة إذا موجود
      return { 
        ...prev, 
        clientStatus: currentStatuses.filter(status => status !== statusName) 
      };
    } else {
      // إضافة إذا غير موجود
      return { 
        ...prev, 
        clientStatus: [...currentStatuses, statusName] 
      };
    }
  });
};

// دالة إزالة عنصر    
const removeStatus = (statusToRemove) => {
  setFormData((prev) => ({
    ...prev,
    clientStatus: prev.clientStatus?.filter(status => status !== statusToRemove) || []
  }));
};
const toggleSource = (statusName) => {
  setFormData((prev) => {
    const currentStatuses = prev.source || [];
    
    if (currentStatuses.includes(statusName)) {
      // إزالة إذا موجود
      return { 
        ...prev, 
        source: currentStatuses.filter(status => status !== statusName) 
      };
    } else {
      // إضافة إذا غير موجود
      return { 
        ...prev, 
        source: [...currentStatuses, statusName] 
      };
    }
  });
};
const removeSource = (statusToRemove) => {
  setFormData((prev) => ({
    ...prev,
    source: prev.source?.filter(status => status !== statusToRemove) || []
  }));
};

const toggleclientwork = (statusName) => {
  setFormData((prev) => {
    const currentStatuses = prev.clientwork || [];
    
    if (currentStatuses.includes(statusName)) {
      // إزالة إذا موجود
      return { 
        ...prev, 
        clientwork: currentStatuses.filter(status => status !== statusName) 
      };
    } else {
      // إضافة إذا غير موجود
      return { 
        ...prev, 
        clientwork: [...currentStatuses, statusName] 
      };
    }
  });
};

const removeclientwork = (statusToRemove) => {
  setFormData((prev) => ({
    ...prev,
    clientwork: prev.clientwork?.filter(status => status !== statusToRemove) || []
  }));
};


  const toggleInspection = (inspectionName) => {
    setFormData((prev) => {
      const currentInspections = prev.isViwed || [];
      
      if (currentInspections.includes(inspectionName)) {
        return { 
          ...prev, 
          isViwed: currentInspections.filter(inspection => inspection !== inspectionName) 
        };
      } else {
        return { 
          ...prev, 
          isViwed: [...currentInspections, inspectionName] 
        };
      }
    });
  };

  const removeInspection = (inspectionToRemove) => {
    setFormData((prev) => ({
      ...prev,
      isViwed: prev.isViwed?.filter(inspection => inspection !== inspectionToRemove) || []
    }));
  };
    const toggleProject = (projectName) => {
    setFormData((prev) => {
      const currentProjects = prev.project || [];
      
      if (currentProjects.includes(projectName)) {
        return { 
          ...prev, 
          project: currentProjects.filter(project => project !== projectName) 
        };
      } else {
        return { 
          ...prev, 
          project: [...currentProjects, projectName] 
        };
      }
    });
  };

  const removeProject = (projectToRemove) => {
    setFormData((prev) => ({
      ...prev,
      project: prev.project?.filter(project => project !== projectToRemove) || []
    }));
  };
  const [relatedRegions, setRelatedRegions] = useState([]);
  const [Typesy, setTypes] = useState([]);
  const [relatedLocations , setRelatedLocation] = useState([])

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "rquireLocation") {
      const selectedRegion = locations?.data?.data?.find(item => item.name === value);
      setRelatedRegions(selectedRegion?.relatedRegions || []);
    }

    if (name === "require") {
      const selectedType = data?.data?.data?.find(item => item.name === value);
      setTypes(selectedType?.relatedRegions || []);
    }
        if (name === "region") {
      const selectedType = locations?.data?.data?.find(item => item.name === value);
      setRelatedLocation(selectedType?.relatedRegions || []);
    }
  }
    
  
    
  
  return (
    <div className='w-full  bg-gray-100 max-h-[200px] overflow-y-auto rounded-10'>
        <div className='grid grid-cols-1 lg:grid-cols-4 gap-2 p-3'>
             <div className="mb-6 flex flex-col  gap-2">
                        <label
                            htmlFor="addBy"
                            className="w-full text-lg font-medium text-black dark:text-white"
                        >
                 المسوق
                        </label>
                        <input
                            type="text"
                            id="addBy"
                            name="addBy"
                            value={formData.addBy}
                            onChange={handleFormChange}
                            className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
                        />
                    
            </div>
              <div className="mb-6 flex flex-col  gap-2">
                        <label
                            htmlFor="userfollow"
                            className="w-full text-lg font-medium text-black dark:text-white"
                        >
                 اسم المتابع
                        </label>
                        <input
                            type="text"
                           id="userfollow"
                             name="userfollow"
                            value={formData.userfollow}
                            onChange={handleFormChange}
                            className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
                        />
                    
            </div>
       

             <div className="mb-6 flex flex-col  gap-2">
    <label
      htmlFor="clientwork"
      className="w-full text-lg font-medium text-black dark:text-white"
    >
      وظيفة العميل *

    </label>
      <div className="relative">
    {/* Select Button */}
    <button 
      type="button"
      onClick={() => setClientworkcheck(!clientWorkChek)}
      className="w-full text-right p-3 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent flex justify-between items-center"
    >
      <span className="text-gray-500">
        {formData.clientwork?.length > 0 
          ? `تم اختيار ${formData.clientwork.length} عنصر` 
          : "قم بالإختيار"
        }
      </span>
      <svg 
        className={`w-5 h-5 text-gray-400 transition-transform ${clientWorkChek ? 'rotate-180' : ''}`}
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    {/* Dropdown Menu */}
    {clientWorkChek && (
      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
        {/* Search Input */}
        <div className="p-2 border-b border-gray-200">
          <input
            type="text"
            placeholder="ابحث..."
            value={clientsearch}
            onChange={(e) => setClientWorkSearch(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        
        {/* Options List */}
        <div className="py-1">
          { clientWorkdata?.data?.data
            ?.filter(item => 
              item?.name.toLowerCase().includes(statusSearch.toLowerCase())
            )
            ?.map((item) => {
              const isSelected = formData.clientwork?.includes(item);
              return (
                <div
                  key={item._id}
                  onClick={() => toggleclientwork(item.name)}
                  className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-colors ${
                    isSelected 
                      ? 'bg-blue-50 text-blue-700' 
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <span className="text-sm font-medium">{item.name}</span>
                  
                  {/* Checkmark */}
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
        
        {/* Selected Count */}
        <div className="px-4 py-2 border-t border-gray-200 bg-gray-50">
          <p className="text-sm text-gray-600">
            {formData.clientwork?.length || 0} عنصر مختار
          </p>
        </div>
      </div>
    )}
  </div>
   {formData.clientwork?.length > 0 && (
    <div className="mt-3">
      <div className="flex flex-wrap gap-2">
        {formData.clientwork.map((status, index) => (
          <span 
            key={index}
            className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
          >
            {status}
            <button
              type="button"
              onClick={() => removeclientwork(status)}
              className="text-blue-600 hover:text-blue-800 text-lg leading-none"
            >
              ×
            </button>
          </span>
        ))}
      </div>
    </div>
  )}
 
  </div>




 <div className="mb-6 flex flex-col gap-2">
  <label className="w-full text-lg font-medium text-black dark:text-white">
    مصدر العميل *
  </label>
  
  {/* Custom Multi-Select Dropdown */}
  <div className="relative">
    {/* Select Button */}
    <button 
      type="button"
      onClick={() => setSourcecheck(!Sourcecheck)}
      className="w-full text-right p-3 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent flex justify-between items-center"
    >
      <span className="text-gray-500">
        {formData.source?.length > 0 
          ? `تم اختيار ${formData.source.length} عنصر` 
          : "قم بالإختيار"
        }
      </span>
      <svg 
        className={`w-5 h-5 text-gray-400 transition-transform ${Sourcecheck ? 'rotate-180' : ''}`}
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    {/* Dropdown Menu */}
    {Sourcecheck && (
      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
        {/* Search Input */}
        <div className="p-2 border-b border-gray-200">
          <input
            type="text"
            placeholder="ابحث..."
            value={sourchSearch}
            onChange={(e) => setSourceSearch(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        
        {/* Options List */}
        <div className="py-1">
          {clientSources
            ?.filter(item => 
              item.toLowerCase().includes(statusSearch.toLowerCase())
            )
            ?.map((item) => {
              const isSelected = formData.source?.includes(item);
              return (
                <div
                  key={item}
                  onClick={() => toggleSource(item)}
                  className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-colors ${
                    isSelected 
                      ? 'bg-blue-50 text-blue-700' 
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <span className="text-sm font-medium">{item}</span>
                  
                  {/* Checkmark */}
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
        
        {/* Selected Count */}
        <div className="px-4 py-2 border-t border-gray-200 bg-gray-50">
          <p className="text-sm text-gray-600">
            {formData.source?.length || 0} عنصر مختار
          </p>
        </div>
      </div>
    )}
  </div>

  {/* Selected Items Tags */}
  {formData.source?.length > 0 && (
    <div className="mt-3">
      <div className="flex flex-wrap gap-2">
        {formData.source.map((status, index) => (
          <span 
            key={index}
            className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
          >
            {status}
            <button
              type="button"
              onClick={() => removeSource(status)}
              className="text-blue-600 hover:text-blue-800 text-lg leading-none"
            >
              ×
            </button>
          </span>
        ))}
      </div>
    </div>
  )}
</div>





 <div className="mb-6 flex flex-col gap-2">
  <label className="w-full text-lg font-medium text-black dark:text-white">
    حالة العميل *
  </label>
  
  {/* Custom Multi-Select Dropdown */}
  <div className="relative">
    {/* Select Button */}
    <button 
      type="button"
      onClick={() => setStatusCheck(!statusCheck)}
      className="w-full text-right p-3 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent flex justify-between items-center"
    >
      <span className="text-gray-500">
        {formData.clientStatus?.length > 0 
          ? `تم اختيار ${formData.clientStatus.length} عنصر` 
          : "قم بالإختيار"
        }
      </span>
      <svg 
        className={`w-5 h-5 text-gray-400 transition-transform ${statusCheck ? 'rotate-180' : ''}`}
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    {/* Dropdown Menu */}
    {statusCheck && (
      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
        {/* Search Input */}
        <div className="p-2 border-b border-gray-200">
          <input
            type="text"
            placeholder="ابحث..."
            value={statusSearch}
            onChange={(e) => setStatusSearch(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        
        {/* Options List */}
        <div className="py-1">
          {customerTypes?.data?.data
            ?.filter(item => 
              item.name.toLowerCase().includes(statusSearch.toLowerCase())
            )
            ?.map((item) => {
              const isSelected = formData.clientStatus?.includes(item.name);
              return (
                <div
                  key={item._id}
                  onClick={() => toggleStatus(item.name)}
                  className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-colors ${
                    isSelected 
                      ? 'bg-blue-50 text-blue-700' 
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <span className="text-sm font-medium">{item.name}</span>
                  
                  {/* Checkmark */}
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
        
        {/* Selected Count */}
        <div className="px-4 py-2 border-t border-gray-200 bg-gray-50">
          <p className="text-sm text-gray-600">
            {formData.clientStatus?.length || 0} عنصر مختار
          </p>
        </div>
      </div>
    )}
  </div>

  {/* Selected Items Tags */}
  {formData.clientStatus?.length > 0 && (
    <div className="mt-3">
      <div className="flex flex-wrap gap-2">
        {formData.clientStatus.map((status, index) => (
          <span 
            key={index}
            className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
          >
            {status}
            <button
              type="button"
              onClick={() => removeStatus(status)}
              className="text-blue-600 hover:text-blue-800 text-lg leading-none"
            >
              ×
            </button>
          </span>
        ))}
      </div>
    </div>
  )}
</div>


      
  <div className="mb-6 flex flex-col  gap-2">
    <label
      htmlFor="region"
      className="w-full text-lg font-medium text-black dark:text-white"
    >
 المنطقة*

    </label>
    <select
      name="region"
      id="region"
      
      value={formData.region}
    onChange={handleFormChange}
      className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
    >
      
      <option>قم بالإختيار</option>
   {
    locations?.data?.data?.map((item) => {
      return <option key={item?._id}  value={item?.name}>
        {
          item?.name
        }
      </option>
    })
   }
    </select>
  </div>



           <div className="flex flex-col gap-2">
            <label className="font-medium"> الموقع*</label>
            <select
              name="governote"
              value={formData.governote}
              onChange={handleFormChange}
      className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
            >
              <option value="">قم بالإختيار</option>
              {relatedLocations?.map((item, i) => (
                <option key={i} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>



    <div className="mb-6 flex flex-col gap-2">
          <label className="w-full text-lg font-medium text-black dark:text-white">
            المشروع المهتم به *
          </label>
          
          <div className="relative">
            <button 
              type="button"
              onClick={() => setProjectCheck(!projectCheck)}
              className="w-full text-right p-3 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent flex justify-between items-center"
            >
              <span className="text-gray-500">
                {formData.project?.length > 0 
                  ? `تم اختيار ${formData.project.length} عنصر` 
                  : "قم بالإختيار"
                }
              </span>
              <svg 
                className={`w-5 h-5 text-gray-400 transition-transform ${projectCheck ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {projectCheck && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                <div className="p-2 border-b border-gray-200">
                  <input
                    type="text"
                    placeholder="ابحث..."
                    value={projectSearch}
                    onChange={(e) => setProjectSearch(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                
                <div className="py-1">
                  {projects?.data?.allproject
                    ?.filter(item => 
                      item.projectName.toLowerCase().includes(projectSearch.toLowerCase())
                    )
                    ?.map((item) => {
                      const isSelected = formData.project?.includes(item.projectName);
                      return (
                        <div
                          key={item._id}
                          onClick={() => toggleProject(item.projectName)}
                          className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-colors ${
                            isSelected 
                              ? 'bg-blue-50 text-blue-700' 
                              : 'hover:bg-gray-50 text-gray-700'
                          }`}
                        >
                          <span className="text-sm font-medium">{item.projectName}</span>
                          
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
                
                <div className="px-4 py-2 border-t border-gray-200 bg-gray-50">
                  <p className="text-sm text-gray-600">
                    {formData.project?.length || 0} عنصر مختار
                  </p>
                </div>
              </div>
            )}
          </div>

          {formData.project?.length > 0 && (
            <div className="mt-3">
              <div className="flex flex-wrap gap-2">
                {formData.project.map((project, index) => (
                  <span 
                    key={index}
                    className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                  >
                    {project}
                    <button
                      type="button"
                      onClick={() => removeProject(project)}
                      className="text-blue-600 hover:text-blue-800 text-lg leading-none"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>


           <div className="mb-6 flex flex-col  gap-2">
    <label
      htmlFor="cashOption"
      className="w-full text-lg font-medium text-black dark:text-white"
    >
 ألية الدفع*

    </label>
    <select
     
     name="cashOption" 
         value={formData.cashOption}
    onChange={handleFormChange}
      id="cashOption"
      
      className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
    >
      
      <option value="">قم بالإختيار</option>
        <option value="كاش"> كاش</option>
          <option value="تقسيط"> تقسيط</option>
              <option value="معاملة بنكية"> معاملة بنكية</option>
    </select>
  </div>



       

<div className='flex gap-1'>
            <div className="mb-6 flex flex-col  gap-2">
                        <label
                            htmlFor="firstPaymentFrom"
                            className="w-full text-lg font-medium text-black dark:text-white"
                        >
             الدفعة الالى من 
                        </label>
              <select
    name="firstPaymentFrom"
    id="firstPaymentFrom"
 value={formData.firstPaymentFrom}
    onChange={handleFormChange}

    className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
  >
    <option value="">اختر الدفعة</option>
    <option value="100000">100,000</option>
    <option value="150000">150,000</option>
    <option value="200000">200,000</option>
    <option value="250000">250,000</option>
    <option value="300000">300,000</option>
    <option value="350000">350,000</option>
    <option value="400000">400,000</option>
    <option value="450000">450,000</option>
    <option value="500000">500,000</option>
    <option value="550000">550,000</option>
    <option value="600000">600,000</option>
    <option value="650000">650,000</option>
    <option value="700000">700,000</option>
    <option value="750000">750,000</option>
    <option value="800000">800,000</option>
    <option value="850000">850,000</option>
    <option value="900000">900,000</option>
    <option value="950000">950,000</option>
    <option value="1000000">1,000,000</option>
    <option value="1050000">1,050,000</option>
    <option value="1100000">1,100,000</option>
    <option value="1150000">1,150,000</option>
    <option value="1200000">1,200,000</option>
    <option value="1250000">1,250,000</option>
    <option value="1300000">1,300,000</option>
    <option value="1350000">1,350,000</option>
    <option value="1400000">1,400,000</option>
    <option value="1450000">1,450,000</option>
    <option value="1500000">1,500,000</option>
  </select>
                    
            </div>
                        <div className="mb-6 flex flex-col  gap-2">
                        <label
                            htmlFor="firstPaymentTo"
                            className="w-full text-lg font-medium text-black dark:text-white"
                        >
             الدفعة الالى الى
                        </label>
                   <select
    name="firstPaymentTo"
    id="firstPaymentTo"
    value={formData.firstPaymentTo}
    onChange={handleFormChange}

    className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
  >
    <option value="">اختر الدفعة</option>
    <option value="100000">100,000</option>
    <option value="150000">150,000</option>
    <option value="200000">200,000</option>
    <option value="250000">250,000</option>
    <option value="300000">300,000</option>
    <option value="350000">350,000</option>
    <option value="400000">400,000</option>
    <option value="450000">450,000</option>
    <option value="500000">500,000</option>
    <option value="550000">550,000</option>
    <option value="600000">600,000</option>
    <option value="650000">650,000</option>
    <option value="700000">700,000</option>
    <option value="750000">750,000</option>
    <option value="800000">800,000</option>
    <option value="850000">850,000</option>
    <option value="900000">900,000</option>
    <option value="950000">950,000</option>
    <option value="1000000">1,000,000</option>
    <option value="1050000">1,050,000</option>
    <option value="1100000">1,100,000</option>
    <option value="1150000">1,150,000</option>
    <option value="1200000">1,200,000</option>
    <option value="1250000">1,250,000</option>
    <option value="1300000">1,300,000</option>
    <option value="1350000">1,350,000</option>
    <option value="1400000">1,400,000</option>
    <option value="1450000">1,450,000</option>
    <option value="1500000">1,500,000</option>
  </select>
                    
            </div>
</div>
         

       <div className="mb-6 flex flex-col  gap-2">
    <label
      htmlFor="InstallmentType"
      className="w-full text-lg font-medium text-black dark:text-white"
    >
نوع التقسيط
</label>
    <select
      name="InstallmentType"
    value={formData.InstallmentType}
    onChange={handleFormChange}
      id="InstallmentType"
      className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
    >
      <option value="">أختر</option>
<option value="سنوى">سنوى</option>
<option value="شهرى">شهرى</option>
    </select>
  </div>

            <div className='flex gap-1'>
            <div className="mb-6 flex flex-col  gap-2">
                        <label
                            htmlFor="followFrom"
                            className="w-full text-lg font-medium text-black dark:text-white"
                        >
              عدد المتابعات من 
                        </label>
                        <input
                            type="number"
                            id="followFrom"
                            name="followFrom"
                         value={formData.followFrom}
                          onChange={handleFormChange}
                            className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
                        />
                    
            </div>
                        <div className="mb-6 flex flex-col  gap-2">
                        <label
                            htmlFor="followTo"
                            className="w-full text-lg font-medium text-black dark:text-white"
                        >
              عدد المتابعات الى
                        </label>
                        <input
                            type="number"
                            id="followTo"
                            name="followTo"
                     value={formData.followTo}
                          onChange={handleFormChange}
                            className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
                        />
                    
            </div>
</div>

            <div className='flex gap-1'>
            <div className="mb-6 flex flex-col  gap-2">
                        <label
                            htmlFor="ordersFrom"
                            className="w-full text-lg font-medium text-black dark:text-white"
                        >
              عدد الطلبات من 
                        </label>
                        <input
                            type="text"
                            id="ordersFrom"
                            name="ordersFrom"
                        value={formData.ordersFrom}
                          onChange={handleFormChange}
                            className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
                        />
                    
            </div>
                        <div className="mb-6 flex flex-col  gap-2">
                        <label
                            htmlFor="ordersTo"
                            className="w-full text-lg font-medium text-black dark:text-white"
                        >
              عدد الطلبات الى
                        </label>
                        <input
                            type="text"
                            id="ordersTo"
                            name="ordersTo"
                            value={formData.ordersTo}
                          onChange={handleFormChange}
                            className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
                        />
                    
            </div>
</div>


    <div className="mb-6 flex flex-col gap-2">
          <label className="w-full text-lg font-medium text-black dark:text-white">
            هل تمت المعاينة *
          </label>
          
          <div className="relative">
            <button 
              type="button"
              onClick={() => setInspectionCheck(!inspectionCheck)}
              className="w-full text-right p-3 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent flex justify-between items-center"
            >
              <span className="text-gray-500">
                {formData.isViwed?.length > 0 
                  ? `تم اختيار ${formData.isViwed.length} عنصر` 
                  : "قم بالإختيار"
                }
              </span>
              <svg 
                className={`w-5 h-5 text-gray-400 transition-transform ${inspectionCheck ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {inspectionCheck && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                <div className="p-2 border-b border-gray-200">
                  <input
                    type="text"
                    placeholder="ابحث..."
                    value={inspectionSearch}
                    onChange={(e) => setInspectionSearch(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                
                <div className="py-1">
                  {customerCeckstauts?.data?.data
                    ?.filter(item => 
                      item.name.toLowerCase().includes(inspectionSearch.toLowerCase())
                    )
                    ?.map((item) => {
                      const isSelected = formData.isViwed?.includes(item.name);
                      return (
                        <div
                          key={item._id}
                          onClick={() => toggleInspection(item.name)}
                          className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-colors ${
                            isSelected 
                              ? 'bg-blue-50 text-blue-700' 
                              : 'hover:bg-gray-50 text-gray-700'
                          }`}
                        >
                          <span className="text-sm font-medium">{item.name}</span>
                          
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
                
                <div className="px-4 py-2 border-t border-gray-200 bg-gray-50">
                  <p className="text-sm text-gray-600">
                    {formData.isViwed?.length || 0} عنصر مختار
                  </p>
                </div>
              </div>
            )}
          </div>

          {formData.isViwed?.length > 0 && (
            <div className="mt-3">
              <div className="flex flex-wrap gap-2">
                {formData.isViwed.map((inspection, index) => (
                  <span 
                    key={index}
                    className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                  >
                    {inspection}
                    <button
                      type="button"
                      onClick={() => removeInspection(inspection)}
                      className="text-blue-600 hover:text-blue-800 text-lg leading-none"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

     {/* <div className="mb-6 flex flex-col  gap-2">
              <label
                htmlFor="isViwed"
                className="w-full text-lg font-medium text-black dark:text-white"
              >
                هل تمت المعاينة *
              </label>
              <select
                
                name="isViwed"
                id="isViwed"
           
               value={formData.isViwed}
                 onChange={handleFormChange}
                className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
              >
                <option value="">أختر</option>
                {customerCeckstauts?.data?.data.map((item) => {
                  return (
                    <option key={item?._id} value={item?.name}>
                      {item?.name}
                    </option>
                  );
                })}
              </select>
            </div> */}






               <div className="mb-6 flex flex-col  gap-2">
                        <label
                            htmlFor="clientendRequr"
                            className="w-full text-lg font-medium text-black dark:text-white"
                        >
أخر ماتم التواصل                      </label>
                        <input
                            type="text"
                            id="clientendRequr"
                            name="clientendRequr"
                          value={formData.clientendRequr}
                 onChange={handleFormChange}
                            className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
                        />
                    
            </div>

          

                  </div>

                  <span> طلبات العملاء</span>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* موقع العقار */}
          <div className="flex flex-col gap-2">
            <label className="font-medium">موقع العقار*</label>
            <select
              name="rquireLocation"
              value={formData.rquireLocation}
              onChange={handleFormChange}
             className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"

            >
              <option value="">قم بالإختيار</option>
              {locations?.data?.data?.map((item) => (
                <option key={item._id} value={item.name}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          {/* منطقة العقار */}
          <div className="flex flex-col gap-2">
            <label className="font-medium">منطقة العقار*</label>
            <select
              name="requireRegion"
              value={formData.requireRegion}
              onChange={handleFormChange}
             className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"

            >
              <option value="">قم بالإختيار</option>
              {relatedRegions?.map((item, i) => (
                <option key={i} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          {/* نوع العقار */}
          <div className="flex flex-col gap-2">
            <label className="font-medium">نوع العقار*</label>
            <select
              name="require"
              value={formData.require}
              onChange={handleFormChange}
              className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"

            >
              <option value="">قم بالإختيار</option>
              {data?.data?.data?.map((item) => (
                <option key={item._id} value={item.name}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          {/* وصف العقار */}
          <div className="flex flex-col gap-2">
            <label className="font-medium">وصف العقار*</label>
            <select
              name="requireType"
              value={formData.requireType}
              onChange={handleFormChange}
              className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"

            >
              <option value="">قم بالإختيار</option>
              {Typesy?.map((item, i) => (
                <option key={i} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>
              
    </div>
  )
}

export default AdvancedFilter