import React, { useEffect, useState } from 'react';
import { useDashboardContext } from '../../../context/DashboardProviedr';
import useQueryadditeam from "../../../services/Queryadditeam"
import toast from 'react-hot-toast';
const MdouleAddCategoray = ({fetshkey , titale}) => {
    const {module, setmodule} = useDashboardContext()
    const [requerFiled , setRequirefiled] = useState("")
    const { isError , isLoading , addIteam} = useQueryadditeam(fetshkey , fetshkey)
// handel add new main category 
const handelsubmit = (e) => {
    e.preventDefault();
    try {
        const formData = new FormData(e.currentTarget);

        const data = Object.fromEntries(formData);
        if(!data.name){
            return setRequirefiled("هذا الحقل مطلوب")
        }
        
        addIteam(data , {
            onSuccess:() =>{
                setRequirefiled("")
                setmodule(false)
                toast.success("تم إضافه مستوى جديد")
                  e.target.reset();

            }
        })
    } catch (error) {
        console.log(error);
        
    }
}
// end handel add new main category 
useEffect(() => {
if(module) {
  return setRequirefiled("")
}
} , [module])

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center top-0 right-0 bottom-0  ${module ? 
        "flex" :"hidden"
    }`}>
      <form onSubmit={handelsubmit} className="relative bg-white p-6 rounded-md shadow-lg w-full max-w-[500px] h-auto max-h-[90%] mx-auto	">
        {/* Close Button */}
        <button
        onClick={() => setmodule(false)}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 focus:outline-none"
         type='button'
        >
          ✕
        </button>

        {/* Content of the popup */}
        <div className="mb-5 mt-3 p-3">
          <label
            htmlFor="name"
            className="w-full  text-lg font-medium text-gray-700"
          >
            {titale}
          </label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder={`قم بكتابة ${titale}`}
            className="mt-3 text-main p-3 w-full outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
          />
          {
           requerFiled && <p className='text-red-500'>{requerFiled}</p>
          }
        </div>
        <button
               type="submit"
                className="block text-white bg-main hover:bg-main2 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center  dark:focus:ring-blue-800"
               
              >
               حفظ
              </button>
      </form>
    </div>
  );
};

export default MdouleAddCategoray;
