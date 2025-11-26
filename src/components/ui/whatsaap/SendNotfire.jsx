import React, { useState } from "react";
import * as XLSX from "xlsx";
import toast from "react-hot-toast";
import useQueryadditeam from "../../../services/Queryadditeam";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const SendNotfire = ({ nextStep, compainid, prevStep }) => {
      const { isLoading, addIteam } = useQueryadditeam("compain/notyfire", "compain");
const navigate = useNavigate()
  const [compain, setCompain] = useState({
    campaignId: compainid,
    message: "",
    link:"" ,
    imageUrl:""
  });
  const handleAddCustomer = (e) => {
    e.preventDefault();

    if (!compain.message) {
      toast.error("يجب اضافه محتوى الرسالة");
      return;
    }

    addIteam(compain, {
      onSuccess: (response) => {
        toast.success("تم إرسال الحمله بنجاح 🎉");
        navigate("/whatsap-allcompaigins")
        
      },
      onError: (error) => {
        toast.error(error.response?.data?.mesg || "حدث خطأ أثناء الحفظ");
      },
    });
  };
  return (
       <form onSubmit={handleAddCustomer} className="bg-white w-full w-full p-8 rounded-2xl shadow">
             <h2 className="text-xl font-semibold mb-6 text-gray-700">
               💬 محتوى الحملة
               {
                isLoading && <span  className="text-red-600">برجاء الاإنتظار فور حصولك على رساله إتمام الحمله قد يأخد الامر بعض الوقت</span>
               }
             </h2>
   
             <label className="block mb-2 font-medium text-gray-700">الرسالة النصية</label>
             <textarea
               rows={4}
               value={compain.message}
               onChange={(e) => setCompain({ ...compain, message: e.target.value })}
               placeholder="اكتب هنا نص الرسالة..."
               className="w-full border border-gray-300 rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-green-400 resize-none"
             />
   
             <label className="block mb-2 font-medium text-gray-700">📎 رابط (اختياري)</label>
             <input
               type="url"
               value={compain.link}
               onChange={(e) => setCompain({ ...compain, link: e.target.value })}
               placeholder="ضع هنا الرابط (اختياري)"
               className="w-full border border-gray-300 rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-green-400"
             />
   
             <label className="block mb-2 font-medium text-gray-700">🖼️ صورة (اختياري)</label>
       
          <input
               type="url"
               value={compain.imageUrl}
               onChange={(e) => setCompain({ ...compain, imageUrl: e.target.value })}
               placeholder="ضع هنا الرابط (اختياري)"
               className="w-full border border-gray-300 rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-green-400"
             />
             <div className="flex justify-between mt-6">
               <button
                 onClick={prevStep}
                 className="bg-gray-300 text-gray-800 py-2 px-6 rounded-xl flex items-center gap-2"
               >
                 <FaArrowLeft /> السابق
               </button>
               <button
             type="submit"
                 className="bg-green-600 text-white py-2 px-6 rounded-xl flex items-center gap-2"
               >
                 التالي <FaArrowRight />
               </button>
             </div>
           </form>
  )
}

export default SendNotfire