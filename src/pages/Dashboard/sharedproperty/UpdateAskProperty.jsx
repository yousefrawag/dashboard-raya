import React, { useState, useEffect } from 'react';
import { NavLink, useParams, useNavigate } from 'react-router-dom';
import { FaRegPenToSquare } from 'react-icons/fa6';
import { FiPlus } from 'react-icons/fi';
import { FaSpinner } from 'react-icons/fa';
import useQueryupdate from '../../../services/useQueryupdate';
import useQuerygetSpacficIteam from '../../../services/QuerygetSpacficIteam';
import useQuerygetiteams from '../../../services/Querygetiteams';
import vactor from "../../../images/icon/vactor.svg";
import vactor2 from "../../../images/icon/Group.svg";
import UpoladFiles from "../../../hooks/UpoladFiles";
import toast from 'react-hot-toast';

const UpdateSharedProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoading: loaddingUpdate, updateiteam } = useQueryupdate("sharedProperty", "sharedProperty");
  const { isLoading, data } = useQuerygetSpacficIteam("sharedProperty", "sharedProperty", id);
  const { data: propertesTypes } = useQuerygetiteams("region", "region");
  const { data: propertieRegions } = useQuerygetiteams("location", "location");
  const { data: PropertiesStauts } = useQuerygetiteams("projectStatuts", "projectStatuts");

  // Form state
  const [formData, setFormData] = useState({
    client: {
      fullName: '',
      email: '',
      phone: '',
      company: '',
    },
    project: {
      estateType: '',
      governoate: '',
      city: '',
      projectSatatus: '',
      operationType: '',
      areaMatter: '',
      internalArea: '',
      spaceOuteside: '',
      typeOfSpaceoutside: '',
      installments: '',
      estatePrice: '',
      materPriec: '',
      installmentsFirstPyment: '',
      plotNumber: '',
      basinNumber: '',
      projectDetails: '',
      imagesURLs: [],
    },
  });

  const [images_video, setImagesVideo] = useState([]);
  const [docs, setDocs] = useState([]);
  const [viewmenu, setViewmenu] = useState(false);
  const [error, setError] = useState('');
  
  // حالة لتخزين الصور الموجودة مع إمكانية الحذف
  const [existingImages, setExistingImages] = useState([]);

  // عند تحميل البيانات، قم بملء النموذج
  useEffect(() => {
    if (data?.data) {
      const item = data.data;
      setFormData({
        client: {
          fullName: item.client?.fullName || '',
          email: item.client?.email || '',
          phone: item.client?.phone || '',
          company: item.client?.company || '',
        },
        project: {
          estateType: item.project?.estateType || '',
          governoate: item.project?.governoate || '',
          city: item.project?.city || '',
          projectSatatus: item.project?.projectSatatus || '',
          operationType: item.project?.operationType || '',
          areaMatter: item.project?.areaMatter || '',
          internalArea: item.project?.internalArea || '',
          spaceOuteside: item.project?.spaceOuteside || '',
          typeOfSpaceoutside: item.project?.typeOfSpaceoutside || '',
          installments: item.project?.installments || '',
          estatePrice: item.project?.estatePrice || '',
          materPriec: item.project?.materPriec || '',
          installmentsFirstPyment: item.project?.installmentsFirstPyment || '',
          plotNumber: item.project?.plotNumber || '',
          basinNumber: item.project?.basinNumber || '',
          projectDetails: item.project?.projectDetails || '',
          imagesURLs: item.project?.imagesURLs || [],
        },
      });
      
      // تعيين الصور الموجودة
      if (item.project?.imagesURLs && item.project.imagesURLs.length > 0) {
        setExistingImages(item.project.imagesURLs);
      }
    }
  }, [data]);

  // Handle text/select changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    const [section, field] = name.split('.');

    if (error) setError('');

    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  // Handle file changes
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setImagesVideo((prev) => [...prev, ...selectedFiles]);
    e.target.value = "";
  };

  const handleDocChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setDocs((prev) => [...prev, ...selectedFiles]);
    e.target.value = "";
  };

  // حذف صورة موجودة
  const removeExistingImage = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Generate down payment options
  const downPaymentOptions = [];
  for (let i = 100000; i <= 700000; i += 50000) {
    downPaymentOptions.push(i);
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const formDataWithfile = new FormData();

    // Validation
    if (!formData.client.fullName.trim()) {
      setError('يرجى إدخال الاسم الكامل');
      return;
    }
    if (!formData.client.email.trim()) {
      setError('يرجى إدخال البريد الإلكتروني');
      return;
    }
    if (!formData.client.phone.trim()) {
      setError('يرجى إدخال رقم الجوال');
      return;
    }
    if (!formData.project.operationType) {
      setError('يرجى اختيار نوع الطلب');
      return;
    }
    if (!formData.project.estateType) {
      setError('يرجى اختيار نوع العقار');
      return;
    }
    if (!formData.project.governoate) {
      setError('يرجى اختيار المنطقة');
      return;
    }
    if (!formData.project.city.trim()) {
      setError('يرجى إدخال المدينة والعنوان التفصيلي');
      return;
    }
    if (!formData.project.projectSatatus) {
      setError('يرجى اختيار حالة العقار');
      return;
    }
    if (!formData.project.areaMatter) {
      setError('يرجى إدخال المساحة الكلية');
      return;
    }
    if (!formData.project.projectDetails.trim()) {
      setError('يرجى إدخال وصف المشروع');
      return;
    }
    if (!formData.project.installments) {
      setError('يرجى تحديد هل العقار متوفر بالتقسيط أم لا');
      return;
    }

    try {
      // Prepare payload - دمج الصور الموجودة مع الصور الجديدة
      const allImages = [...existingImages];
      
      // تحويل الملفات الجديدة إلى كائنات { fileURL, fileID } مؤقتاً
      // سيتم رفعها في الباك إند
      const newFiles = [...images_video, ...docs];
      
      const payload = {
        client: formData.client,
        project: {
          ...formData.project,
          imagesURLs: allImages, // الصور الموجودة + سيتم إضافة الجديدة في الباك إند
        },
      };

      // إضافة البيانات النصية
      formDataWithfile.append("data", JSON.stringify(payload));
      
      // إضافة الملفات الجديدة
      if (newFiles.length > 0 && newFiles[0] instanceof File) {
        newFiles.forEach((file) => formDataWithfile.append('files', file));
      }

      // إرسال للتحديث
      updateiteam(
        { id, data: formDataWithfile },
        {
          onSuccess: () => {
            toast.success("تم تحديث طلب المشروع بنجاح");
            navigate("/sharedProperty");
          },
          onError: (err) => {
            setError(err?.response?.data?.error || 'حدث خطأ أثناء التحديث');
          }
        }
      );

      // Reset form on success (سيتم تنفيذها في onSuccess)
      setImagesVideo([]);
      setDocs([]);
    } catch (err) {
      console.error('Submission error:', err);
      setError(err?.response?.data?.error || 'حدث خطأ أثناء الإرسال');
    }
  };

  // إذا كان جاري التحميل
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <FaSpinner className="animate-spin text-main text-4xl" />
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className='w-full h-full bg-white rounded-[10px] dark:bg-form-input'
    >
      {/* Header */}
      <div className="dark:bg-form-input flex items-center shadow-lg gap-4 mb-4 w-full h-full p-4 bg-white rounded-[10px]">
        <div className="icon p-2 bg-main rounded-full">
          <FaRegPenToSquare className="text-white" />
        </div>
        <p className="font-semibold text-lg">تعديل طلب عقار</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mx-4 mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className='main-section w-full max-h-[600px] min-h-[100px] p-4 overflow-auto'>
        {/* ===== Client Section ===== */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 border-b pb-2">
            بيانات العميل
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="w-full text-sm font-medium text-black dark:text-white">
                الاسم الكامل *
              </label>
              <input
                type="text"
                name="client.fullName"
                value={formData.client.fullName}
                onChange={handleChange}
                className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full outline-0 rounded-md border border-gray-300 shadow-sm"
                placeholder="أدخل الاسم الكامل"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="w-full text-sm font-medium text-black dark:text-white">
                البريد الإلكتروني *
              </label>
              <input
                type="email"
                name="client.email"
                value={formData.client.email}
                onChange={handleChange}
                className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full outline-0 rounded-md border border-gray-300 shadow-sm"
                placeholder="example@domain.com"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="w-full text-sm font-medium text-black dark:text-white">
                رقم الجوال *
              </label>
              <input
                type="tel"
                name="client.phone"
                value={formData.client.phone}
                onChange={handleChange}
                className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full outline-0 rounded-md border border-gray-300 shadow-sm"
                placeholder="05xxxxxxxx"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="w-full text-sm font-medium text-black dark:text-white">
                اسم الشركة (اختياري)
              </label>
              <input
                type="text"
                name="client.company"
                value={formData.client.company}
                onChange={handleChange}
                className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full outline-0 rounded-md border border-gray-300 shadow-sm"
                placeholder="اسم الشركة"
              />
            </div>
          </div>
        </div>

        {/* ===== Property Section ===== */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 border-b pb-2">
            تفاصيل العقار
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="w-full text-sm font-medium text-black dark:text-white">
                نوع الطلب *
              </label>
              <select
                name="project.operationType"
                value={formData.project.operationType}
                onChange={handleChange}
                className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full outline-0 rounded-md border border-gray-300 shadow-sm"
              >
                <option value="">اختر نوع الطلب</option>
                <option value="بيع">بيع</option>
                <option value="ايجار">ايجار</option>
                <option value="استثمار">استثمار</option>
                <option value="ضمان">ضمان</option>
                <option value="تبديل">تبديل</option>
                <option value="تسويق">تسويق</option>
                <option value="استشاره هندسيه">استشاره هندسيه</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="w-full text-sm font-medium text-black dark:text-white">
                نوع العقار *
              </label>
              <select
                name="project.estateType"
                value={formData.project.estateType}
                onChange={handleChange}
                className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full outline-0 rounded-md border border-gray-300 shadow-sm"
              >
                <option value="">اختر نوع العقار</option>
                {propertesTypes?.data?.data?.map((item) => (
                  <option key={item._id} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="w-full text-sm font-medium text-black dark:text-white">
                المنطقة *
              </label>
              <select
                name="project.governoate"
                value={formData.project.governoate}
                onChange={handleChange}
                className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full outline-0 rounded-md border border-gray-300 shadow-sm"
              >
                <option value="">اختر المنطقة</option>
                {propertieRegions?.data?.data?.map((item) => (
                  <option key={item._id} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="w-full text-sm font-medium text-black dark:text-white">
                المدينة (العنوان التفصيلي) *
              </label>
              <input
                type="text"
                name="project.city"
                value={formData.project.city}
                onChange={handleChange}
                className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full outline-0 rounded-md border border-gray-300 shadow-sm"
                placeholder="المدينة، الحي، الشارع"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="w-full text-sm font-medium text-black dark:text-white">
                رقم القطعة
              </label>
              <input
                type="text"
                name="project.plotNumber"
                value={formData.project.plotNumber}
                onChange={handleChange}
                className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full outline-0 rounded-md border border-gray-300 shadow-sm"
                placeholder="رقم القطعة"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="w-full text-sm font-medium text-black dark:text-white">
                رقم الحوض
              </label>
              <input
                type="text"
                name="project.basinNumber"
                value={formData.project.basinNumber}
                onChange={handleChange}
                className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full outline-0 rounded-md border border-gray-300 shadow-sm"
                placeholder="رقم الحوض"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="w-full text-sm font-medium text-black dark:text-white">
                حالة العقار *
              </label>
              <select
                name="project.projectSatatus"
                value={formData.project.projectSatatus}
                onChange={handleChange}
                className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full outline-0 rounded-md border border-gray-300 shadow-sm"
              >
                <option value="">اختر الحالة</option>
                {PropertiesStauts?.data?.data?.map((item) => (
                  <option key={item._id} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="w-full text-sm font-medium text-black dark:text-white">
                المساحة الكلية (م²) *
              </label>
              <input
                type="text"
                name="project.areaMatter"
                value={formData.project.areaMatter}
                onChange={handleChange}
                className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full outline-0 rounded-md border border-gray-300 shadow-sm"
                placeholder="مثال: 150"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="w-full text-sm font-medium text-black dark:text-white">
                المساحة الداخلية (م²)
              </label>
              <input
                type="text"
                name="project.internalArea"
                value={formData.project.internalArea}
                onChange={handleChange}
                className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full outline-0 rounded-md border border-gray-300 shadow-sm"
                placeholder="مثال: 120"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="w-full text-sm font-medium text-black dark:text-white">
                المساحة الخارجية (م²)
              </label>
              <input
                type="text"
                name="project.spaceOuteside"
                value={formData.project.spaceOuteside}
                onChange={handleChange}
                className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full outline-0 rounded-md border border-gray-300 shadow-sm"
                placeholder="مثال: 30"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="w-full text-sm font-medium text-black dark:text-white">
                نوع المساحة الخارجية
              </label>
              <select
                name="project.typeOfSpaceoutside"
                value={formData.project.typeOfSpaceoutside}
                onChange={handleChange}
                className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full outline-0 rounded-md border border-gray-300 shadow-sm"
              >
                <option value="">اختر النوع</option>
                <option value="حديقة">حديقة</option>
                <option value="حديقة مبلطة">حديقة مبلطة</option>
                <option value="تراس">تراس</option>
              </select>
            </div>

            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="w-full text-sm font-medium text-black dark:text-white">
                وصف المشروع *
              </label>
              <textarea
                name="project.projectDetails"
                value={formData.project.projectDetails}
                onChange={handleChange}
                rows="4"
                className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full outline-0 rounded-md border border-gray-300 shadow-sm"
                placeholder="اكتب وصفاً مفصلاً عن المشروع، مميزاته، موقعه، وما يميزه"
              />
            </div>
          </div>
        </div>

        {/* ===== Financial Section ===== */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 border-b pb-2">
            البيانات المالية
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="w-full text-sm font-medium text-black dark:text-white">
                هل متوفر تقسيط؟ *
              </label>
              <select
                name="project.installments"
                value={formData.project.installments}
                onChange={handleChange}
                className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full outline-0 rounded-md border border-gray-300 shadow-sm"
              >
                <option value="">اختر</option>
                <option value="نعم">نعم</option>
                <option value="لا">لا</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="w-full text-sm font-medium text-black dark:text-white">
                السعر الإجمالي
              </label>
              <input
                type="number"
                name="project.estatePrice"
                value={formData.project.estatePrice}
                onChange={handleChange}
                className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full outline-0 rounded-md border border-gray-300 shadow-sm"
                placeholder="السعر الإجمالي للعقار"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="w-full text-sm font-medium text-black dark:text-white">
                سعر المتر
              </label>
              <input
                type="number"
                name="project.materPriec"
                value={formData.project.materPriec}
                onChange={handleChange}
                className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full outline-0 rounded-md border border-gray-300 shadow-sm"
                placeholder="سعر المتر المربع"
              />
            </div>
            {formData.project.installments === "نعم" && (
              <div className="flex flex-col gap-2">
                <label className="w-full text-sm font-medium text-black dark:text-white">
                  الدفعة الأولى
                </label>
                <select
                  name="project.installmentsFirstPyment"
                  value={formData.project.installmentsFirstPyment}
                  onChange={handleChange}
                  className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full outline-0 rounded-md border border-gray-300 shadow-sm"
                >
                  <option value="">اختر المبلغ (اختياري)</option>
                  {downPaymentOptions.map((val) => (
                    <option key={val} value={val}>
                      {val.toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* ===== Files Upload ===== */}
        <div className="add_files p-4 bg-gray-50 dark:bg-form-input rounded-md">
          {/* عرض الصور الموجودة */}
          {existingImages.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-semibold text-slate-700 mb-2">الصور الحالية:</p>
              <div className="flex flex-wrap gap-3">
                {existingImages.map((img, idx) => (
                  <div key={idx} className="relative group">
                    <img
                      src={img.fileURL}
                      alt={`صورة ${idx + 1}`}
                      className="w-20 h-20 object-cover rounded-md border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(idx)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 transition"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="relative inline-block text-left">
            <button
              className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-white bg-main rounded-md"
              type="button"
              onClick={() => setViewmenu(!viewmenu)}
            >
              <div className="flex items-center gap-2">
                <FiPlus /> إضافة مرفقات جديدة
              </div>
            </button>

            {viewmenu && (
              <div
                className="absolute right-0 z-10 w-56 mt-2 bg-white border border-gray-200 rounded-md shadow-lg focus:outline-none"
                role="menu"
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
                  onChange={handleDocChange}
                  accept="application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
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
                  accept="image/png, image/jpeg, image/jpg, video/mp4"
                  multiple
                  className="hidden"
                  id="image-video"
                />
              </div>
            )}
          </div>
          {(images_video.length > 0 || docs.length > 0) && (
            <UpoladFiles
              images={images_video}
              setImages={setImagesVideo}
              docs={docs}
              setDocs={setDocs}
            />
          )}
        </div>
      </div>

      {/* ===== Footer Buttons ===== */}
      <div className="add_return flex justify-between items-center mt-4 shadow-lg p-4 bg-white dark:bg-form-input rounded-[10px]">
        <div className="add_btn">
          <button
            type="submit"
            disabled={loaddingUpdate || isLoading}
            className="py-2 px-6 rounded-md bg-main text-white hover:bg-transparent hover:border hover:border-main hover:text-main transition flex items-center gap-2 disabled:opacity-70"
          >
            {loaddingUpdate ? (
              <>
                <FaSpinner className="animate-spin" />
                جاري التحديث...
              </>
            ) : (
              'تحديث'
            )}
          </button>
        </div>
        <div className="return_btn">
          <NavLink
            to="/sharedProperty"
            className="bg-gray-300 text-gray-700 py-2 px-6 rounded-md hover:bg-gray-400 transition"
          >
            عوده
          </NavLink>
        </div>
      </div>
    </form>
  );
};

export default UpdateSharedProperty;