import React from "react";
import { FiTrash2 } from "react-icons/fi";

const AddProperty = ({
  addProperty,
  properties,
  handelPropertyForm,
  removeProperty,
  propertyForm,
    editProperty ,
  editIndex
}) => {
  return (
    <div className="p-6 space-y-6">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">
          إضافة شقة داخل المشروع
        </h2>
        <span className="text-sm text-gray-400">
          عدد الشقق: {properties.length}
        </span>
      </div>

      {/* Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-white p-5 rounded-2xl border shadow-sm">

        {/* Input */}
        {[
          { name: "unitName", placeholder: "اسم الشقة", type: "text" },
          { name: "floor", placeholder: "الدور", type: "number" },
          { name: "rooms", placeholder: "عدد الغرف", type: "number" },
          { name: "bathrooms", placeholder: "عدد الحمامات", type: "number" },
          { name: "area", placeholder: "المساحة (م²)", type: "number" },
          { name: "price", placeholder: "السعر", type: "number" },
          { name: "downPayment", placeholder: "الدفعة الأولى", type: "number" },
          { name: "monthlyInstallment", placeholder: "القسط الشهري", type: "number" },
        ].map((field) => (
          <div key={field.name} className="flex flex-col gap-1">
            <label className="text-xs text-gray-500">
              {field.placeholder}
            </label>
            <input
              type={field.type}
              name={field.name}
              value={propertyForm[field.name]}
              onChange={handelPropertyForm}
              placeholder={field.placeholder}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg 
              focus:outline-none focus:ring-2 focus:ring-main focus:border-main
              transition text-sm"
            />
          </div>
        ))}
            <div className="mb-6 flex flex-col  gap-2">
                        <label
                            htmlFor="projectDetails"
                            className="w-full text-lg font-medium text-black dark:text-white"
                        >
                     ملاحظات
                        </label>
                        <textarea        onChange={handelPropertyForm} value={propertyForm.propertyNote}  name="propertyNote" className="focus:border-primary min-h-[150px] max-h-[200px]  active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500" >

                        </textarea>
                    
                </div>

        {/* Button */}
        <div className="col-span-1 md:col-span-2 lg:col-span-4 flex justify-end mt-2">
          <button
            type="button"
            onClick={addProperty}
            className="bg-main text-white px-6 py-2 rounded-lg 
            hover:bg-opacity-90 active:scale-95 transition font-medium"
          >
            {
              editIndex !== null  ? "تعديل شقة" : "إضافة شقة"
            }
        
          </button>
        </div>
      </div>

      {/* List */}
      <div className="space-y-4">

        {properties.length === 0 && (
          <div className="text-center py-10 border rounded-xl bg-gray-50">
            <p className="text-gray-400">لا يوجد شقق مضافة حتى الآن</p>
          </div>
        )}

        {properties.map((item, index) => (
          <div
            key={index}
            className="bg-white border rounded-2xl p-4 shadow-sm hover:shadow-md transition flex justify-between items-center"
          >

            {/* Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 w-full">

              <div>
                <p className="text-xs text-gray-400">الشقة</p>
                <p className="font-semibold">{item.unitName}</p>
              </div>

              <div>
                <p className="text-xs text-gray-400">الدور</p>
                <p>{item.floor}</p>
              </div>

              <div>
                <p className="text-xs text-gray-400">غرف</p>
                <p>{item.rooms}</p>
              </div>

              <div>
                <p className="text-xs text-gray-400">حمامات</p>
                <p>{item.bathrooms}</p>
              </div>

              <div>
                <p className="text-xs text-gray-400">المساحة</p>
                <p>{item.area} م²</p>
              </div>

              <div>
                <p className="text-xs text-gray-400">السعر</p>
                <p className="text-green-600 font-semibold">
                  {item.price} جنيه
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400">مقدم</p>
                <p>{item.downPayment}</p>
              </div>

              <div>
                <p className="text-xs text-gray-400">قسط</p>
                <p>{item.monthlyInstallment}</p>
              </div>
                       <div>
                <p className="text-xs text-gray-400">ملاحظات</p>
                <p>{item.propertyNote || "غير متوفر"}</p>
              </div>

            </div>

            {/* Delete */}
            <button
  onClick={() => editProperty(index)}
  type="button"
  className="ml-2 p-2 rounded-lg hover:bg-blue-50 text-blue-500"
>
  تعديل
</button>
            <button
              type="button"
              onClick={() => removeProperty(index)}
              className="ml-4 p-2 rounded-lg hover:bg-red-50 text-red-500 hover:text-red-700 transition"
            >
              <FiTrash2 size={18} />
            </button>

          </div>
        ))}
      </div>
    </div>
  );
};

export default AddProperty;