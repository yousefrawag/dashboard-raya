import React from 'react'
import { FiTrash2 } from "react-icons/fi";
const ProjectProperties = ({properties , removeProperty}) => {

  return (
    <div>
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
                    onClick={() => removeProperty(item?._id)}
                    className="ml-4 p-2 rounded-lg hover:bg-red-50 text-red-500 hover:text-red-700 transition"
                  >
                    <FiTrash2 size={18} />
                  </button>
      
                </div>
              ))}
            </div>
    </div>
  )
}

export default ProjectProperties