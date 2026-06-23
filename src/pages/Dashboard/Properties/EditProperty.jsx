import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiArrowRight, FiSave, FiPlus, FiTrash2 } from 'react-icons/fi';

import useQuerygetiteams from '../../../services/Querygetiteams';
import useQuerygetSpacficIteam from '../../../services/QuerygetSpacficIteam';
import useQueryupdate from '../../../services/useQueryupdate';
import toast from 'react-hot-toast';

const EditProperty = () => {
  const { id, propertyId } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const { data, isLoading } = useQuerygetSpacficIteam(
    `projects/property/${id}`,
    `projects/property/${id}`,
    propertyId,
  );

  const { updateiteam, isLoading: updateLoading } = useQueryupdate(
    `projects/property/${id}`,
    `projects/property/${id}`,
  );

  const { data: projects } = useQuerygetiteams('projects', 'projects');
  const { data: regionData } = useQuerygetiteams('region', 'region');
  const { data: propertySatuts } = useQuerygetiteams('propertySatuts', 'propertySatuts');
  const { data: floorNumbers } = useQuerygetiteams('FloorNumber', 'FloorNumber');
  const { data: monthPayments } = useQuerygetiteams('monthPayment', 'monthPayment');
  const { data: FirstPayments } = useQuerygetiteams('firstpayment', 'firstpayment');
  const { data: PropertyArea } = useQuerygetiteams('arae', 'arae');
const {data:customers} = useQuerygetiteams("customers" , "customers")
const [selectedCustomers, setSelectedCustomers] = useState([]);
const [search, setSearch] = useState(""); // Search input state
const [Customers , setCustomers] = useState()

  const empty = {
    projectId: '',
  
    floorType: '',
    floorTypeFlow: '',
    floorNumber: '',
    floor: '',
    rooms: '',
    bathrooms: '',
    area: '',
    areaOutside: '',
    areaTarth: '',
    areaBark: '',
    price: '',
    downPayment: '',
    monthlyInstallment: '',
    propertyStatus: '',
    FloorDetails: '',
    propertyNote: '',
    imagesURLs: [],
  };

  const [form, setForm] = useState(empty);
  const [oldImages, setOldImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [relatedRegion, setRelatedRegion] = useState([]);

  // Cleanup function for object URLs
  useEffect(() => {
    return () => {
      newImages.forEach(img => {
        if (img.preview) URL.revokeObjectURL(img.preview);
      });
    };
  }, [newImages]);

  useEffect(() => {
    const p = data?.property;
    if (!p) return;

    setForm({
      projectId: data?.project?._id || '',
  
      floorType: p.floorType || '',
      floorTypeFlow: p.floorTypeFlow || '',
      floorNumber: p.floorNumber || '',
      floor: p.floor || '',
      rooms: p.rooms || '',
      bathrooms: p.bathrooms || '',
      area: p.area || '',
      areaOutside: p.areaOutside || '',
      areaTarth: p.areaTarth || '',
      areaBark: p.areaBark || '',
      price: p.price || '',
      downPayment: p.downPayment || '',
      monthlyInstallment: p.monthlyInstallment || '',
      propertyStatus: p.propertyStatus || '',
      FloorDetails: p.FloorDetails || '',
      propertyNote: p.propertyNote || '',
      imagesURLs: [],
    });
setSelectedCustomers(p.customers)
    setOldImages(p.imagesURLs || []);

    const reg = regionData?.data?.data?.find((x) => x.name === p.floorType);
    setRelatedRegion(reg?.relatedRegions || []);
  }, [data, regionData]);

  const changeHandler = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === 'floorType') {
      const reg = regionData?.data?.data?.find((x) => x.name === value);
      setRelatedRegion(reg?.relatedRegions || []);
    }
  };

  const uploadImages = (e) => {
    const files = Array.from(e.target.files);
    
    const imgs = files.map((file) => ({
      file: file,
      preview: URL.createObjectURL(file),
      id: Math.random().toString(36).substr(2, 9),
    }));

    setNewImages(prev => [...prev, ...imgs]);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeNewImage = (id) => {
    setNewImages(prev => {
      const imgToRemove = prev.find(img => img.id === id);
      if (imgToRemove?.preview) {
        URL.revokeObjectURL(imgToRemove.preview);
      }
      return prev.filter(img => img.id !== id);
    });
  };
    const filteredUsers = Customers?.filter((user) =>
        user?.fullName?.toLowerCase().includes(search.toLowerCase())
      );
    
   const handleUserSelect = (userId) => {
  // Toggle selection
  const newSelected = selectedCustomers.includes(userId)
    ? selectedCustomers.filter((id) => id !== userId)
    : [...selectedCustomers, userId];
  
  setSelectedCustomers(newSelected);
  
  // Update form with the new selection
  setForm((prev) => ({
    ...prev, 
    customers: newSelected // Use the updated array directly
  }));
};
 
useEffect(() => {
    if(customers?.data?.data) {
    
        setCustomers(customers?.data?.data)
    }
} , [customers])

const saveData = () => {
  const fd = new FormData();

  Object.keys(form).forEach((key) => {
    if (key !== 'imagesURLs') {
      if (key === 'customers' && Array.isArray(form[key])) {
        // نضيف كل عنصر كـ value منفصل
        form[key].forEach((customerId) => {
          fd.append('customers[]', customerId); // أو fd.append('customers', customerId)
        });
      } else {
        fd.append(key, form[key] || '');
      }
    }
  });

  // Append new images
  newImages.forEach((img) => {
    if (img.file) {
      fd.append('images', img.file);
    }
  });

  updateiteam({
    id: propertyId,
    data: fd,
  }, {
    onSuccess: () => {
      toast.success("تم تعديل الشقة");
      return navigate("/projects/properties");
    }
  });
};

  const selectStyle =
    'h-14 rounded-2xl border border-gray-200 px-4 bg-gray-50 outline-none focus:ring-2 focus:ring-purple-300 w-full';

  if (isLoading) return <div className="flex justify-center items-center h-64">جاري التحميل...</div>;

  return (
    <div className="space-y-8 pb-20">
      <div className="bg-white rounded-3xl shadow border p-6">
        <button
          onClick={() => navigate(-1)}
          className="flex gap-2 text-purple-600 mb-3 items-center"
        >
          <FiArrowRight />
          رجوع
        </button>

        <h1 className="text-3xl font-bold">تعديل الشقة</h1>
      </div>

      <div className="bg-white rounded-3xl shadow border p-7">
        <div className="grid md:grid-cols-3 gap-5">

          {/* المشروع */}
          {/* <div>
            <label className="block mb-2 text-gray-700">المشروع</label>
            <select
              name="projectId"
              value={form.projectId}
              onChange={changeHandler}
              className={selectStyle}
            >
              <option value="">اختر المشروع</option>
              {projects?.data?.data?.map((x) => (
                <option key={x._id} value={x._id}>
                  {x.projectName}
                </option>
              ))}
            </select>
          </div> */}
   <div>
            <label className="block mb-2 text-gray-700"> المشروع</label>
         <span  className='h-14 rounded-2xl border border-gray-200 p-5 bg-gray-50 block w-full'
 >{
            data?.project?.projectName
            }</span>
          </div>
          {/* نوع العقار */}
          <div>
            <label className="block mb-2 text-gray-700">نوع العقار</label>
            <select
              name="floorType"
              value={form.floorType}
              onChange={changeHandler}
              className={selectStyle}
            >
              <option value="">اختر</option>
              {regionData?.data?.data?.map((x) => (
                <option key={x._id} value={x.name}>
                  {x.name}
                </option>
              ))}
            </select>
          </div>

          {/* التابع */}
          <div>
            <label className="block mb-2 text-gray-700">التابع</label>
            <select
              name="floorTypeFlow"
              value={form.floorTypeFlow}
              onChange={changeHandler}
              className={selectStyle}
            >
              <option value="">اختر</option>
              {relatedRegion.map((x, i) => (
                <option key={i} value={x}>
                  {x}
                </option>
              ))}
            </select>
          </div>
 {/* propertyStatus */}
          <div>
            <label className="block mb-2 text-gray-700">الحالة</label>
            <select
              name="propertyStatus"
              value={form.propertyStatus}
              onChange={changeHandler}
              className={selectStyle}
            >
              <option value="">اختر</option>
              {propertySatuts?.data?.data?.map((x) => (
                <option key={x._id} value={x.name}>
                  {x.name}
                </option>
              ))}
            </select>
          </div>
     
            {
            <div className="mb-6 flex flex-col gap-2">
                            <label className="w-full text-lg font-medium text-black dark:text-white">
                        العملاء المعنيون بالشقة
                            </label>
                            <input
                            type="text"
                            placeholder="بحث عن عميل..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
              className="h-14 rounded-2xl border border-gray-200 px-4 outline-none focus:ring-2 focus:ring-main"
                            />
                            {
                             search ?
                              <div className="border border-gray-300 rounded-md max-h-40 overflow-y-auto p-2">
                            {filteredUsers?.map((user) => (
                                <label key={user?._id} className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    value={user?._id}
                                    checked={selectedCustomers.includes(user?._id)}
                                    onChange={() => handleUserSelect(user?._id)}
                                    className="accent-main"
                                />
                                <span className="text-black dark:text-white">{user?.fullName}</span>
                                </label>
                            ))}
                            </div> : null
                            }
                          
                    </div>
          }

          {/* floorNumber - Select */}
          <div>
            <label className="block mb-2 text-gray-700">رقم الشقة</label>
            <select
              name="floorNumber"
              value={form.floorNumber}
              onChange={changeHandler}
              className={selectStyle}
            >
              <option value="">اختر</option>
              {floorNumbers?.data?.data?.map((x) => (
                <option key={x._id} value={x.name}>
                  {x.name}
                </option>
              ))}
            </select>
          </div>

          {/* floor - Select */}
          <div>
            <label className="block mb-2 text-gray-700">الدور</label>
            <select
              name="floor"
              value={form.floor}
              onChange={changeHandler}
              className={selectStyle}
            >
              <option value="">اختر</option>
              {floorNumbers?.data?.data?.map((x) => (
                <option key={x._id} value={x.name}>
                  {x.name}
                </option>
              ))}
            </select>
          </div>

          {/* area */}
          <div>
            <label className="block mb-2 text-gray-700">المساحة</label>
            <select
              name="area"
              value={form.area}
              onChange={changeHandler}
              className={selectStyle}
            >
              <option value="">اختر</option>
              {PropertyArea?.data?.data?.map((x) => (
                <option key={x._id} value={x.name}>
                  {x.name}
                </option>
              ))}
            </select>
          </div>

          {/* areaOutside */}
          <div>
            <label className="block mb-2 text-gray-700">المساحة الخارجية</label>
            <select
              name="areaOutside"
              value={form.areaOutside}
              onChange={changeHandler}
              className={selectStyle}
            >
              <option value="">اختر</option>
              {PropertyArea?.data?.data?.map((x) => (
                <option key={x._id} value={x.name}>
                  {x.name}
                </option>
              ))}
            </select>
          </div>

          {/* areaTarth */}
          <div>
            <label className="block mb-2 text-gray-700">التراس</label>
            <select
              name="areaTarth"
              value={form.areaTarth}
              onChange={changeHandler}
              className={selectStyle}
            >
              <option value="">اختر</option>
              {PropertyArea?.data?.data?.map((x) => (
                <option key={x._id} value={x.name}>
                  {x.name}
                </option>
              ))}
            </select>
          </div>

          {/* areaBark */}
          <div>
            <label className="block mb-2 text-gray-700">البركة</label>
            <select
              name="areaBark"
              value={form.areaBark}
              onChange={changeHandler}
              className={selectStyle}
            >
              <option value="">اختر</option>
              {PropertyArea?.data?.data?.map((x) => (
                <option key={x._id} value={x.name}>
                  {x.name}
                </option>
              ))}
            </select>
          </div>

          {/* rooms - Select من الداتابيز */}
          <div>
            <label className="block mb-2 text-gray-700">الغرف</label>
            <select
              name="rooms"
              value={form.rooms}
              onChange={changeHandler}
              className={selectStyle}
            >
              <option value="">اختر</option>
              {floorNumbers?.data?.data?.map((x) => (
                <option key={x._id} value={x.name}>
                  {x.name}
                </option>
              ))}
            </select>
          </div>

          {/* bathrooms - Select من الداتابيز */}
          <div>
            <label className="block mb-2 text-gray-700">الحمامات</label>
            <select
              name="bathrooms"
              value={form.bathrooms}
              onChange={changeHandler}
              className={selectStyle}
            >
              <option value="">اختر</option>
              {floorNumbers?.data?.data?.map((x) => (
                <option key={x._id} value={x.name}>
                  {x.name}
                </option>
              ))}
            </select>
          </div>

         

          {/* price */}
          <div>
            <label className="block mb-2 text-gray-700">السعر الكلي</label>
            <input
              name="price"
              value={form.price}
              onChange={changeHandler}
              className={selectStyle}
            />
          </div>

          {/* downPayment */}
          <div>
            <label className="block mb-2 text-gray-700">الدفعة الأولى</label>
            <select
              name="downPayment"
              value={form.downPayment}
              onChange={changeHandler}
              className={selectStyle}
            >
              <option value="">اختر</option>
              {FirstPayments?.data?.data?.map((x) => (
                <option key={x._id} value={x.name}>
                  {x.name}
                </option>
              ))}
            </select>
          </div>

          {/* monthlyInstallment */}
          <div>
            <label className="block mb-2 text-gray-700">القسط الشهري</label>
            <select
              name="monthlyInstallment"
              value={form.monthlyInstallment}
              onChange={changeHandler}
              className={selectStyle}
            >
              <option value="">اختر</option>
              {monthPayments?.data?.data?.map((x) => (
                <option key={x._id} value={x.name}>
                  {x.name}
                </option>
              ))}
            </select>
          </div>

        </div>

        <textarea
          name="FloorDetails"
          value={form.FloorDetails}
          onChange={changeHandler}
          className="w-full mt-5 border rounded-2xl p-4 h-32 outline-none focus:ring-2 focus:ring-purple-300"
          placeholder="تفاصيل الشقة"
        />

        <textarea
          name="propertyNote"
          value={form.propertyNote}
          onChange={changeHandler}
          className="w-full mt-5 border rounded-2xl p-4 h-32 outline-none focus:ring-2 focus:ring-purple-300"
          placeholder="ملاحظات"
        />

        <label className="mt-5 inline-flex bg-purple-600 text-white px-5 py-3 rounded-xl cursor-pointer gap-2 items-center hover:bg-purple-700 transition">
          <FiPlus />
          إضافة صور جديدة
          <input 
            ref={fileInputRef}
            hidden 
            type="file" 
            multiple 
            accept="image/*"
            onChange={uploadImages} 
          />
        </label>

        {/* عرض الصور */}
        <div className="mt-5">
          <h3 className="text-lg font-semibold mb-3">الصور</h3>
          <div className="flex flex-wrap gap-4">
            {/* الصور القديمة */}
            {oldImages.map((img, i) => (
              <div key={`old-${i}`} className="relative group">
                <img
                  src={img.fileURL || img.url || img}
                  alt={`صورة ${i + 1}`}
                  className="w-28 h-28 rounded-xl object-cover border-2 border-gray-200"
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTEyIiBoZWlnaHQ9IjExMiIgdmlld0JveD0iMCAwIDExMiAxMTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjExMiIgaGVpZ2h0PSIxMTIiIGZpbGw9IiNFNUU3RUIiLz48dGV4dCB4PSI1NiIgeT0iNTYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjOUZBM0E4IiBmb250LXNpemU9IjE0Ij5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=';
                  }}
                />
                <span className="absolute top-1 left-1 bg-gray-800 text-white text-xs px-2 py-1 rounded-full opacity-75">
                  قديمة
                </span>
              </div>
            ))}

            {/* الصور الجديدة */}
            {newImages.map((img) => (
              <div key={img.id} className="relative group">
                <img
                  src={img.preview}
                  alt="صورة جديدة"
                  className="w-28 h-28 rounded-xl object-cover border-2 border-green-400"
                />
                <button
                  type="button"
                  onClick={() => removeNewImage(img.id)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition shadow-lg opacity-0 group-hover:opacity-100"
                  title="حذف الصورة"
                >
                  <FiTrash2 size={14} />
                </button>
                <span className="absolute bottom-1 left-1 bg-green-600 text-white text-xs px-2 py-1 rounded-full opacity-75">
                  جديدة
                </span>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={saveData}
          disabled={updateLoading}
          className="mt-8 bg-green-600 text-white px-10 py-4 rounded-2xl flex gap-2 items-center hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FiSave />
          {updateLoading ? 'جاري الحفظ...' : 'حفظ التعديل'}
        </button>
      </div>
    </div>
  );
};

export default EditProperty;