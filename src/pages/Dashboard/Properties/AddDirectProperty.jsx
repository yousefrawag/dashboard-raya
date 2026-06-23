import React, { useState , useEffect } from 'react';
import useQuerygetiteams from '../../../services/Querygetiteams';
import useQueryadditeam from '../../../services/Queryadditeam';
import { FiPlus, FiTrash2, FiEdit2, FiSave } from 'react-icons/fi';
import Loader from '../../../components/common/Loader';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const AddDirectProperty = () => {
  const { addIteam, isLoading } = useQueryadditeam(
    'projects/properties/create',
    'projects/properties/create',
  );

  const { data: projects } = useQuerygetiteams('projects', 'projects');
  const { data: regionData } = useQuerygetiteams('region', 'region');
    const { data: propertySatuts } = useQuerygetiteams('propertySatuts', 'propertySatuts');
    const {data:floorNumbers} = useQuerygetiteams("FloorNumber", "FloorNumber")
      const {data:monthPayments} = useQuerygetiteams("monthPayment", "monthPayment")
      const {data:FirstPayments} = useQuerygetiteams("firstpayment", "firstpayment")
    const {data:customers} = useQuerygetiteams("customers" , "customers")

    const {data:PropertyArea} = useQuerygetiteams("arae", "arae")
const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [search, setSearch] = useState(""); // Search input state
    const [Customers , setCustomers] = useState()
  const [projectId, setProjectId] = useState('');
  const [relatedRegion , setRelatedRegion] = useState([])
  const navigate = useNavigate();

  const [properties, setProperties] = useState([]);

  const [editIndex, setEditIndex] = useState(null);

  const emptyForm = {
  
    floorType: '',
    floorTypeFlow: '',
    floorNumber: '',
    propertyStatus:"",
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
    FloorDetails: '',
    propertyNote: '',
    imagesURLs: [],
    customers:[]
  };

  const [form, setForm] = useState(emptyForm);

  const inputStyle =
    'w-full rounded-2xl border bg-gray-50 px-4 py-3 outline-none focus:ring-2 focus:ring-purple-300';

  const changeHandler = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,

      [name]: value,
    }));
  if(name === "floorType"){
      const CurrentRegion = regionData?.data?.data?.find((item) => item.name === value)

      if(CurrentRegion){
setRelatedRegion(CurrentRegion?.relatedRegions)

      } else{
        setRelatedRegion([])
      }
      
      
    }
  };

  const uploadImages = (e) => {
    const files = Array.from(e.target.files);

    const previews = files.map((file) => ({
      file,

      preview: URL.createObjectURL(file),
    }));

    setForm((prev) => ({
      ...prev,

      imagesURLs: [...prev.imagesURLs, ...previews],
    }));
  };

  const addProperty = () => {
    // if (!form.unitName) return;

    if (editIndex !== null) {
      let copy = [...properties];

      copy[editIndex] = form;

      setProperties(copy);

      setEditIndex(null);
    } else {
      setProperties((prev) => [...prev, form]);
    }

    setForm(emptyForm);
    setSelectedCustomers([])
  };

  const editProperty = (index) => {
    setForm(properties[index]);

    setEditIndex(index);
  };

  const deleteProperty = (index) => {
    setProperties((prev) => prev.filter((_, i) => i !== index));
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

  if (!projectId) {
    return alert('اختر المشروع');
  }


  const formData = new FormData();


  // project id
  formData.append(
    "projectId",
    projectId
  );


  // properties بدون الصور
  const cleanProperties = properties.map((item) => ({

    ...item,

    imagesURLs: []

  }));



  formData.append(
    "properties",
    JSON.stringify(cleanProperties)
  );



  // رفع صور كل شقة
  properties.forEach((property, index) => {


    property.imagesURLs.forEach((img) => {


      formData.append(
        `propertyImages_${index}`,
        img.file
      );


    });


  });



  addIteam(formData , {
    onSuccess:() => {
      toast.success("تم إضافه الشقق الى المشروع بنجاح")
      return navigate("/projects/properties")
    }
  });

};
 if(isLoading) {
  return <Loader />
 }
  return (
    <div className="space-y-8 pb-20">
      {/* Header */}

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">إضافة شقق مباشرة</h1>

          <p className="text-gray-500 mt-2">إضافة شقق داخل مشروع موجود</p>
        </div>

        <div
          className="
bg-purple-100
text-purple-700
px-5
py-3
rounded-2xl
font-bold
"
        >
          عدد الشقق : {properties.length}
        </div>
      </div>

      {/* Select Project */}

      <div
        className="
bg-white
rounded-[30px]
shadow
border
p-7
"
      >
        <h2 className="font-bold text-xl mb-5">اختيار المشروع</h2>

        <select
          className={inputStyle}
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
        >
          <option value="">اختر المشروع</option>

          {projects?.data?.data?.map((item) => (
            <option key={item._id} value={item._id}>
              {item.projectName}
            </option>
          ))}
        </select>
      </div>

      {/* Form */}

      <div
        className="
bg-white
rounded-[30px]
shadow
border
p-7
"
      >
        <h2 className="text-xl font-bold mb-6">بيانات الشقة</h2>

        <div className="grid md:grid-cols-3 gap-5">
                {/* TYPE */}
          <div className="flex flex-col gap-2">

            <label className="text-sm font-bold text-gray-700">
              نوع العقار
            </label>

            <select
           onChange={changeHandler}
              value={form.floorType || ""}
              name="floorType"
              className="h-14 rounded-2xl border border-gray-200 px-4 outline-none focus:ring-2 focus:ring-main"
            >
              <option value="">اختر النوع</option>

              {regionData?.data?.data?.map((item) => (
                <option
                  key={item._id}
                  value={item.name}
                >
                  {item.name}
                </option>
              ))}
            </select>

          </div>

          {/* RELATED */}
          <div className="flex flex-col gap-2">

            <label className="text-sm font-bold text-gray-700">
              التابع
            </label>

            <select
              name="floorTypeFlow"
              value={form.floorTypeFlow || ""}
              onChange={changeHandler}
              className="h-14 rounded-2xl border border-gray-200 px-4 outline-none focus:ring-2 focus:ring-main"
            >
              <option value="">اختر التابع</option>

              {relatedRegion?.map((region, index) => (
                <option
                  key={index}
                  value={region}
                >
                  {region}
                </option>
              ))}
            </select>

          </div>
             <div className="flex flex-col gap-2">

            <label className="text-sm font-bold text-gray-700">

                حالة الشقة
            </label>

            <select
           onChange={changeHandler}
              value={form.propertyStatus || ""}
              name="propertyStatus"
              className="h-14 rounded-2xl border border-gray-200 px-4 outline-none focus:ring-2 focus:ring-main"
            >
              <option value="">اختر النوع</option>

              {propertySatuts?.data?.data?.map((item) => (
                <option
                  key={item._id}
                  value={item.name}
                >
                  {item.name}
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
                              search &&   <div className="border border-gray-300 rounded-md max-h-40 overflow-y-auto p-2">
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
                            </div>
                            }
                          
                    </div>
          }
  
                   <div className="flex flex-col gap-2">

            <label className="text-sm font-bold text-gray-700">

               رقم الشقة
            </label>

            <select
           onChange={changeHandler}
              value={form.floorNumber || ""}
              name="floorNumber"
              className="h-14 rounded-2xl border border-gray-200 px-4 outline-none focus:ring-2 focus:ring-main"
            >
              <option value="">اختر الرقم</option>

              {floorNumbers?.data?.data?.map((item) => (
                <option
                  key={item._id}
                  value={item.name}
                >
                  {item.name}
                </option>
              ))}
            </select>

          </div>

           <div className="flex flex-col gap-2">

            <label className="text-sm font-bold text-gray-700">

           الطابق
            </label>

            <select
           onChange={changeHandler}
              value={form.floor || ""}
              name="floor"
              className="h-14 rounded-2xl border border-gray-200 px-4 outline-none focus:ring-2 focus:ring-main"
            >
              <option value="">اختر الطابق</option>

              {floorNumbers?.data?.data?.map((item) => (
                <option
                  key={item._id}
                  value={item.name}
                >
                  {item.name}
                </option>
              ))}
            </select>

          </div>
              <div className="flex flex-col gap-2">

            <label className="text-sm font-bold text-gray-700">

           عدد الغرف
            </label>

            <select
           onChange={changeHandler}
              value={form.rooms || ""}
              name="rooms"
              className="h-14 rounded-2xl border border-gray-200 px-4 outline-none focus:ring-2 focus:ring-main"
            >
              <option value="">اختر العدد</option>

              {floorNumbers?.data?.data?.map((item) => (
                <option
                  key={item._id}
                  value={item.name}
                >
                  {item.name}
                </option>
              ))}
            </select>

          </div>
             <div className="flex flex-col gap-2">

            <label className="text-sm font-bold text-gray-700">

           عدد الحمامات
            </label>

            <select
           onChange={changeHandler}
              value={form.bathrooms || ""}
              name="bathrooms"
              className="h-14 rounded-2xl border border-gray-200 px-4 outline-none focus:ring-2 focus:ring-main"
            >
              <option value="">اختر العدد</option>

              {floorNumbers?.data?.data?.map((item) => (
                <option
                  key={item._id}
                  value={item.name}
                >
                  {item.name}
                </option>
              ))}
            </select>

          </div>

              <div className="flex flex-col gap-2">

            <label className="text-sm font-bold text-gray-700">

          المساحة
            </label>

            <select
           onChange={changeHandler}
              value={form.area || ""}
              name="area"
              className="h-14 rounded-2xl border border-gray-200 px-4 outline-none focus:ring-2 focus:ring-main"
            >
              <option value="">اختر المساحه</option>

              {PropertyArea?.data?.data?.map((item) => (
                <option
                  key={item._id}
                  value={item.name}
                >
                  {item.name }
                </option>
              ))}
            </select>

          </div>

            <div className="flex flex-col gap-2">

            <label className="text-sm font-bold text-gray-700">

          المساحه الخارجية
            </label>

            <select
           onChange={changeHandler}
              value={form.areaOutside || ""}
              name="areaOutside"
              className="h-14 rounded-2xl border border-gray-200 px-4 outline-none focus:ring-2 focus:ring-main"
            >
              <option value="">اختر المساحه</option>

              {PropertyArea?.data?.data?.map((item) => (
                <option
                  key={item._id}
                  value={item.name}
                >
                  {item.name }
                </option>
              ))}
            </select>

          </div>

            <div className="flex flex-col gap-2">

            <label className="text-sm font-bold text-gray-700">

         مساحه التراس
            </label>

            <select
           onChange={changeHandler}
              value={form.areaTarth || ""}
              name="areaTarth"
              className="h-14 rounded-2xl border border-gray-200 px-4 outline-none focus:ring-2 focus:ring-main"
            >
              <option value="">اختر المساحه</option>

              {PropertyArea?.data?.data?.map((item) => (
                <option
                  key={item._id}
                  value={item.name}
                >
                  {item.name }
                </option>
              ))}
            </select>

          </div>
             <div className="flex flex-col gap-2">

            <label className="text-sm font-bold text-gray-700">

         مساحه البركة
            </label>

            <select
           onChange={changeHandler}
              value={form.areaBark || ""}
              name="areaBark"
              className="h-14 rounded-2xl border border-gray-200 px-4 outline-none focus:ring-2 focus:ring-main"
            >
              <option value="">اختر المساحه</option>

              {PropertyArea?.data?.data?.map((item) => (
                <option
                  key={item._id}
                  value={item.name}
                >
                  {item.name }
                </option>
              ))}
            </select>

          </div>

               <div className="flex flex-col gap-2">

            <label className="text-sm font-bold text-gray-700">

        الدفعة الاولى
            </label>

            <select
           onChange={changeHandler}
              value={form.downPayment || ""}
              name="downPayment"
              className="h-14 rounded-2xl border border-gray-200 px-4 outline-none focus:ring-2 focus:ring-main"
            >
              <option value="">اختر الدفعة</option>

              {FirstPayments?.data?.data?.map((item) => (
                <option
                  key={item._id}
                  value={item.name}
                >
                  {item.name }
                </option>
              ))}
            </select>

          </div>
                     <div className="flex flex-col gap-2">

            <label className="text-sm font-bold text-gray-700">

        الدفعة الشهريه
            </label>

            <select
           onChange={changeHandler}
              value={form.monthlyInstallment || ""}
              name="monthlyInstallment"
              className="h-14 rounded-2xl border border-gray-200 px-4 outline-none focus:ring-2 focus:ring-main"
            >
              <option value="">اختر الدفعة</option>

              {monthPayments?.data?.data?.map((item) => (
                <option
                  key={item._id}
                  value={item.name}
                >
                  {item.name }
                </option>
              ))}
            </select>

          </div>
          {[
            // ['unitName', 'اسم الشقة', 'text'],
            // ['floorType', 'نوع العقار', 'text'],
            // ['floorTypeFlow', 'التابع', 'text'],
            // ['floorNumber', 'رقم الشقة', 'number'],
            // ['floor', 'الطابق', 'number'],
            // ['rooms', 'عدد الغرف', 'number'],
            // ['bathrooms', 'عدد الحمامات', 'number'],
            // ['area', 'المساحة', 'number'],
            // ['areaOutside', 'المساحة الخارجية', 'number'],
            // ['areaTarth', 'التراس', 'number'],
            // ['areaBark', 'البركة', 'number'],
            ['price', 'السعر', 'number'],
            // ['downPayment', 'الدفعة الأولى', 'number'],
            // ['monthlyInstallment', 'القسط الشهري', 'number'],
          ].map(([name, label, type]) => (
            <div key={name}>
              <label className="text-sm text-gray-600">{label}</label>

              <input
                type={type}
                name={name}
                value={form[name]}
                onChange={changeHandler}
                className={inputStyle}
              />
            </div>
          ))}
        </div>

        <textarea
          name="FloorDetails"
          value={form.FloorDetails}
          onChange={changeHandler}
          placeholder="تفاصيل الشقة"
          className={`${inputStyle} mt-5 h-32`}
        />

        <textarea
          name="propertyNote"
          value={form.propertyNote}
          onChange={changeHandler}
          placeholder="ملاحظات"
          className={`${inputStyle} mt-5 h-32`}
        />

        <div className="mt-6">
          <label
            className="
          cursor-pointer
          inline-flex
          gap-2
          items-center
          bg-purple-600
          text-white
          px-5
          py-3
          rounded-xl
          "
          >
            <FiPlus />
            رفع صور
            <input hidden type="file" multiple onChange={uploadImages} />
          </label>

          <div className="flex gap-4 mt-5 flex-wrap">
            {form.imagesURLs.map((img, index) => (
              <img
                key={index}
                src={img.preview}
                className="
                  w-28
                  h-28
                  rounded-2xl
                  object-cover
                  shadow
                  "
              />
            ))}
          </div>
        </div>

        <button
          onClick={addProperty}
          className="
          mt-7
          bg-purple-600
          text-white
          px-8
          py-4
          rounded-2xl
          flex
          gap-2
          items-center
          "
        >
          {editIndex !== null ? <FiEdit2 /> : <FiPlus />}

          {editIndex !== null ? 'تعديل الشقة' : 'إضافة الشقة'}
        </button>
      </div>

      {/* Added Properties */}

      <div className="grid md:grid-cols-3 gap-6">
        {properties.map((item, index) => (
          <div
            key={index}
            className="
          bg-white
          rounded-[30px]
          shadow
          border
          overflow-hidden
          "
          >
            {item.imagesURLs?.length > 0 && (
              <img
                src={item.imagesURLs[0].preview}
                className="
w-full
h-48
object-cover
"
              />
            )}

            <div className="p-5">
              <h3 className="font-bold text-xl">{item.unitName}</h3>

              <p className="text-gray-500">{item.floorType}</p>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-xl p-3">
                  الغرف
                  <b>{item.rooms}</b>
                </div>

                <div className="bg-gray-50 rounded-xl p-3">
                  المساحة
                  <b>{item.area}</b>
                </div>
              </div>

              <div className="text-purple-600 font-bold text-xl mt-4">
                {Number(item.price || 0).toLocaleString()}
              </div>

              <div className="flex gap-3 mt-5">
                <button
                  onClick={() => editProperty(index)}
                  className="
                    flex-1
                    bg-blue-50
                    text-blue-600
                    rounded-xl
                    py-3
                    "
                >
                  <FiEdit2 />
                </button>

                <button
                  onClick={() => deleteProperty(index)}
                  className="
flex-1
bg-red-50
text-red-600
rounded-xl
py-3
"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={saveData}
        disabled={isLoading}
        className="
bg-green-600
text-white
px-10
py-4
rounded-2xl
flex
gap-2
items-center
"
      >
        <FiSave />
        حفظ الشقق
      </button>
    </div>
  );
};

export default AddDirectProperty;
