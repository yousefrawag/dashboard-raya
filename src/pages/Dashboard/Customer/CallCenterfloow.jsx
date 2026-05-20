import React, { useEffect, useState } from 'react';
import { formatDistanceToNow, format } from 'date-fns';
import useQueryupdate from '../../../services/useQueryupdate';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import useQuerygetiteams from '../../../services/Querygetiteams';
const arabicTimeAgo = (date) => {
    const timeAgo = formatDistanceToNow(new Date(date), { addSuffix: true });
    return timeAgo;
};

const CallCenterfloow = ({ SectionFollow, id, iseditpage, seSectionFlowwupdate }) => {
    const { updateiteam } = useQueryupdate("customers/sectionfloow", "customers");
    const {data , isLoading} = useQuerygetiteams("callcenterCustomerstauts" , "callcenterCustomerstauts")

    const [modulePop, setModulePop] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);
    const [relatedCallStatus , SetReltedCallStatus] = useState([])
    const [formData, setFormData] = useState({
        details: '',
        detailsDate: '',
        CustomerDealsatuts: '',
        CustomerDealsatutsDescrep:"",
        contactNotes:"",
        nextReminderDate:null
    });
    const navigate = useNavigate();

    // Delete functionality
    const handeldelateItem = (itemid) => {
        const data = {
            sectionid: itemid,
            action: 'delete'
        };
        try {
            updateiteam(
                { data, id },
                {
                    onSuccess: (response) => {
                        toast.success("تم حذف عنصر من قسم المتابعة الخاصة بالعميل");
                        setModulePop(false);
                          navigate('/cutomers');
                    },
                    onError: (error) => {
                        if (error.response?.data?.mesg) {
                            toast.error(error.response.data.mesg);
                        } else {
                            toast.error('An error occurred. Please try again.');
                        }
                        setModulePop(false);
                    },
                },
            );
        } catch (error) {
            toast.error('حدث خطأ أثناء الحذف');
            setModulePop(false);
        }
    };

    // Open edit modal and set current item
    const handleEditClick = (item) => {
        setCurrentItem(item);
        setFormData({
            details: item.details,
            detailsDate: format(new Date(item.detailsDate), 'yyyy-MM-dd'),
            CustomerDealsatuts: item.CustomerDealsatuts ,
            CustomerDealsatutsDescrep:item.CustomerDealsatutsDescrep
        });
        const CurrentItems1 = data?.data?.data?.find((item) => item.name === currentItem?.CustomerDealsatuts)
        SetReltedCallStatus(CurrentItems1?.relatedRegions || [])
        setEditModalOpen(true);
    };

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if(name === "CustomerDealsatuts"){
            const CurrentItems = data?.data?.data?.find((item) => item.name === value)
            if(CurrentItems) {
                return SetReltedCallStatus(CurrentItems?.relatedRegions || [])
            }
        }
    };

    // Submit updated data
    const handleUpdateSubmit = () => {
        const data = {
            sectionid: currentItem._id,
            action: 'update',
            updates: formData
        };

        updateiteam(
            { data, id },
            {
                onSuccess: (response) => {
                    toast.success("تم تحديث بيانات المتابعة بنجاح");
                    setEditModalOpen(false);
                      navigate('/cutomers');
                },
                onError: (error) => {
                    if (error.response?.data?.mesg) {
                        toast.error(error.response.data.mesg);
                    } else {
                        toast.error('حدث خطأ أثناء التحديث');
                    }
                },
            }
        );
    };

    const openDeleteConfirmation = (itemId) => {
        setCurrentItem(SectionFollow.find(item => item._id === itemId));
        setModulePop(true);
    };
