import React, { useState } from 'react';
import useQuerygetSpacficIteam from '../../../services/QuerygetSpacficIteam';
import Loader from '../../common/Loader';
import { formatDate, formatDistanceToNow } from 'date-fns';
import { FaFilePdf } from "react-icons/fa";
import useQueryDelete from '../../../services/useQueryDelete';
import useQueryupdate from '../../../services/useQueryupdate';
import toast from 'react-hot-toast';

const arabicTimeAgo = (date) => {
    const timeAgo = formatDistanceToNow(new Date(date), { addSuffix: true });

    // Replace English words with Arabic equivalents
    return timeAgo
       
};

const Messages = ({ chatID }) => {
    const { data, isLoading } = useQuerygetSpacficIteam("messages", "messages", chatID);
    const {deleteIteam} = useQueryDelete("messages" , "messages")
    const {updateiteam} = useQueryupdate("messages" , "messages")
        const [editModalOpen, setEditModalOpen] = useState(false);
        const [currentItem, setCurrentItem] = useState(null);
        const [formData, setFormData] = useState({
         content:"" ,
         
        });
       const handleEditClick = (item) => {
            setCurrentItem(item);
            setFormData({
                content: item.content,
                id:item._id
           
            });
            setEditModalOpen(true);
        };
    
        // Handle form input changes
        const handleInputChange = (e) => {
            const { name, value } = e.target;
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        };
  const handleUpdateSubmit = () => {
        const data = {
            content:formData.content
        };
console.log(formData);

        updateiteam(
            { data, id:formData.id },
            {
                onSuccess: (response) => {
                    toast.success("تم تحديث بيانات  بنجاح");
                    setFormData({
                        content:"",
                        id:""
                    })
                    setEditModalOpen(false);
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
    if (isLoading) {
        return <Loader />;
    }

    return (
        <div className="p-4 h-[400px] overflow-y-auto space-y-4">
            {data?.messages?.map((item) => (
                <div key={item?._id} className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-sm">
                  {
                    item?.updated && <span className='p-2 mt-4 w-10 h-10 bg-green-500 text-white rounded-md'>
تم تعديل الرسالة 
                    </span>
                  }
                    
                      <div className='flex gap-4 w-full justify-end'>
                            <button 
                                onClick={() => deleteIteam(item?._id)} 
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
                            <img src={item?.senderID?.imageURL} alt="user" className="w-10 h-10 rounded-full" />
                            <span className="ml-2 font-medium text-gray-900 dark:text-white">{item?.senderID?.name || item?.senderID?.fullName }</span>
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            {arabicTimeAgo(item?.createdAt)}
                        </span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">{item?.content}</p>
                    <div className='flex flex-col lg:flex-row gap-3'>
     {
                         item?.imagesURLs[0] &&
                               <a href={item?.imagesURLs[0]?.fileURL} target="_blank" className='w-20 h-20' rel="noopener noreferrer">
                                                                        <img src={item?.imagesURLs[0]?.fileURL} alt="file-image" className="w-20 h-20 " />

                    </a>
                    }
                         {
                         item?.docsURLs[0] &&
                               <a href={item?.docsURLs[0]?.fileURL} target="_blank" className='w-20 h-20' rel="noopener noreferrer">
                                    <FaFilePdf  size={24} className='text-red-500'/>
                                                                       

                    </a>
                    }

                    </div>
               
             

                </div>
            ))}
                {/* Edit Modal */}
            {editModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                            تعديل الرسالة 
                        </h3>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    الرسالة
                                </label>
                                <textarea
                                    name="content"
                                    value={formData.content}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
                                    rows="3"
                                />
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
        </div>
    );
};

export default Messages;
