import React, { useState } from 'react'
import toast from 'react-hot-toast'

const TeaxtareGenralSearch = ({allwords , setWords}) => {
   
    const [newWord , setNewword] = useState("")

 const handelNewword = () => {
    const isIncluded = allwords.find((item) => item === newWord)
    if(isIncluded){
      return  toast.error("لقد قمت باضافة هذه الكلمه من قبل")
    }
    setWords((prev) => [...prev , newWord])
    toast.success("تم الاضافة بنجاح")
  return  setNewword("")
 } 
 const removeItem = (cuurent) => {
    const newItems = allwords.filter((item) => item !== cuurent)
    setWords(newItems)
    toast.success("تم الحذف بنجاح")
 }
  return (
    <div>
    <div className="mb-6 flex flex-col  gap-2">
    <label
      htmlFor="newword"
      className="w-full text-lg font-medium text-black dark:text-white"
    >
 ادخل الكلمة
  </label>
    <input
      type="text"
      id="newword"
      onChange={ (e) => setNewword(e.target.value)}
      name="phoneNumber"
  
      value={newWord}
      className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
    />
    <button type='button' className='w-full bg-main rounded-md p-4 text-white' onClick={handelNewword}> اضافة</button>
  </div>

<div className='grid grid-cols-5 gap-4'>

    {
        allwords?.map((item) => {
            return             <span 
                    key={item}
                    className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                  >
                    {item}
                    <button
                      type="button"
                      onClick={() => removeItem(item)}
                      className="text-blue-600 hover:text-blue-800 text-lg leading-none"
                    >
                      ×
                    </button>
                  </span>
        })
    }
</div>
  </div>
  )
}

export default TeaxtareGenralSearch