useEffect(() => {
    if(currentItem){
             const CurrentItems1 = data?.data?.data?.find((item) => item.name === currentItem?.CustomerDealsatuts)
        SetReltedCallStatus(CurrentItems1?.relatedRegions || [])
    }
} , [currentItem])
    return (
        <>
            <div className="p-4 h-[400px] overflow-y-auto space-y-4 border-[1px] mt-10">
                {SectionFollow?.map((item) => (
                    <div key={item?._id} className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-sm">
                        <div className='flex gap-4 w-full justify-end'>
                            <button 
                                onClick={() => openDeleteConfirmation(item?._id)} 
                                type='button' 
                                className='text-red-500 hover:text-red-700 transition-colors'
                            >
                                حذف
                            </button>
                            <button 
                                onClick={() => handleEditClick(item)} 
                                type='button' 
                                className='text-main hover:text-blue-700 transition-colors'
                            >
                                تعديل
                            </button>
                        </div>
                        
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                                <img src={item?.user?.imageURL} alt="user" className="w-10 h-10 rounded-full" />
                                <span className="ml-2 font-medium text-gray-900 dark:text-white">
                                    {item?.user?.fullName}
                                </span>
                            </div>
                            <span className="text-sm text-gray-500 dark:text-gray-400 flex gap-5">
                                <span>تاريخ النشر</span> 
                                {arabicTimeAgo(item?.createdAt)}
                            </span>
                            {
                                item?.updatedAt &&    <span className="text-sm text-gray-500 dark:text-gray-400 flex gap-5">
                                <span> أخر تحديث</span> 
                                {arabicTimeAgo(item?.updatedAt)}
                            </span>
                            }
                        </div>
                        <p className="text-gray-700 text-lg dark:text-gray-300">{item?.details}</p>
                        <span className="text-sm text-gray-500 dark:text-gray-400 flex gap-5">
                            <span>تاريخ الإتصال</span> 
                            {item?.detailsDate ? format(new Date(item?.detailsDate), "dd MMMM, yyyy") : "غير محدد"}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-5">
                            <span> الحالة</span> 
                            <span className='p-2 bg-main text-white rounded-md'>
                                {item?.CustomerDealsatuts}
                            </span>
                        </span>
                        {
                            item?.CustomerDealsatutsDescrep &&   <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-5">
                            <span> وصف حالة العميل</span> 
                            <span className='p-2 bg-main text-white rounded-md'>
                                {item?.CustomerDealsatutsDescrep}
                            </span>
                        </span>
                        }
                                  {
                            item?.contactNotes &&   <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-5">
                            <span> ملاحظات  </span> 
                            <span className='p-2 bg-main text-white rounded-md'>
                                {item?.contactNotes}
                            </span>
                        </span>
                        }
                    </div>
                ))}
            </div>

            {/* Delete Confirmation Modal */}
            {modulePop && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                            تأكيد الحذف
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 mb-6">
                            هل أنت متأكد أنك تريد حذف هذا القسم؟ لا يمكن التراجع عن هذا الإجراء.
                        </p>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setModulePop(false)}
                                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                            >
                                إلغاء
                            </button>
                            <button
                                onClick={() => {
                                    handeldelateItem(currentItem._id);
                                    setModulePop(false);
                                }}
                                className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600 transition-colors"
                            >
                                تأكيد الحذف
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {editModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                            تعديل بيانات المتابعة
                        </h3>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    التفاصيل
                                </label>
                                <textarea
                                    name="details"
                                    value={formData.details}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
                                    rows="3"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    تاريخ الاتصال
                                </label>
                                <input
                                    type="date"
                                    name="detailsDate"
                                    value={formData.detailsDate}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
                                />
                            </div>
                            
     {
  isLoading ? "loadding ..." : 
  <div className="mb-6 flex flex-col  gap-2 w-full">
            <label
              htmlFor="CustomerDealsatuts"
              className="w-full text-lg font-medium text-black dark:text-white"
            >
        حاله العميل مع المتابعة

            </label>
            <select 
            value={formData.CustomerDealsatuts}
            onChange={handleInputChange}
            required
            name='CustomerDealsatuts'
               className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"


>
<option value="">قم بالاختيار</option>
{
  data?.data?.data?.map((item) => {
    return <option key={item?._id} value={item?.name}>{item?.name}</option>
  })
}
</select>
          </div>
}
  <div className="mb-6 flex flex-col  gap-2 w-full">
            <label
              htmlFor="CustomerDealsatutsDescrep"
              className="w-full text-lg font-medium text-black dark:text-white"
            >
       وصف حاله العميل مع المتابعة

            </label>
            <select 
            value={formData.CustomerDealsatutsDescrep}
            onChange={handleInputChange}
            required
            name='CustomerDealsatutsDescrep'
               className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"


>
<option value="">قم بالاختيار</option>
{
 relatedCallStatus?.map((item) => {
    return <option key={item} value={item}>{item}</option>
  })
}
</select>
          </div>
                        </div>
                        
                        <div className="flex justify-end gap-4 mt-6">
                            <button
                                onClick={() => setEditModalOpen(false)}
                                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                            >
                                إلغاء
                            </button>
                            <button
                                onClick={handleUpdateSubmit}
                                className="px-4 py-2 text-white bg-main rounded hover:bg-blue-700 transition-colors"
                            >
                                حفظ التعديلات
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default CallCenterfloow;