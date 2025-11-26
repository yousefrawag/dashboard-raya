import React, { useState } from 'react'
import toast from 'react-hot-toast'
import useQueryadditeam from '../../../services/Queryadditeam'
import { FaCheckCircle, FaArrowRight, FaArrowLeft } from "react-icons/fa";

const AddnewCompain = ({nextStep  , setCompainId}) => {
    const { isError , isLoading , addIteam} = useQueryadditeam("compain" , "compain")
    const [campaign , setCampaign] = useState({
        title:"" ,
        customerType:""
    })
    const handelAddNewcompain = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
  
    const data = Object.fromEntries(formData);

    if(!campaign.title){
      toast.error("يجب إضافه  عنوان الحملة")
        return ;
    }


    if(!campaign.customerType){
        toast.error("يجب إضافه  نوع العملاء")
        return ;
      }
   
    try {
    
        
        addIteam(campaign, {
            onSuccess:(response) =>{
             
               
                toast.success("تم إضافه  الحمله")
                if(response.status === 201) {
                    console.log("compain-id" ,response?.data?.campaignId );
                    
setCompainId(response?.data?.campaignId)
nextStep((prev) => prev + 1)
                }
              
            },  
             onError: (error) => {
              if (error.response && error.response.data && error.response.data.mesg) {
                toast.error(error.response.data.mesg);
              } else {
                toast.error("An error occurred. Please try again.");
              }
            }
        })
    } catch (error) {
        console.log(error);
        toast.error(error.response?.data?.mesg)
    }
   }
  return (
    <form onSubmit={handelAddNewcompain} className="bg-white w-full w-full p-8 rounded-2xl shadow">
            <h2 className="text-xl font-semibold mb-6 text-gray-700">
              📝 تفاصيل الحملة
            </h2>
  
            <label className="block mb-2 font-medium text-gray-700">عنوان الحملة</label>
            <input
              type="text"
              value={campaign.title}
              onChange={(e) => setCampaign({ ...campaign, title: e.target.value })}
              placeholder="اكتب عنوان الحملة..."
              className="w-full border border-gray-300 rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
  
            <label className="block mb-2 font-medium text-gray-700">نوع العملاء المستهدفين</label>
            <select
              value={campaign.customerType}
              onChange={(e) =>
                setCampaign({ ...campaign, customerType: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              <option value="">اختر...</option>
              <option value="buyers">مهتمون بالشراء</option>
              <option value="sellers">مهتمون بالبيع</option>
              <option value="inactive">عملاء غير نشطين</option>
            </select>
  
  
            <div className="flex justify-end mt-6">
              <button
              type='submit'
                className="bg-green-600 text-white py-2 px-6 rounded-xl hover:bg-green-700 flex items-center gap-2"
              >
                التالي <FaArrowRight />
              </button>
            </div>
          </form>
  )
}

export default AddnewCompain