import React, { useState } from 'react';
import { SlCloudUpload } from "react-icons/sl";
import { MdAttachFile } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaFilePdf } from "react-icons/fa6";
const UploadDealyFiles = ({docs , setDocs}) => {

    const handleDeleteDoc = (docName) => {
    const newDocs = docs.filter((doc) => doc.name !== docName);
    setDocs(newDocs);
  };
      const handelDoc = (e) => {
      const selectedFiles = Array.from(e.target.files);
      setDocs((prevFiles) => [...prevFiles, ...selectedFiles]);
      e.target.value = "";
    };
  return (
    <div>
    <div className="w-full flex items-center justify-center border-t border-[#D0D5DD99]">
    
      <div className="flex flex-col items-center justify-center w-full rounded-[12px] bg-[#F1F1F7] border-dashed border-[#D0D5DD] p-4">
        <label  className='cursor-pointer w-full h-full flex items-center justify-center text-center items-center justify-center'>
       <SlCloudUpload className='text-[#666B71] text-6xl text-center' />
        </label>
        <input
  type="file"
  name="image"
  id="user-image"

  onChange={handelDoc}
accept=".pdf, .doc, .docx, .xls, .xlsx, application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
/>

      </div>
    </div>

     <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-11 h-11 flex items-center justify-center rounded-full bg-blue-100 text-blue-500">
                <MdAttachFile className="text-2xl" />
              </span>
              <p>المرفقات ({docs.length})</p>
            </div>
    
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:grid-cols-1">
              {docs.map((doc, i) => (
                <div
                  key={`${doc.name} + item ${i}`}
                  className="relative flex items-center justify-between p-4 h-16 bg-red-100 rounded-lg group"
                >
                  <div className="flex flex-col">
                    <span className="text-red-500 font-semibold">
                      {doc.name.substring(0, 10)}...
                    </span>
                    <span className="text-sm">
                      {doc.size / 1024 < 900
                        ? (doc.size / 1024).toFixed(2) + "KB"
                        : (doc.size / (1024 * 1024)).toFixed(2) + "MB"}
                    </span>
                  </div>
                  <FaFilePdf className="text-4xl text-red-500" />
                  <button
                    type="button"
                    className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-orange-500 text-white opacity-0 group-hover:opacity-100 transition"
                    onClick={() => handleDeleteDoc(doc.name)}
                  >
                    <RiDeleteBin6Line />
                  </button>
                </div>
              ))}
            </div>
          </div>
    </div>
  );
};

export default UploadDealyFiles;