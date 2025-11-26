import React, { useState } from "react";
import { FaPaperPlane, FaPaperclip } from "react-icons/fa"; // Import icons
import Image from "../../../images/user/user-01.png";
import { FiPlus } from "react-icons/fi";
import vactor from "../../../images/icon/vactor.svg"
import vactor2 from "../../../images/icon/Group.svg"
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import Loader from "../../common/Loader";
import useQueryadditeam from "../../../services/Queryadditeam"
import Messsages from "./Messsages";
import UploadFiles from "../../../hooks/UpoladFiles";
const ChatBox = ({CurrentMissionTitle , chatid}) => {
    const {addIteam , isLoading} = useQueryadditeam("messages" , "messages")
    const [message, setMessage] = useState("");
    const [images , setImages] = useState([])
    const [viewmenu , setViewmenu] = useState(false)
    const [docs , setDocs] = useState([])
    const user = useSelector((state) => state.userState.userinfo )
      const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setImages((prevFiles) => [...prevFiles, ...selectedFiles]);
    e.target.value = "";
  };
  const handelDoc = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setDocs((prevFiles) => [...prevFiles, ...selectedFiles]);
    e.target.value = "";
  };
  const handeMessage = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
  
    const data = Object.fromEntries(formData);
        docs.forEach((item) => {
          formData.append("files" , item)
        })
        images.forEach((item) => {
          formData.append("files" , item)
        })
        formData.set("content" , message)
     formData.set("senderID" , user?._id)
     formData.set("chatID" , chatid)

       data.content = message
       data.senderID = user?._id
       data.chatID = chatid
    if(!message){
      toast.error("يجب إضافه محتوى الرسالة")
        return ;
    }


    try {
    
        
        addIteam(formData , {
            onSuccess:() =>{
             
                e.target.reset()
                setMessage("")
                setImages([])
                setDocs([])
                toast.success("تم  الإرسال بنجاح")
              
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
if(isLoading) {
    return <Loader />
}
    return (
        <div className="w-full bg-white dark:bg-gray-900 rounded-lg shadow-md">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <span className="text-xl font-semibold text-gray-900 dark:text-white">{CurrentMissionTitle }</span>
            </div>

            {/* Messages Container */}
          
            <Messsages chatID={chatid} />
            {/* Message Input */}
            {
                images?.length > 0 || docs?.length > 0 ?
                 <UploadFiles  images={images} setImages={setImages} docs={docs} setDocs={setDocs}/>
 : null 
            }

            <form onSubmit={handeMessage} className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center flex-col lg:flex-row gap-2">
                    {/* <button type="button" className="text-gray-600 dark:text-gray-300 hover:text-blue-500">
                        <FaPaperclip size={20} />
                    </button> */}

                    {/* Input Field */}
               <textarea
  value={message}
  onChange={(e) => setMessage(e.target.value)}
  className="w-full min-h-[200px] resize-y rounded-md border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white p-3"
  placeholder="اكتب رسالتك هنا..."
/>


                    {/* Send Button */}
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full transition duration-300"
                    >
                        <FaPaperPlane size={20} />
                    </button>
                       <div className="add_files p-4">
                          <div className="relative inline-block text-left">
                            <button
                              className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-white bg-main rounded-md "
                              type="button"
                              id="menu-button"
                              aria-expanded="true"
                              aria-haspopup="true"
                              onClick={() => setViewmenu(!viewmenu)}
                            >
                              <div className="flex items-center gap-2">
                                <FiPlus />  
                              </div>
                            </button>
                    
                            {/* Dropdown menu */}
                            {
                              viewmenu &&  <div
                              className="absolute top-[-100px] left-[20px] z-10 w-56 mt-2 bg-white border border-gray-200 rounded-md shadow-lg focus:outline-none"
                              role="menu"
                              aria-orientation="vertical"
                              aria-labelledby="menu-button"
                            >
                              <label
                                htmlFor="files"
                                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                                role="menuitem"
                              >
                                <img src={vactor} alt="Vector" />
                                اختر من الملفات
                              </label>
                              <input
                                type="file"
                                multiple
                                className="hidden"
                                name="files"
                                id="files"
                                onChange={handelDoc}
                                  accept="
    application/pdf,
    application/msword,
    application/vnd.openxmlformats-officedocument.wordprocessingml.document,
    application/vnd.ms-excel,
    application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
  "
                              />
                              <label
                                htmlFor="image-video"
                                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                                role="menuitem"
                              >
                                <img src={vactor2} alt="Group" />
                                اختر صورة  
                              </label>
                              <input
                                type="file"
                                name="files"
                                onChange={handleFileChange}
                                accept="image/png, image/jpeg, video/mp4"
                                multiple
                                className="hidden"
                                id="image-video"
                              />
                            </div>
                            }
                          
                          </div>
                      
                            </div>
                </div>
            </form>
        </div>
    );
};

export default ChatBox;
