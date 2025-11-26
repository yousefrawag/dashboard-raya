import React, { useEffect, useState } from 'react';
import { useDashboardContext } from '../../../context/DashboardProviedr';
import useQueryadditeam from "../../../services/Queryadditeam"
import toast from 'react-hot-toast';
import useQueryDelete from '../../../services/useQueryDelete';
import { useNavigate } from 'react-router-dom';
import useQueryupdate from '../../../services/useQueryupdate';
const PopupCheckdelete = ({deleteKey , titale , id , navigatepage ,value}) => {
    const { moduleDelete ,
        setModuleDelete ,} = useDashboardContext()
    const [requerFiled , setRequirefiled] = useState("")
    const {isLoading , updateiteam} = useQueryupdate(deleteKey , deleteKey)
    const navigate = useNavigate()
    const options = [
        {
        key:"delete" ,
        label:"نعم"
    } ,
    {
        key:"No-delete" ,
        label:"لا"
    } ,
]
// handel add new main category 
const handelsubmit = (item) => {

    try {
        if( item === "delete"){
                const data ={
                  status:value
                };

      updateiteam(
        { id, data },
        {
          onSuccess: () => {
             setModuleDelete(false)
             return navigate(navigatepage)  
          },
        },
      );
        
        }else{
            setModuleDelete(false)
            return toast.success("تم إلغاء الحذف")
        }
       
    } catch (error) {
        console.log(error);
        
    }
}
// end handel add new main category 
useEffect(() => {
if(moduleDelete) {
  return setRequirefiled("")
}
} , [moduleDelete])

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center ${moduleDelete ? "flex" : "hidden"}`}>
    <div className="relative bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md mx-auto">
      {/* Close Button */}
      <button
        onClick={() => setModuleDelete(false)}
        className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-xl transition"
        type="button"
      >
        ✕
      </button>
  
      <p className="text-lg font-semibold text-center text-gray-800">
        هل متأكد من حذف <span className="text-red-600">{titale}</span>؟
      </p>
  
      <div className="flex justify-center gap-6 mt-8">
        {options?.map((item) => (
          <button
            key={item?.key}
            type='button'
            onClick={() => handelsubmit(item.key)}
            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              item.key === "delete"
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-gray-200 hover:bg-gray-300 text-gray-800"
            }`}
          >
            {item?.label}
          </button>
        ))}
      </div>
    </div>
  </div>
  
  );
};

export default PopupCheckdelete;
