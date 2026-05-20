import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaRegPenToSquare } from "react-icons/fa6";
import SelectoptionHook from '../../../hooks/SelectoptionHook';
import useQueryadditeam from '../../../services/Queryadditeam';
import Loader from '../../../components/common/Loader/index';
import toast from 'react-hot-toast';
import useQuerygetiteams from '../../../services/Querygetiteams';

const AddTask = () => {
    const {data} = useQuerygetiteams("users" , "users")
    const types = ["مشروع عام", "مشروع خاص"];
    const [missionType, setMissionType] = useState("مشروع عام");
    const [project, setProject] = useState("");
    const [privetProject, setPrivetProject] = useState("");
    const [selectedUsers, setSelectedUsers] = useState([]); // Array for selected users
    const [requirements, setRequirements] = useState([]); // Array for mission requirements
    const [newRequirement, setNewRequirement] = useState(""); // For inputting a new requirement
    const [search, setSearch] = useState(""); // Search input state
    const [users , setUsers] = useState()
    const { addIteam, isLoading } = useQueryadditeam("missions", "missions");
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
        data.assignedTo = selectedUsers
        data.missionType = missionType
        data.requirements = requirements
        if (missionType === "مشروع عام") {
            if(!project) {
                return toast.error("يجب إضافة مشروع عام")
            }
            data.project = project; // Set public project

            data.Privetproject = null; // Ensure Privetproject is null for public projects
        } else if (missionType === "مشروع خاص") {
            if(!privetProject) {
                return toast.error("يجب إضافة مشروع خاص")
            }
            data.Privetproject = privetProject; // Set private project
            data.project = null; // Ensure project is null for private projects
        }
       
        if (!data?.deadline) {
            toast.error("يجب إضافه موعد التسليم");
            return;
        }
        if (selectedUsers.length === 0) {
            toast.error("يجب إضافه الموظفين المعنين بالمهمة");
            return;
        }
        if(requirements.length === 0) {
         return   toast.error("يجب إضافة متطلبات المهمة")
        }
     

        try {
            addIteam(
             data,
                {
                    onSuccess: () => {
                        e.target.reset();
                        setSelectedUsers([]);
                        setRequirements([]);
                        toast.success("تم إضافه مهمة جديد");
                        navigate("/Taskes");
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
const handelnewTask = () => {
    const founItem = requirements.find((item) => item === newRequirement)
    if(founItem){
        return toast.error("لقد قمت بإدخال هذا الطلب من قبل")
    }
    const requirement = {
        type: newRequirement.trim(), // Set the "type" field
        completed: false, // Default value for "completed"
        userEdit: null, // Default value for "userEdit"
      }
    setRequirements((prev) => ([...prev , requirement]))
    setNewRequirement("")
}
const handelDeleteequire = (req) => {
    const newRequermentsupdate = requirements.filter((item) => item !== req)
    setRequirements([...newRequermentsupdate])
}
    if (isLoading) {
        return <Loader />;
    }

    return (
        <form onSubmit={handleSubmit} className='w-full h-full bg-white rounded-[10px] dark:bg-form-input'>
            <div className="dark:bg-form-input flex items-center shadow-lg gap-4 mb-4 w-full h-full p-4 bg-white rounded-[10px]">
                <div className="icon p-2 bg-main rounded-full">
                    <FaRegPenToSquare />
                </div>
                <p className="font-semibold text-lg">ادخل بيانات المهمة</p>
            </div>

            <div className='main-section w-full max-h-[400px] min-h-[100px] p-4 overflow-auto'>
                {/* <div className="mb-6 flex flex-col gap-2">
                    <label htmlFor="title" className="w-full text-lg font-medium text-black dark:text-white">
                        عنوان المهمة
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
                    />
                </div> */}

                <div className='w-full flex gap-2'>
                    {types.map((item) => (
                        <button
                            onClick={() => setMissionType(item)}
                            className={`w-[150px] p-4 ${missionType === item ? "bg-main text-white" : "dark:text-white border-[1px] border-main bg-transbarent text-black"} rounded-[6px]`}
                            type='button'
                            key={item}
                        >
                            {item}
                        </button>
                    ))}
                </div>

                {missionType === "مشروع عام" ? (
                    <SelectoptionHook
                        fectParentKEY="projects"
                        keyName="projects"
                        title="مشروع عام"
                        value={project}
                        setvalue={setProject}
                    />
                ) : (
                    <SelectoptionHook
                        fectParentKEY="Privetprojects"
                        keyName="Privetprojects"
                        title="مشروع خاص"
                        value={privetProject}
                        setvalue={setPrivetProject}
                    />
                )}

                    <div className="mb-6 flex flex-col gap-2">
                            <label className="w-full text-lg font-medium text-black dark:text-white">
                            الموظفين المعينون
                            </label>
                            <input
                            type="text"
                            placeholder="بحث عن موظف..."
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
                                <span className="text-black dark:text-white">{user?.fullName} -  {user?.type ==="admin" ? "أدمن" : user?.type === "employee" ? "مسوق أساسى" :"مسوق تحت التدريب"} </span>
                                </label>
                            ))}
                            </div>
                    </div>
               
                <div className="mb-6 flex flex-col gap-2">
                    <label htmlFor="deadline" className="w-full text-lg font-medium text-black dark:text-white">
                        موعد التسليم المنتظر
                    </label>
                    <input
                        type="date"
                        id="deadline"
                        name="deadline"
                        className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
                    />
                </div>
                <span  className='text-lg mb-10 text-black dark:text-white'>متطلبات المهمة</span>
                <div className='flex gap-3 flex-col lg:flex-row'>
                    <input type="text"  
                    value={newRequirement}
                    onChange={(e) =>setNewRequirement(e.target.value)}
                    className=" w-full lg:w-[80%] mb-2 focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
 />
                <button onClick={handelnewTask} className='w-full lg:w-[20%] py-2 px-6 rounded-md bg-main text-white hover:bg-transparent hover:border hover:border-blue-600 hover:text-blue-600' type='button'>إضافة</button>
                </div>
                <ul className="mt-7 grid grid-cols-2 lg:grid-cols-3 gap-4">
                        {requirements.map((req, index) => (
                            <li key={index} className=" flex justify-between text-black dark:text-white shadow-md border-[1px] border-gary-500 p-4 rounded-[10px]">
                                - {req.type}
                                <button onClick={() => handelDeleteequire(req)} type='button' className='font-bold text-red-500 '>x</button>
                            </li>
                        ))}
                    </ul>
                <div className="mb-6 flex flex-col gap-2">
                    <label htmlFor="description" className="w-full text-lg font-medium text-black dark:text-white">
                        ملاحظات 
                    </label>
                    <textarea
                        name="description"
                        className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
                    ></textarea>
                </div>
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
                    <NavLink to="/Taskes" className="bg-gray-300 text-gray-700 py-2 px-6 rounded-md">
                        عوده
                    </NavLink>
                </div>
            </div>
        </form>
    );
};

export default AddTask;
