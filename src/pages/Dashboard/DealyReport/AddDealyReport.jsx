import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaRegPenToSquare } from "react-icons/fa6";
import SelectoptionHook from '../../../hooks/SelectoptionHook';
import useQueryadditeam from '../../../services/Queryadditeam';
import Loader from '../../../components/common/Loader/index';
import toast from 'react-hot-toast';
import useQuerygetiteams from '../../../services/Querygetiteams';
import UploadDealyFiles from '../../../hooks/UploadDealyFiles';
const AddDealyReport = () => {
    const {data} = useQuerygetiteams("customers" , "customers")

    const [selectedUsers, setSelectedUsers] = useState([]); // Array for selected users
const [docs , setDocs] = useState([])
    const [search, setSearch] = useState(""); // Search input state
    const [users , setUsers] = useState()
    const { addIteam, isLoading } = useQueryadditeam("Dealiy-reports", "Dealiy-reports");
    const navigate = useNavigate();


    const filteredUsers = users?.filter((user) =>
        user?.fullName?.toLowerCase().includes(search.toLowerCase())
      );
    
      const handleUserSelect = (userId) => {
        setSelectedUsers((prev) =>
          prev.includes(userId)
            ? prev.filter((id) => id !== userId)
            : [...prev, userId]
        );
      };
 
useEffect(() => {
    if(data?.data?.data) {
        setUsers(data?.data?.data)
    }
} , [data])

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData);
        data.Customers = selectedUsers

    formData.set("Customers" , JSON.stringify(selectedUsers) )
          docs.forEach((item) => {
          formData.append("files" , item)
        })
       
  
     

        try {
            addIteam(
             formData,
                {
                    onSuccess: () => {
                        e.target.reset();
                     
                        toast.success("تم إضافه تقرير جديد");
                        setDocs([])
                        navigate("/User-Reports");
                    },
                    onError: (error) => {
                        toast.error(error.response?.data?.mesg || "An error occurred. Please try again.");
                    },
                }
            );
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.mesg || "An error occurred. Please try again.");
        }
    };

    if (isLoading) {
        return <Loader />;
    }

    return (
        <form onSubmit={handleSubmit} className='w-full h-full bg-white rounded-[10px] dark:bg-form-input'>
            <div className="dark:bg-form-input flex items-center shadow-lg gap-4 mb-4 w-full h-full p-4 bg-white rounded-[10px]">
                <div className="icon p-2 bg-main rounded-full">
                    <FaRegPenToSquare />
                </div>
                <p className="font-semibold text-lg">ادخل بيانات التقرير</p>
            </div>

            <div className='main-section w-full max-h-[400px] min-h-[100px] p-4 overflow-auto'>
        
 <div className="mb-6 flex flex-col  gap-2">
    <label
      htmlFor="ReportType"
      className="w-full text-lg font-medium text-black dark:text-white"
    >
       نوع التقرير *

    </label>
    <select
      name="ReportType"
      id="ReportType"
   
      required
    
      className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
    >
  <option value="">اختر نوع التقرير</option>
<option value="إضافة عميل">إضافة عميل</option>
<option value="متابعة مع عميل">متابعة مع عميل</option>
<option value="اجتماع مع عميل">اجتماع مع عميل</option>
<option value="مكالمة هاتفية">مكالمة هاتفية</option>
<option value="إرسال عرض سعر">إرسال عرض سعر</option>
<option value="استلام دفعة">استلام دفعة</option>
<option value="تحديث بيانات عميل">تحديث بيانات عميل</option>
<option value="زيارة ميدانية">زيارة ميدانية</option>
<option value="أخرى">أخرى</option>
 
    </select>
  </div>
      


                    <div className="mb-6 flex flex-col gap-2">
                            <label className="w-full text-lg font-medium text-black dark:text-white">
                            العملاء المعينون
                            </label>
                            <input
                            type="text"
                            placeholder="بحث عن عميل..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="mb-2 focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
                            />
                            <div className="border border-gray-300 rounded-md max-h-40 overflow-y-auto p-2">
                            {filteredUsers?.map((user) => (
                                <label key={user?._id} className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    value={user?._id}
                                    checked={selectedUsers.includes(user?._id)}
                                    onChange={() => handleUserSelect(user?._id)}
                                    className="accent-main"
                                />
                                <span className="text-black dark:text-white">{user?.fullName}</span>
                                </label>
                            ))}
                            </div>
                    </div>
               
                <div className="mb-6 flex flex-col gap-2">
                    <label htmlFor="endcontact" className="w-full text-lg font-medium text-black dark:text-white">
                        أخر ماتم التواصل مع العميل 
                    </label>
                    <textarea
                        name="endcontact"
                        className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
                    ></textarea>
                </div> 
        
                <div className="mb-6 flex flex-col gap-2">
                    <label htmlFor="notes" className="w-full text-lg font-medium text-black dark:text-white">
                        ملاحظات 
                    </label>
                    <textarea
                        name="notes"
                        className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
                    ></textarea>
                </div>

                <UploadDealyFiles docs={docs} setDocs={setDocs} />
            </div>

            <div className="add_return flex justify-between items-center mt-4 shadow-lg p-4 bg-white dark:bg-form-input">
                <div className="add_btn">
                    <button
                        type="submit"
                        className="py-2 px-6 rounded-md bg-main text-white hover:bg-transparent hover:border hover:border-blue-600 hover:text-blue-600"
                    >
                        إضافة
                    </button>
                </div>
                <div className="return_btn">
                    <NavLink to="/User-Reports" className="bg-gray-300 text-gray-700 py-2 px-6 rounded-md">
                        عوده
                    </NavLink>
                </div>
            </div>
        </form>
    );
};

export default AddDealyReport;
