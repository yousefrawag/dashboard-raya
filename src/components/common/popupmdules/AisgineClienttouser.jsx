import React, { useEffect, useState } from 'react';
import { useDashboardContext } from '../../../context/DashboardProviedr';
import useQueryadditeam from "../../../services/Queryadditeam"
import toast from 'react-hot-toast';
import SelectoptionHook from '../../../hooks/SelectoptionHook';
import useQuerygetiteams from '../../../services/Querygetiteams';
import Loader from '../Loader';
import useQueryupdate from '../../../services/useQueryupdate';
const AisgineClienttouser = ({setCurrentLead , CurrentLead}) => {
    const {   AsigineclientTouser , setAsigine  } = useDashboardContext()
    const [requerFiled , setRequirefiled] = useState("")
    const {data } = useQuerygetiteams("users" , "users")
      const {isLoading , updateiteam } = useQueryupdate("customers/lead-convert" , "customers/leads") 
    
    const [value , setValue] = useState("")
// handel add new main category 
const handelsubmit = (e) => {
    e.preventDefault();
    try {
        const formData = new FormData(e.currentTarget);

        const data = Object.fromEntries(formData);
        data.user = value
   
     if(!data.user){
            return toast.error("يجب إضافة  الموظف المستفيد")
        }

        updateiteam({id:CurrentLead , data} , {
            onSuccess:() =>{
                setRequirefiled("")
                setCurrentLead("")
                setAsigine(false)
                toast.success("تم  تحويل الطلب الى عميل بالفعل ")
            }
        })
    } catch (error) {
        console.log(error);
        
    }
}
// end handel add new main category 

if(isLoading) {
    return <Loader />
}
  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center top-0 right-0 bottom-0  ${AsigineclientTouser ? 
        "flex" :"hidden"
    }`}>
        
      <form onSubmit={handelsubmit} className="relative bg-white p-6 rounded-md shadow-lg w-full max-w-[500px] max-h-[400px] min-h-[200px]  mt-5 p-4 overflow-auto	">
        {/* Close Button */}
        

        <button
        onClick={() => setAsigine(false)}
          className="absolute top-3 mb-10 right-3 text-gray-500 hover:text-gray-800 focus:outline-none"
         type='button'
        >
          ✕
        </button>

        {/* Content of the popup */}
 <div className="mb-6 flex flex-col  gap-2">
    <span  className='p-2 mt-5 bg-red-100 rounded-md text-slate-900'>
    أختر موظف المتابعة ثم قم بتحويل الطلب الى عميل 
</span>
    <label
      htmlFor="user"
      className="w-full text-lg font-medium text-black dark:text-white"
    >
الموظف
</label>
    <select
     required name="user"
  value={value} onChange={(e) => setValue(e.target.value)}
      id="user"
      className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
    >
      <option value="">أختر</option>
{
    data?.data?.data?.map((item) => {
        return <option key={item._id} value={item?.fullName} >
            {
                item?.fullName
            }
        </option>
    })
}
    </select>
  </div>






        <button
               type="submit"
                className="block text-white text-lg w-full bg-main hover:bg-main2 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center  dark:focus:ring-blue-800"
               
              >
               تحويل الى عميل
              </button>
      </form>
    </div>
  );
};

export default AisgineClienttouser;
