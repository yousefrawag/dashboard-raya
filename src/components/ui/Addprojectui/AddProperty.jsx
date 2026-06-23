
import React, { useState } from "react";
import { FiTrash2, FiPlus, FiEdit2 } from "react-icons/fi";
import useQuerygetiteams from "../../../services/Querygetiteams";
import UpoladFiles from "../../../hooks/UpoladFiles";
import vactor from "../../../images/icon/vactor.svg";
import vactor2 from "../../../images/icon/Group.svg";

const AddProperty = ({
  addProperty,
  properties,
  handelPropertyForm,
  removeProperty,
  propertyForm,
  editProperty,
  propertyRelated,
  editIndex,
  docsProperty,
  images_videoProperty,
  setimages_videoProperty,
  setDocsProperty,
  formContainerRef
}) => {
  const { data: regionData } = useQuerygetiteams(
    "region",
    "region"
  );
 const { data: propertySatuts } = useQuerygetiteams('propertySatuts', 'propertySatuts');
const {data:floorNumbers} = useQuerygetiteams("FloorNumber", "FloorNumber")
const {data:PropertyArea} = useQuerygetiteams("arae", "arae")
const {data:monthPayments} = useQuerygetiteams("monthPayment", "monthPayment")
const {data:FirstPayments} = useQuerygetiteams("firstpayment", "firstpayment")
  const [viewmenu, setViewmenu] = useState(false);

  const defaultImage =
    "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?q=80&w=1200";

  const isEditMode =
    editIndex !== null &&
    editIndex !== undefined;

const getImageSrc = (image) => {
  if (!image) return defaultImage;

  // ✅ cloudinary object
  if (image?.fileURL) {
    return image.fileURL;
  }

  // ✅ string
  if (typeof image === "string") {
    return image;
  }

  // ✅ local preview
  if (image?.preview) {
    return image.preview;
  }

  // ✅ object فيه file
  if (image?.file instanceof File) {
    return image.preview || URL.createObjectURL(image.file);
  }

  // ✅ file مباشر
  if (image instanceof File) {
    return URL.createObjectURL(image);
  }

  return defaultImage;
};

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    setimages_videoProperty((prev) => {
      const updatedFiles = [...prev, ...selectedFiles];

      handelPropertyForm({
        target: {
          name: "imagesURLs",
          value: updatedFiles,
        },
      });

      return updatedFiles;
    });

    e.target.value = "";
  };

  const handelDoc = (e) => {
    const selectedFiles = Array.from(e.target.files);

    setDocsProperty((prev) => {
      const updatedDocs = [...prev, ...selectedFiles];

      handelPropertyForm({
        target: {
          name: "docsURLs",
          value: updatedDocs,
        },
      });

      return updatedDocs;
    });

    e.target.value = "";
  };

  return (
    <div className="w-full space-y-8" ref={formContainerRef}>

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">

        <div>
          <h2 className="text-3xl font-bold text-gray-800">
            {isEditMode
              ? "تعديل الشقة"
              : "إضافة شقة داخل المشروع"}
          </h2>

          <p className="text-gray-500 mt-1 text-sm">
            يمكنك إضافة وإدارة الشقق الخاصة بالمشروع
          </p>
        </div>

        <div className="bg-main/10 text-main px-5 py-3 rounded-2xl font-bold">
          عدد الشقق : {properties.length}
        </div>

      </div>

      {/* FORM */}
      <div className="bg-white rounded-[30px] border border-gray-200 shadow-sm p-6 md:p-8">

        {/* SECTION TITLE */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800">
            بيانات الشقة
          </h3>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

          {/* TYPE */}
          <div className="flex flex-col gap-2">

            <label className="text-sm font-bold text-gray-700">
              نوع العقار
            </label>

            <select
              onChange={handelPropertyForm}
              value={propertyForm.floorType || ""}
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
              value={propertyForm.floorTypeFlow || ""}
              onChange={handelPropertyForm}
              className="h-14 rounded-2xl border border-gray-200 px-4 outline-none focus:ring-2 focus:ring-main"
            >
              <option value="">اختر التابع</option>

              {propertyRelated?.map((region, index) => (
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
              onChange={handelPropertyForm}
              value={propertyForm.propertyStatus || ""}
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
                 <div className="flex flex-col gap-2">

            <label className="text-sm font-bold text-gray-700">

               رقم الشقة
            </label>

            <select

             onChange={handelPropertyForm}
              value={propertyForm.floorNumber || ""}
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
           onChange={handelPropertyForm}
              value={propertyForm.floor || ""}
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
             onChange={handelPropertyForm}
              value={propertyForm.rooms || ""}
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
             onChange={handelPropertyForm}
              value={propertyForm.bathrooms || ""}
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
              onChange={handelPropertyForm}
              value={propertyForm.area || ""}
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
           onChange={handelPropertyForm}
              value={propertyForm.areaOutside || ""}
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
            onChange={handelPropertyForm}
              value={propertyForm.areaTarth || ""}
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
              onChange={handelPropertyForm}
              value={propertyForm.areaBark || ""}
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
              onChange={handelPropertyForm}
              value={propertyForm.downPayment || ""}
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
               onChange={handelPropertyForm}
              value={propertyForm.monthlyInstallment || ""}
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
          {/* INPUTS */}
          {[
            // {
            //   name: "unitName",
            //   placeholder: "اسم الشقة",
            // },
            // {
            //   name: "floor",
            //   placeholder: "الطابق",
            //   type: "number",
            // },
            // {
            //   name: "floorNumber",
            //   placeholder: "رقم الشقة",
            //   type: "number",
            // },
            // {
            //   name: "rooms",
            //   placeholder: "عدد الغرف",
            //   type: "number",
            // },
            // {
            //   name: "bathrooms",
            //   placeholder: "عدد الحمامات",
            //   type: "number",
            // },
            // {
            //   name: "area",
            //   placeholder: "المساحة (م²)",
            //   type: "number",
            // },
            // {
            //   name: "areaOutside",
            //   placeholder: "المساحة الخارجية",
            //   type: "number",
            // },
            // {
            //   name: "areaTarth",
            //   placeholder: "مساحة التراس",
            //   type: "number",
            // },
            // {
            //   name: "areaBark",
            //   placeholder: "مساحة البركة",
            //   type: "number",
            // },
            {
              name: "price",
              placeholder: "السعر",
              type: "number",
            }
    
          ].map((field) => (
            <div
              key={field.name}
              className="flex flex-col gap-2"
            >

              <label className="text-sm font-bold text-gray-700">
                {field.placeholder}
              </label>

              <input
                type={field.type || "text"}
                name={field.name}
                value={propertyForm[field.name] || ""}
                onChange={handelPropertyForm}
                placeholder={field.placeholder}
                className="h-14 rounded-2xl border border-gray-200 px-4 outline-none focus:ring-2 focus:ring-main"
              />

            </div>
          ))}
        </div>

        {/* TEXTAREAS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-6">

          <div className="flex flex-col gap-2">

            <label className="text-sm font-bold text-gray-700">
              تفاصيل الشقة
            </label>

            <textarea
              onChange={handelPropertyForm}
              value={propertyForm.FloorDetails || ""}
              name="FloorDetails"
              className="min-h-[180px] rounded-2xl border border-gray-200 p-4 outline-none focus:ring-2 focus:ring-main"
            />

          </div>

          <div className="flex flex-col gap-2">

            <label className="text-sm font-bold text-gray-700">
              ملاحظات
            </label>

            <textarea
              onChange={handelPropertyForm}
              value={propertyForm.propertyNote || ""}
              name="propertyNote"
              className="min-h-[180px] rounded-2xl border border-gray-200 p-4 outline-none focus:ring-2 focus:ring-main"
            />

          </div>

        </div>

        {/* FILES */}
        <div className="mt-8 bg-gray-50 border rounded-3xl p-6">

          <div className="flex items-center justify-between mb-5">

            <div>
              <h4 className="text-xl font-bold text-gray-800">
                الصور والمرفقات
              </h4>

              <p className="text-sm text-gray-500 mt-1">
                أضف صور أو ملفات خاصة بالشقة
              </p>
            </div>

            <div className="relative">

              <button
                type="button"
                onClick={() =>
                  setViewmenu(!viewmenu)
                }
                className="bg-main text-white px-5 h-12 rounded-2xl flex items-center gap-2"
              >
                <FiPlus />
                إضافة مرفقات
              </button>

              {viewmenu && (
                <div className="absolute left-0 top-14 bg-white border rounded-2xl shadow-xl w-64 z-50 overflow-hidden">

                  <label
                    htmlFor="files"
                    className="flex items-center gap-3 p-4 hover:bg-gray-50 cursor-pointer"
                  >
                    <img src={vactor} alt="" />

                    <span>اختر ملفات</span>
                  </label>

                  <input
                    type="file"
                    multiple
                    className="hidden"
                    id="files"
                    onChange={handelDoc}
                  />

                  <label
                    htmlFor="image-video"
                    className="flex items-center gap-3 p-4 hover:bg-gray-50 cursor-pointer"
                  >
                    <img src={vactor2} alt="" />

                    <span>
                      اختر صور أو فيديو
                    </span>
                  </label>

                  <input
                    type="file"
                    multiple
                    className="hidden"
                    id="image-video"
                    accept="image/png,image/jpeg,image/jpg,video/mp4"
                    onChange={handleFileChange}
                  />

                </div>
              )}

            </div>

          </div>

          {/* PREVIEW */}
          {(images_videoProperty?.length > 0 ||
            docsProperty?.length > 0) && (
            <UpoladFiles
              images={images_videoProperty}
              setImages={
                setimages_videoProperty
              }
              docs={docsProperty}
              setDocs={setDocsProperty}
            />
          )}

        </div>

        {/* BUTTON */}
        <div className="flex justify-end mt-8">

          <button
            type="button"
            onClick={addProperty}
            className="bg-main text-white h-14 px-10 rounded-2xl text-lg font-bold hover:opacity-90 transition"
          >
            {isEditMode
              ? "تعديل الشقة"
              : "إضافة الشقة"}
          </button>

        </div>

      </div>

{/* DESKTOP TABLE */}
<div className="hidden xl:block bg-white rounded-[30px] border overflow-hidden shadow-sm">

  <div className="p-6 border-b">

    <h3 className="text-2xl font-bold text-gray-800">
      الشقق المضافة
    </h3>

  </div>

  <div className="overflow-x-auto">

    <table className="w-full min-w-[1800px]">

      <thead className="bg-gray-50">

        <tr className="text-right">

          <th className="p-4">الصورة</th>
       
          <th className="p-4">النوع</th>
          <th className="p-4">التابع</th>
          <th className="p-4">الطابق</th>
          <th className="p-4">رقم الشقة</th>
          <th className="p-4">الغرف</th>
          <th className="p-4">الحمامات</th>
          <th className="p-4">المساحة</th>
          <th className="p-4">الخارجية</th>
          <th className="p-4">التراس</th>
          <th className="p-4">البركة</th>
          <th className="p-4">السعر</th>
          <th className="p-4">الدفعة الأولى</th>
          <th className="p-4">القسط الشهري</th>
          <th className="p-4">تفاصيل</th>
          <th className="p-4">ملاحظات</th>
          <th className="p-4">الإجراءات</th>

        </tr>

      </thead>

      <tbody>

        {properties.map((item, index) => (
          <tr
            key={index}
            className="border-t hover:bg-gray-50 transition"
          >

            {/* IMAGE */}
            <td className="p-4 min-w-30">

              <img
                src={getImageSrc(
                  item?.imagesURLs?.[0]
                )}
                alt=""
                className="w-24 h-20 rounded-2xl object-cover"
              />

            </td>

        
            {/* TYPE */}
            <td className="p-4 whitespace-nowrap">
              {item.floorType || "-"}
            </td>

            {/* RELATED */}
            <td className="p-4 whitespace-nowrap">
              {item.floorTypeFlow || "-"}
            </td>

            {/* FLOOR */}
            <td className="p-4 whitespace-nowrap">
              {item.floor || "-"}
            </td>

            {/* FLOOR NUMBER */}
            <td className="p-4 whitespace-nowrap">
              {item.floorNumber || "-"}
            </td>

            {/* ROOMS */}
            <td className="p-4 whitespace-nowrap">
              {item.rooms || "-"}
            </td>

            {/* BATHROOMS */}
            <td className="p-4 whitespace-nowrap">
              {item.bathrooms || "-"}
            </td>

            {/* AREA */}
            <td className="p-4 whitespace-nowrap">
              {item.area || 0} م²
            </td>

            {/* OUTSIDE */}
            <td className="p-4 whitespace-nowrap">
              {item.areaOutside || 0} م²
            </td>

            {/* TERRACE */}
            <td className="p-4 whitespace-nowrap">
              {item.areaTarth || 0} م²
            </td>

            {/* POOL */}
            <td className="p-4 whitespace-nowrap">
              {item.areaBark || 0} م²
            </td>

            {/* PRICE */}
            <td className="p-4 text-main font-bold whitespace-nowrap">
              ₪ {item.price || 0}
            </td>

            {/* DOWN PAYMENT */}
            <td className="p-4 whitespace-nowrap">
              ₪ {item.downPayment || 0}
            </td>

            {/* INSTALLMENT */}
            <td className="p-4 whitespace-nowrap">
              ₪ {item.monthlyInstallment || 0}
            </td>

            {/* DETAILS */}
            <td className="p-4 min-w-[250px]">

              <p className="line-clamp-3 text-sm text-gray-600 leading-7">
                {item.FloorDetails ||
                  "لا يوجد تفاصيل"}
              </p>

            </td>

            {/* NOTE */}
            <td className="p-4 min-w-[250px]">

              <p className="line-clamp-3 text-sm text-gray-600 leading-7">
                {item.propertyNote ||
                  "لا يوجد ملاحظات"}
              </p>

            </td>

            {/* ACTIONS */}
            <td className="p-4">

              <div className="flex items-center gap-3">

                <button
                  onClick={() =>
                    editProperty(index)
                  }
                  type="button"
                  className="bg-blue-50 text-blue-600 h-11 px-5 rounded-xl flex items-center gap-2 whitespace-nowrap"
                >
                  <FiEdit2 />
                  تعديل
                </button>

                <button
                  onClick={() =>
                    removeProperty(index)
                  }
                  type="button"
                  className="bg-red-50 text-red-600 h-11 px-5 rounded-xl flex items-center gap-2 whitespace-nowrap"
                >
                  <FiTrash2 />
                  حذف
                </button>

              </div>

            </td>

          </tr>
        ))}

      </tbody>

    </table>

  </div>

</div>

{/* MOBILE CARDS */}
<div className="grid grid-cols-1 gap-5 xl:hidden">

  {properties.map((item, index) => (
    <div
      key={index}
      className="bg-white rounded-[30px] overflow-hidden border shadow-sm"
    >

      {/* IMAGE */}
      <div className="relative h-60">

        <img
          src={getImageSrc(
            item?.imagesURLs?.[0]
          )}
          alt=""
          className="w-full h-full object-cover"
        />

        <div className="absolute top-4 right-4 bg-main text-white px-4 py-2 rounded-full text-sm">
          {item.floorType || "شقة"}
        </div>

      </div>

      {/* CONTENT */}
      <div className="p-5 space-y-5">

        {/* HEADER */}
        <div className="flex items-start justify-between gap-3">

          <div>

            <h3 className="text-2xl font-bold text-gray-800">
              {item.unitName || "-"}
            </h3>

            <p className="text-gray-500 mt-1">
              الطابق {item.floor || "-"}
            </p>

          </div>

          <div className="text-main text-2xl font-bold whitespace-nowrap">
            ₪ {item.price || 0}
          </div>

        </div>

        {/* INFO */}
        <div className="grid grid-cols-2 gap-3">

          <div className="bg-gray-50 rounded-2xl p-4 text-center">
            <p className="text-xs text-gray-400">
              رقم الشقة
            </p>

            <p className="font-bold mt-1">
              {item.floorNumber || "-"}
            </p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-4 text-center">
            <p className="text-xs text-gray-400">
              التابع
            </p>

            <p className="font-bold mt-1">
              {item.floorTypeFlow || "-"}
            </p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-4 text-center">
            <p className="text-xs text-gray-400">
              غرف
            </p>

            <p className="font-bold mt-1">
              {item.rooms || "-"}
            </p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-4 text-center">
            <p className="text-xs text-gray-400">
              حمامات
            </p>

            <p className="font-bold mt-1">
              {item.bathrooms || "-"}
            </p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-4 text-center">
            <p className="text-xs text-gray-400">
              المساحة
            </p>

            <p className="font-bold mt-1">
              {item.area || 0} م²
            </p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-4 text-center">
            <p className="text-xs text-gray-400">
              مساحة خارجية
            </p>

            <p className="font-bold mt-1">
              {item.areaOutside || 0} م²
            </p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-4 text-center">
            <p className="text-xs text-gray-400">
              مساحة التراس
            </p>

            <p className="font-bold mt-1">
              {item.areaTarth || 0} م²
            </p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-4 text-center">
            <p className="text-xs text-gray-400">
              مساحة البركة
            </p>

            <p className="font-bold mt-1">
              {item.areaBark || 0} م²
            </p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-4 text-center">
            <p className="text-xs text-gray-400">
              الدفعة الأولى
            </p>

            <p className="font-bold mt-1">
              ₪ {item.downPayment || 0}
            </p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-4 text-center">
            <p className="text-xs text-gray-400">
              القسط الشهري
            </p>

            <p className="font-bold mt-1">
              ₪ {item.monthlyInstallment || 0}
            </p>
          </div>

        </div>

        {/* DETAILS */}
        <div className="bg-gray-50 rounded-2xl p-5">

          <p className="text-sm font-bold text-gray-700 mb-2">
            تفاصيل الشقة
          </p>

          <p className="text-sm text-gray-600 leading-7">
            {item.FloorDetails ||
              "لا يوجد تفاصيل"}
          </p>

        </div>

        {/* NOTES */}
        <div className="bg-gray-50 rounded-2xl p-5">

          <p className="text-sm font-bold text-gray-700 mb-2">
            ملاحظات
          </p>

          <p className="text-sm text-gray-600 leading-7">
            {item.propertyNote ||
              "لا يوجد ملاحظات"}
          </p>

        </div>

        {/* BUTTONS */}
        <div className="grid grid-cols-2 gap-3">

          <button
            onClick={() =>
              editProperty(index)
            }
            type="button"
            className="bg-blue-50 text-blue-600 h-12 rounded-2xl font-bold flex items-center justify-center gap-2"
          >
            <FiEdit2 />
            تعديل
          </button>

          <button
            onClick={() =>
              removeProperty(index)
            }
            type="button"
            className="bg-red-50 text-red-600 h-12 rounded-2xl font-bold flex items-center justify-center gap-2"
          >
            <FiTrash2 />
            حذف
          </button>

        </div>

      </div>

    </div>
  ))}

</div>



    </div>
  );
};

export default AddProperty;
