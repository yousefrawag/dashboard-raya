import React from 'react';
import {
  FiSearch,
  FiDownload,
  FiRefreshCcw,
  FiChevronDown,
} from 'react-icons/fi';
import useQuerygetiteams from '../../services/Querygetiteams';
import { useState } from 'react';
const AdvancedFilter = ({ formData, setFormData }) => {
  const { data } = useQuerygetiteams('requirements', 'requirements');
  const { data: locations } = useQuerygetiteams('location', 'location');
  const { data: clientWorkdata } = useQuerygetiteams(
    'client-work',
    'client-work',
  );
  const { data: customerTypes } = useQuerygetiteams(
    'clientStauts',
    'clientStauts',
  );
  const { data: projects } = useQuerygetiteams(
    'projects/selectproject',
    'projects/selectproject',
  );
  const { data: customerCeckstauts } = useQuerygetiteams(
    'clientcheckStauts',
    'clientcheckStauts',
  );
  const [statusCheck, setStatusCheck] = useState(false);
  const [statusSearch, setStatusSearch] = useState('');
  const [Sourcecheck, setSourcecheck] = useState(false);
  const [sourchSearch, setSourceSearch] = useState('');
  const [clientWorkChek, setClientworkcheck] = useState(false);
  const [clientsearch, setClientWorkSearch] = useState('');
  const [inspectionCheck, setInspectionCheck] = useState(false);
  const [inspectionSearch, setInspectionSearch] = useState('');
  const [projectCheck, setProjectCheck] = useState(false);
  const [projectSearch, setProjectSearch] = useState('');
  const [GoverNoteStatuts, SetGovernoteStatuts] = useState(false);
  const [goverNoteSearch, setGoverNoteSearch] = useState('');
  const clientSources = [
    'حملة إعلانية ممولة',
    'علاقات شخصية',
    'منصات التواصل الاجتماعي',
    'بحث في جوجل',
    'زيارة مباشرة للموقع',
    'حملة بريد إلكتروني',
    'فعالية أو معرض',
    'اتصال مباشر',
    'عميل حالي قام بالإحالة',
    'حملة واتساب',
    'أخرى',
  ];
  const [relatedstautsCheck , SetRelatedStauts] = useState(false)
  const [SearchRealatedStauts , setSearchRealtedStauts] = useState("")
  const [relatedStautsArray , setRelatedStautsArray]= useState([])
  const [regionOrderStauts , setRegionOrderStauts] = useState(false)
  const [searchRegionOrder , setSearchRegionOrder] = useState("")

  const [requireTypeOrderStauts , setRequireTypeOrderStauts] = useState(false)
    const [requireTypeOrderSearch , setRequireTypeOrderSearch] = useState("")
  // دالة toggle للاختيار
  const toggleStatus = (statusName) => {
    setFormData((prev) => {
      const currentStatuses = prev.clientStatus || [];

      if (currentStatuses.includes(statusName)) {
        // إزالة إذا موجود
        return {
          ...prev,
          clientStatus: currentStatuses.filter(
            (status) => status !== statusName,
          ),
        };
      } else {
             const selectedType = customerTypes?.data?.data?.find(
        (item) => item.name === statusName,
      );
     setRelatedStautsArray((prev) => [
  ...prev,
  ...(selectedType?.relatedRegions || []),
]);

        // إضافة إذا غير موجود
        return {
          ...prev,
          clientStatus: [...currentStatuses, statusName],
        };
      }
    });
  };

  // دالة إزالة عنصر
  const removeStatus = (statusToRemove) => {
    setFormData((prev) => ({
      ...prev,
      clientStatus:
        prev.clientStatus?.filter((status) => status !== statusToRemove) || [],
    }));
  };
  const toggleSource = (statusName) => {
    setFormData((prev) => {
      const currentStatuses = prev.source || [];

      if (currentStatuses.includes(statusName)) {
        // إزالة إذا موجود
        return {
          ...prev,
          source: currentStatuses.filter((status) => status !== statusName),
        };
      } else {
        // إضافة إذا غير موجود
        return {
          ...prev,
          source: [...currentStatuses, statusName],
        };
      }
    });
  };
  const removeSource = (statusToRemove) => {
    setFormData((prev) => ({
      ...prev,
      source: prev.source?.filter((status) => status !== statusToRemove) || [],
    }));
  };

  const toggleclientwork = (statusName) => {
    setFormData((prev) => {
      const currentStatuses = prev.clientwork || [];

      if (currentStatuses.includes(statusName)) {
        // إزالة إذا موجود
        return {
          ...prev,
          clientwork: currentStatuses.filter((status) => status !== statusName),
        };
      } else {
        // إضافة إذا غير موجود
        return {
          ...prev,
          clientwork: [...currentStatuses, statusName],
        };
      }
    });
  };

  const removeclientwork = (statusToRemove) => {
    setFormData((prev) => ({
      ...prev,
      clientwork:
        prev.clientwork?.filter((status) => status !== statusToRemove) || [],
    }));
  };

  const toggleInspection = (inspectionName) => {
    setFormData((prev) => {
      const currentInspections = prev.isViwed || [];

      if (currentInspections.includes(inspectionName)) {
        return {
          ...prev,
          isViwed: currentInspections.filter(
            (inspection) => inspection !== inspectionName,
          ),
        };
      } else {
        return {
          ...prev,
          isViwed: [...currentInspections, inspectionName],
        };
      }
    });
  };

  const removeInspection = (inspectionToRemove) => {
    setFormData((prev) => ({
      ...prev,
      isViwed:
        prev.isViwed?.filter(
          (inspection) => inspection !== inspectionToRemove,
        ) || [],
    }));
  };
  const toggleProject = (projectName) => {
    setFormData((prev) => {
      const currentProjects = prev.project || [];

      if (currentProjects.includes(projectName)) {
        return {
          ...prev,
          project: currentProjects.filter((project) => project !== projectName),
        };
      } else {
        return {
          ...prev,
          project: [...currentProjects, projectName],
        };
      }
    });
  };

  const removeProject = (projectToRemove) => {
    setFormData((prev) => ({
      ...prev,
      project:
        prev.project?.filter((project) => project !== projectToRemove) || [],
    }));
  };
  const TogaleGoverNote = (GoverNoteItem) => {
    setFormData((prev) => {
      console.log('prev', prev);
      const currentGoverNote = prev.governote || [];
     

      if (formData.governote.includes(GoverNoteItem)) {
        return {
          ...prev,
          governote: currentGoverNote?.filter((item) => item !== GoverNoteItem),
        };
      } else {
        return {
          ...prev,
          governote: [...currentGoverNote, GoverNoteItem],
        };
      }
    });
  };
  const removeGoverNote = (GoverNoteItem) => {
    setFormData((prev) => ({
      ...prev,
      governote: prev.governote?.filter((item) => item !== GoverNoteItem) || [],
    }));
  };
  const TogaleRelatedStauts = (relatedStautsItem) => {
    setFormData((prev) => {
      if(formData.relatedStauts?.includes(relatedStautsItem)){
        return {
          ...prev ,
          relatedStauts:prev.relatedStauts?.filter(item => item !== relatedStautsItem)
        }
      } else {
        return {
          ...prev ,
          relatedStauts:[...prev?.relatedStauts ,relatedStautsItem ]
        }
      }
    })
  }
  // regions
 const toggleRegion = (statusName) => {
    setFormData((prev) => {
      const currentStatuses = prev.region || [];

      if (currentStatuses.includes(statusName)) {
        // إزالة إذا موجود
        return {
          ...prev,
          region: currentStatuses.filter(
            (status) => status !== statusName,
          ),
        };
      } else {
             const selectedType = locations?.data?.data?.find(
        (item) => item.name === statusName,
      );
     setRelatedLocation((prev) => [
  ...prev,
  ...(selectedType?.relatedRegions || []),
]);

        // إضافة إذا غير موجود
        return {
          ...prev,
          region: [...currentStatuses, statusName],
        };
      }
    });
  };
  const removeRegion = (GoverNoteItem) => {
    setFormData((prev) => ({
      ...prev,
      governote: prev.governote?.filter((item) => item !== GoverNoteItem) || [],
    }));
  };
  //toggleCashOption
    const toggleCashOption = (projectName) => {
    setFormData((prev) => {
      const currentProjects = prev.cashOption || [];

      if (currentProjects.includes(projectName)) {
        return {
          ...prev,
          cashOption: currentProjects.filter((project) => project !== projectName),
        };
      } else {
        return {
          ...prev,
          cashOption: [...currentProjects, projectName],
        };
      }
    });
  };
    const removecashOption = (GoverNoteItem) => {
    setFormData((prev) => ({
      ...prev,
      cashOption: prev.cashOption?.filter((item) => item !== GoverNoteItem) || [],
    }));
  };

   const togglerequireRegion = (statusName) => {
    setFormData((prev) => {
      const currentStatuses = prev.rquireLocation || [];

      if (currentStatuses.includes(statusName)) {
        // إزالة إذا موجود
        return {
          ...prev,
          rquireLocation: currentStatuses.filter(
            (status) => status !== statusName,
          ),
        };
      } else {
             const selectedType = locations?.data?.data?.find(
        (item) => item.name === statusName,
      );
     setRelatedRegions((prev) => [
  ...prev,
  ...(selectedType?.relatedRegions || []),
]);

        // إضافة إذا غير موجود
        return {
          ...prev,
          rquireLocation: [...currentStatuses, statusName],
        };
      }
    });
  };
    const removerequireRegion = (GoverNoteItem) => {
    setFormData((prev) => ({
      ...prev,
      rquireLocation: prev.rquireLocation?.filter((item) => item !== GoverNoteItem) || [],
    }));
  };
    const TogalerequireregionOrder = (GoverNoteItem) => {
    setFormData((prev) => {
    
      const currentGoverNote = prev.requireRegion || [];
     

      if (formData.requireRegion.includes(GoverNoteItem)) {
        return {
          ...prev,
          requireRegion: currentGoverNote?.filter((item) => item !== GoverNoteItem),
        };
      } else {
        return {
          ...prev,
          requireRegion: [...currentGoverNote, GoverNoteItem],
        };
      }
    });
  };
      const removereguireregionOrder = (GoverNoteItem) => {
    setFormData((prev) => ({
      ...prev,
      requireRegion: prev.requireRegion?.filter((item) => item !== GoverNoteItem) || [],
    }));
  };

     const togglerequireOrder = (statusName) => {
    setFormData((prev) => {
      const currentStatuses = prev.require || [];

      if (currentStatuses.includes(statusName)) {
        // إزالة إذا موجود
        return {
          ...prev,
          require: currentStatuses.filter(
            (status) => status !== statusName,
          ),
        };
      } else {
             const selectedType = data?.data?.data?.find(
        (item) => item.name === statusName,
      );
     setTypes((prev) => [
  ...prev,
  ...(selectedType?.relatedRegions || []),
]);

        // إضافة إذا غير موجود
        return {
          ...prev,
          require: [...currentStatuses, statusName],
        };
      }
    });
  };
     const removererequireOrder = (GoverNoteItem) => {
    setFormData((prev) => ({
      ...prev,
      require: prev.require?.filter((item) => item !== GoverNoteItem) || [],
    }));
  };

    const TogalerequireTypeOrder = (GoverNoteItem) => {
    setFormData((prev) => {
    
      const currentGoverNote = prev.requireType || [];
     

      if (formData.requireType.includes(GoverNoteItem)) {
        return {
          ...prev,
          requireType: currentGoverNote?.filter((item) => item !== GoverNoteItem),
        };
      } else {
        return {
          ...prev,
          requireType: [...currentGoverNote, GoverNoteItem],
        };
      }
    });
  };
     const removerequireTypeOrder = (GoverNoteItem) => {
    setFormData((prev) => ({
      ...prev,
      requireType: prev.requireType?.filter((item) => item !== GoverNoteItem) || [],
    }));
  };
  const [relatedRegions, setRelatedRegions] = useState([]);
  const [Typesy, setTypes] = useState([]);
  const [relatedLocations, setRelatedLocation] = useState([]);
  const [stautsRegions , setStautsRegions] = useState(false)
  const [SearchRegion , setSearchRegion] = useState("")
const [stautsCashOption , setStatutsCashOption] = useState(false)
const [SearchCashoption , setSearchCashoption] = useState("")
const [RequireOrderLocationStauts , setRequireoredrlOcationstauts] = useState(false)
const [searchOrderLocation , setSearchOrderlocation] = useState("")
const [requireOrderStauts , setRequireOrderStauts] = useState(false)
const [searchRequireOrder , setRequireOrderSearch] = useState("")
const chasOptionsFields = ["كاش" , "تقسيط" , "معاملة بنكية"]
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'rquireLocation') {
      const selectedRegion = locations?.data?.data?.find(
        (item) => item.name === value,
      );
      setRelatedRegions(selectedRegion?.relatedRegions || []);
    }

    if (name === 'require') {
      const selectedType = data?.data?.data?.find(
        (item) => item.name === value,
      );
      setTypes(selectedType?.relatedRegions || []);
    }
    if (name === 'region') {
      const selectedType = locations?.data?.data?.find(
        (item) => item.name === value,
      );
      setRelatedLocation(selectedType?.relatedRegions || []);
    }
    if (name === 'clientStatus') {
      const selectedType = customerTypes?.data?.data?.find(
        (item) => item.name === value,
      );
      setRelatedStautsArray(selectedType?.relatedRegions || []);
    }
  };

  return (
    <div className="w-full  rounded-10">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-2 p-3">
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
                  : 'قم بالإختيار'}
              </span>
              <svg
                className={`w-5 h-5 text-gray-400 transition-transform ${clientWorkChek ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
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
                  {clientWorkdata?.data?.data
                    ?.filter((item) =>
                      item?.name
                        .toLowerCase()
                        .includes(statusSearch.toLowerCase()),
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
                          <span className="text-sm font-medium">
                            {item.name}
                          </span>

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
                  : 'قم بالإختيار'}
              </span>
              <svg
                className={`w-5 h-5 text-gray-400 transition-transform ${Sourcecheck ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
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
                    ?.filter((item) =>
                      item.toLowerCase().includes(statusSearch.toLowerCase()),
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
                  : 'قم بالإختيار'}
              </span>
              <svg
                className={`w-5 h-5 text-gray-400 transition-transform ${statusCheck ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
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
                    ?.filter((item) =>
                      item.name
                        .toLowerCase()
                        .includes(statusSearch.toLowerCase()),
                    )
                    ?.map((item) => {
                      const isSelected = formData.clientStatus?.includes(
                        item.name,
                      );
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
                          <span className="text-sm font-medium">
                            {item.name}
                          </span>

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
            htmlFor="relatedStauts"
            className="w-full text-lg font-medium text-black dark:text-white"
          >
            وصف حالة العميل *
          </label>
          <div className="relative">
            {/* Select Button */}
            <button
              type="button"
              onClick={() => SetRelatedStauts(!relatedstautsCheck)}
              className="w-full text-right p-3 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent flex justify-between items-center"
            >
              <span className="text-gray-500">
                {formData.relatedStauts?.length > 0
                  ? `تم اختيار ${formData.relatedStauts.length} عنصر`
                  : 'قم بالإختيار'}
              </span>
              <svg
                className={`w-5 h-5 text-gray-400 transition-transform ${relatedstautsCheck ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {relatedstautsCheck && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                {/* Search Input */}
                <div className="p-2 border-b border-gray-200">
                  <input
                    type="text"
                    placeholder="ابحث..."
                    value={SearchRealatedStauts}
                    onChange={(e) => setSearchRealtedStauts(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {/* Options List */}
                <div className="py-1">
                  {relatedStautsArray
                    ?.filter((item) =>
                      item
                        .toLowerCase()
                        .includes(SearchRealatedStauts.toLowerCase()),
                    )
                    ?.map((item) => {
                      const isSelected = formData.relatedStauts?.includes(item);
                      return (
                        <div
                          key={item}
                          onClick={() => TogaleRelatedStauts(item)}
                          className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-colors ${
                            isSelected
                              ? 'bg-blue-50 text-blue-700'
                              : 'hover:bg-gray-50 text-gray-700'
                          }`}
                        >
                          <span className="text-sm font-medium">
                            {item}
                          </span>

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
                    {formData.relatedStauts?.length || 0} عنصر مختار
                  </p>
                </div>
              </div>
            )}
          </div>
          {formData.relatedStauts?.length > 0 && (
            <div className="mt-3">
              <div className="flex flex-wrap gap-2">
                {formData.relatedStauts.map((status, index) => (
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
             المنطقة *
          </label>

          {/* Custom Multi-Select Dropdown */}
          <div className="relative">
            {/* Select Button */}
            <button
              type="button"
              onClick={() => setStautsRegions(!stautsRegions)}
              className="w-full text-right p-3 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent flex justify-between items-center"
            >
              <span className="text-gray-500">
                {formData.region?.length > 0
                  ? `تم اختيار ${formData.region.length} عنصر`
                  : 'قم بالإختيار'}
              </span>
              <svg
                className={`w-5 h-5 text-gray-400 transition-transform ${stautsRegions ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {stautsRegions && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                {/* Search Input */}
                <div className="p-2 border-b border-gray-200">
                  <input
                    type="text"
                    placeholder="ابحث..."
                    value={SearchRegion}
                    onChange={(e) => setSearchRegion(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {/* Options List */}
                <div className="py-1">
                  {locations?.data?.data
                    ?.filter((item) =>
                      item.name
                        .toLowerCase()
                        .includes(SearchRegion.toLowerCase()),
                    )
                    ?.map((item) => {
                      const isSelected = formData.region?.includes(
                        item.name,
                      );
                      return (
                        <div
                          key={item._id}
                          onClick={() => toggleRegion(item.name)}
                          className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-colors ${
                            isSelected
                              ? 'bg-blue-50 text-blue-700'
                              : 'hover:bg-gray-50 text-gray-700'
                          }`}
                        >
                          <span className="text-sm font-medium">
                            {item.name}
                          </span>

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
                    {formData.region?.length || 0} عنصر مختار
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Selected Items Tags */}
          {formData.region?.length > 0 && (
            <div className="mt-3">
              <div className="flex flex-wrap gap-2">
                {formData.region.map((status, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                  >
                    {status}
                    <button
                      type="button"
                      onClick={() => removeRegion(status)}
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
            {locations?.data?.data?.map((item) => {
              return (
                <option key={item?._id} value={item?.name}>
                  {item?.name}
                </option>
              );
            })}
          </select>
        </div> */}

        <div className="flex flex-col gap-2">
          <label className="font-medium"> الموقع*</label>
          <div className="relative">
            <button
              type="button"
              onClick={() => SetGovernoteStatuts(!GoverNoteStatuts)}
              className="w-full text-right p-3 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent flex justify-between items-center"
            >
              <span className="text-gray-500">
                {formData.governote?.length > 0
                  ? `تم اختيار ${formData.governote.length} عنصر`
                  : 'قم بالإختيار'}
              </span>
              <svg
                className={`w-5 h-5 text-gray-400 transition-transform ${GoverNoteStatuts ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {GoverNoteStatuts && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                <div>
                  <input
                    type="text"
                    placeholder="ابحث ..."
                    value={goverNoteSearch}
                    onChange={(e) => setGoverNoteSearch(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  {relatedLocations
                    ?.filter((item) =>
                      item
                        ?.toLowerCase()
                        ?.includes(goverNoteSearch.toLowerCase()),
                    )
                    ?.map((item) => {
                      const isSelected = formData.governote.includes(item);
                      return (
                        <div
                          key={item}
                          onClick={() => TogaleGoverNote(item)}
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
              </div>
            )}
          </div>
          {formData.governote?.length > 0 && (
            <div className="mt-3">
              <div className="flex flex-wrap gap-2">
                {formData.governote.map((status, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                  >
                    {status}
                    <button
                      type="button"
                      onClick={() => removeGoverNote(status)}
                      className="text-blue-600 hover:text-blue-800 text-lg leading-none"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
          {/* <select
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
            </select> */}
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
                  : 'قم بالإختيار'}
              </span>
              <svg
                className={`w-5 h-5 text-gray-400 transition-transform ${projectCheck ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
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
                    ?.filter((item) =>
                      item.projectName
                        .toLowerCase()
                        .includes(projectSearch.toLowerCase()),
                    )
                    ?.map((item) => {
                      const isSelected = formData.project?.includes(
                        item.projectName,
                      );
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
                          <span className="text-sm font-medium">
                            {item.projectName}
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

   <div className="mb-6 flex flex-col gap-2">
          <label className="w-full text-lg font-medium text-black dark:text-white">
           اليه الدفع*
          </label>

          <div className="relative">
            <button
              type="button"
              onClick={() => setStatutsCashOption(!stautsCashOption)}
              className="w-full text-right p-3 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent flex justify-between items-center"
            >
              <span className="text-gray-500">
                {formData.cashOption?.length > 0
                  ? `تم اختيار ${formData.cashOption.length} عنصر`
                  : 'قم بالإختيار'}
              </span>
              <svg
                className={`w-5 h-5 text-gray-400 transition-transform ${stautsCashOption ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {stautsCashOption && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                <div className="p-2 border-b border-gray-200">
                  <input
                    type="text"
                    placeholder="ابحث..."
                    value={SearchCashoption}
                    onChange={(e) => setSearchCashoption(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="py-1">
                  {chasOptionsFields
                    ?.filter((item) =>
                      item
                        .toLowerCase()
                        .includes(SearchCashoption.toLowerCase()),
                    )
                    ?.map((item) => {
                      const isSelected = formData.cashOption?.includes(
                        item,
                      );
                      return (
                        <div
                          key={item._id}
                          onClick={() => toggleCashOption(item)}
                          className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-colors ${
                            isSelected
                              ? 'bg-blue-50 text-blue-700'
                              : 'hover:bg-gray-50 text-gray-700'
                          }`}
                        >
                          <span className="text-sm font-medium">
                            {item}
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

                <div className="px-4 py-2 border-t border-gray-200 bg-gray-50">
                  <p className="text-sm text-gray-600">
                    {formData.cashOption?.length || 0} عنصر مختار
                  </p>
                </div>
              </div>
            )}
          </div>

          {formData.cashOption?.length > 0 && (
            <div className="mt-3">
              <div className="flex flex-wrap gap-2">
                {formData.cashOption.map((project, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                  >
                    {project}
                    <button
                      type="button"
                      onClick={() => removecashOption(project)}
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
            htmlFor="clientendRequr"
            className="w-full text-lg font-medium text-black dark:text-white"
          >
            أخر ماتم التواصل{' '}
          </label>
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
           <div className="mb-6 flex flex-col gap-2">
          <label className="w-full text-lg font-medium text-black dark:text-white">
             المنطقة *
          </label>

          {/* Custom Multi-Select Dropdown */}
          <div className="relative">
            {/* Select Button */}
            <button
              type="button"
              onClick={() => setRequireoredrlOcationstauts(!RequireOrderLocationStauts)}
              className="w-full text-right p-3 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent flex justify-between items-center"
            >
              <span className="text-gray-500">
                {formData.rquireLocation?.length > 0
                  ? `تم اختيار ${formData.rquireLocation.length} عنصر`
                  : 'قم بالإختيار'}
              </span>
              <svg
                className={`w-5 h-5 text-gray-400 transition-transform ${RequireOrderLocationStauts ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {RequireOrderLocationStauts && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                {/* Search Input */}
                <div className="p-2 border-b border-gray-200">
                  <input
                    type="text"
                    placeholder="ابحث..."
                    value={searchOrderLocation}
                    onChange={(e) => setSearchOrderlocation(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {/* Options List */}
                <div className="py-1">
                  {locations?.data?.data
                    ?.filter((item) =>
                      item.name
                        .toLowerCase()
                        .includes(searchOrderLocation.toLowerCase()),
                    )
                    ?.map((item) => {
                      const isSelected = formData.rquireLocation?.includes(
                        item.name,
                      );
                      return (
                        <div
                          key={item._id}
                          onClick={() => togglerequireRegion(item.name)}
                          className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-colors ${
                            isSelected
                              ? 'bg-blue-50 text-blue-700'
                              : 'hover:bg-gray-50 text-gray-700'
                          }`}
                        >
                          <span className="text-sm font-medium">
                            {item.name}
                          </span>

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
                    {formData.rquireLocation?.length || 0} عنصر مختار
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Selected Items Tags */}
          {formData.rquireLocation?.length > 0 && (
            <div className="mt-3">
              <div className="flex flex-wrap gap-2">
                {formData.rquireLocation.map((status, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                  >
                    {status}
                    <button
                      type="button"
                      onClick={() => removerequireRegion(status)}
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
        {/* موقع العقار */}
      

        {/* منطقة العقار */}
          <div className="flex flex-col gap-2">
          <label className="font-medium"> الموقع*</label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setRegionOrderStauts(!regionOrderStauts)}
              className="w-full text-right p-3 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent flex justify-between items-center"
            >
              <span className="text-gray-500">
                {formData.requireRegion?.length > 0
                  ? `تم اختيار ${formData.requireRegion.length} عنصر`
                  : 'قم بالإختيار'}
              </span>
              <svg
                className={`w-5 h-5 text-gray-400 transition-transform ${regionOrderStauts ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {regionOrderStauts && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                <div>
                  <input
                    type="text"
                    placeholder="ابحث ..."
                    value={searchRegionOrder}
                    onChange={(e) => setSearchRegionOrder(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  {relatedRegions
                    ?.filter((item) =>
                      item
                        ?.toLowerCase()
                        ?.includes(searchRegionOrder.toLowerCase()),
                    )
                    ?.map((item) => {
                      const isSelected = formData.requireRegion.includes(item);
                      return (
                        <div
                          key={item}
                          onClick={() => TogalerequireregionOrder(item)}
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
              </div>
            )}
          </div>
          {formData.requireRegion?.length > 0 && (
            <div className="mt-3">
              <div className="flex flex-wrap gap-2">
                {formData.requireRegion.map((status, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                  >
                    {status}
                    <button
                      type="button"
                      onClick={() => removereguireregionOrder(status)}
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
             نوع العقار *
          </label>

          {/* Custom Multi-Select Dropdown */}
          <div className="relative">
            {/* Select Button */}
            <button
              type="button"
              onClick={() => setRequireOrderStauts(!requireOrderStauts)}
              className="w-full text-right p-3 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent flex justify-between items-center"
            >
              <span className="text-gray-500">
                {formData.require?.length > 0
                  ? `تم اختيار ${formData.require.length} عنصر`
                  : 'قم بالإختيار'}
              </span>
              <svg
                className={`w-5 h-5 text-gray-400 transition-transform ${requireOrderStauts ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {requireOrderStauts && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                {/* Search Input */}
                <div className="p-2 border-b border-gray-200">
                  <input
                    type="text"
                    placeholder="ابحث..."
                    value={searchRequireOrder}
                    onChange={(e) => setRequireOrderSearch(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {/* Options List */}
                <div className="py-1">
                  {data?.data?.data
                    ?.filter((item) =>
                      item.name
                        .toLowerCase()
                        .includes(searchRequireOrder.toLowerCase()),
                    )
                    ?.map((item) => {
                      const isSelected = formData.require?.includes(
                        item.name,
                      );
                      return (
                        <div
                          key={item._id}
                          onClick={() => togglerequireOrder(item.name)}
                          className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-colors ${
                            isSelected
                              ? 'bg-blue-50 text-blue-700'
                              : 'hover:bg-gray-50 text-gray-700'
                          }`}
                        >
                          <span className="text-sm font-medium">
                            {item.name}
                          </span>

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
                    {formData.require?.length || 0} عنصر مختار
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Selected Items Tags */}
          {formData.require?.length > 0 && (
            <div className="mt-3">
              <div className="flex flex-wrap gap-2">
                {formData.require.map((status, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                  >
                    {status}
                    <button
                      type="button"
                      onClick={() => removererequireOrder(status)}
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

        {/* نوع العقار */}
        {/* <div className="flex flex-col gap-2">
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
        </div> */}

   <div className="flex flex-col gap-2">
          <label className="font-medium"> وصف العقار*</label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setRequireTypeOrderStauts(!requireTypeOrderStauts)}
              className="w-full text-right p-3 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent flex justify-between items-center"
            >
              <span className="text-gray-500">
                {formData.requireType?.length > 0
                  ? `تم اختيار ${formData.requireType.length} عنصر`
                  : 'قم بالإختيار'}
              </span>
              <svg
                className={`w-5 h-5 text-gray-400 transition-transform ${requireTypeOrderStauts ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {requireTypeOrderStauts && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                <div>
                  <input
                    type="text"
                    placeholder="ابحث ..."
                    value={requireTypeOrderSearch}
                    onChange={(e) => setRequireTypeOrderSearch(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  {Typesy
                    ?.filter((item) =>
                      item
                        ?.toLowerCase()
                        ?.includes(requireTypeOrderSearch.toLowerCase()),
                    )
                    ?.map((item) => {
                      const isSelected = formData.requireType.includes(item);
                      return (
                        <div
                          key={item}
                          onClick={() => TogalerequireTypeOrder(item)}
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
              </div>
            )}
          </div>
          {formData.requireType?.length > 0 && (
            <div className="mt-3">
              <div className="flex flex-wrap gap-2">
                {formData.requireType.map((status, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                  >
                    {status}
                    <button
                      type="button"
                      onClick={() => removerequireTypeOrder(status)}
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
        {/* وصف العقار */}
        {/* <div className="flex flex-col gap-2">
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
        </div> */}

      </div>
    </div>
  );
};

export default AdvancedFilter;
