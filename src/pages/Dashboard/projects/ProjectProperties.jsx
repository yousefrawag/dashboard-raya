
import React from "react";
import { FiTrash2 } from "react-icons/fi";

const ProjectProperties = ({
  properties,
  removeProperty,
}) => {
  const defaultImage =
    "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?q=80&w=1200";

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

  return (
    <div className="space-y-6">

      {/* EMPTY */}
      {properties.length === 0 && (
        <div className="text-center py-16 border rounded-3xl bg-gray-50">
          <p className="text-gray-400 text-lg">
            لا يوجد شقق مضافة حتى الآن
          </p>
        </div>
      )}


{/* DESKTOP TABLE */}
{properties.length > 0 && (
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

            <th className="p-6">الصورة</th>
            <th className="p-4">اسم الشقة</th>
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
              <td className="p-2">

                <img
                  src={getImageSrc(
                    item?.imagesURLs?.[0]
                  )}
                  alt=""
                  className="w-full h-20 rounded-2xl object-cover"
                />

              </td>

              {/* NAME */}
              <td className="p-4 font-bold whitespace-nowrap">
                {item.unitName || "-"}
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

              {/* NOTES */}
              <td className="p-4 min-w-[250px]">

                <p className="line-clamp-3 text-sm text-gray-600 leading-7">
                  {item.propertyNote ||
                    "لا يوجد ملاحظات"}
                </p>

              </td>

              {/* DELETE */}
              <td className="p-4">

                <button
                  onClick={() =>
                    removeProperty(item?._id)
                  }
                  className="bg-red-50 text-red-600 h-11 px-5 rounded-xl flex items-center gap-2 hover:bg-red-100 transition whitespace-nowrap"
                >
                  <FiTrash2 />
                  حذف
                </button>

              </td>

            </tr>
          ))}

        </tbody>

      </table>

    </div>

  </div>
)}

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
            item?.imagesURLs?.[0]?.fileURL
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

        {/* DELETE */}
        <button
          onClick={() =>
            removeProperty(item?._id)
          }
          className="w-full bg-red-50 text-red-600 h-12 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-red-100 transition"
        >
          <FiTrash2 />
          حذف الشقة
        </button>

      </div>

    </div>
  ))}

</div>



    </div>
  );
};

export default ProjectProperties;

