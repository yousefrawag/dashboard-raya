import React from 'react'
import CustomeTabel from '../../../components/common/CustomeTabel'
import { HiArrowLongRight } from "react-icons/hi2";
import { NavLink, useNavigate } from "react-router-dom";
import { MdLibraryAddCheck } from "react-icons/md";
import { PiPencilLineThin } from "react-icons/pi";
import useQueryadditeam from '../../../services/Queryadditeam';
import { useState } from 'react'
import HeadPagestyle from '../../../components/common/HeadPagestyle';
const Addpermission = () => {
    const { isError , isLoading , addIteam} = useQueryadditeam("roles" , "roles")
    const [permissions, setPermissions] = useState([]);
    const navigate = useNavigate();
  // handel check box s 
    const handleCheckboxChange = (event) => {
      const { name, checked } = event.target;
      setPermissions((prevPermissions) => {
        if (checked) {
          return [...prevPermissions, name];
        } else {
          return prevPermissions.filter((permission) => permission !== name);
        }
      });
    };
  
    const columns = [
      {
        name: "صلاحيه",
        selector: (row) => row.validity,
      },
      {
        name: " مشاهده ",
        cell: (row) => (
          <input
            type="checkbox"
            name={`canView${row.key}`}
            checked={permissions.includes(`canView${row.key}`)}
            onChange={handleCheckboxChange}
          />
        ),
      },
      {
        name: " إضافه ",
        cell: (row) => (
          <input
            type="checkbox"
            name={`canAdd${row.key}`}
            checked={permissions.includes(`canAdd${row.key}`)}
            onChange={handleCheckboxChange}
          />
        ),
      },
      {
        name: "تعديل",
        cell: (row) => (
          <input
            type="checkbox"
            name={`canEdit${row.key}`}
            checked={permissions.includes(`canEdit${row.key}`)}
            onChange={handleCheckboxChange}
          />
        ),
      },
      {
        name: " حذف",
        cell: (row) => (
          <input
            type="checkbox"
            name={`canDelete${row.key}`}
            checked={permissions.includes(`canDelete${row.key}`)}
            onChange={handleCheckboxChange}
          />
        ),
      },
    ];
  
    const data = [
      { id: 1, key: "Projects", validity: "المشاريع العامه" },
      { id: 1, key: "PrivetProjects", validity: "المهام الخاصه" },
      { id: 2, key: "Reports", validity: "التقارير" },

      { id: 31, key: "clander", validity: " التقويم" },
        { id: 38, key: "clanderCustomer", validity: " تقويم العملاء" },
      { id: 4, key: "Missions", validity: "المهام" },
      { id: 5, key: "Clients", validity: "العملاء" },
      { id: 6, key: "Employees", validity: "الموظفين" },
       { id: 60, key: "expensee", validity: "المصروفات" },
   
      { id: 8, key: "Administration", validity: "إحصائيات النظام" },
      { id: 9, key: "location", validity: "مناطق المشاريع" },
       
          { id: 11, key: "projectstypes", validity: "أنواع العقارات" },
               { id: 12, key: "projectstuts", validity: "حالات العقارات" },
                  { id: 120, key: "requiremnts", validity: "طلبات العملاء" },
                { id: 13, key: "appCurency", validity: "العملات" },
                         { id: 14, key: "CustomerTypes", validity: "انواع العملاء" }, 
                          { id: 15, key: "isvewied", validity: "هل تمت المعاينة" },
                             { id: 16, key: "callcentercustomer", validity: "حالات العميل قسم المتابعة" },
     
  
    ];
  
    const handleSubmit = (event) => {
      event.preventDefault();
      const form = event.currentTarget;
    const name = form.elements['name'].value;
  
    // Construct the data object
    const data = {
      name,
      permissions, // permissions array already contains the permission strings
    };
  addIteam(data , {
    onSuccess:() => {
      toast.success("تم إاضافه صلاحيه جديده")
      navigate("/permissions")
    }
  }) 
  event.target.reset()
  setPermissions([])
  navigate('/permissions')
    };
  return (
    <div>
        <HeadPagestyle pageName="إضافة صلاحية" to="/permissions" title="عوده" />
         <div className="add_permissions_box">
          <form onSubmit={handleSubmit}>
         

            <div className="main_parent_in">
              <div className="permission_name">
              <div className="mb-6 flex flex-col  gap-2">
                        <label
                            htmlFor="name"
                            className="w-full text-lg font-medium text-black dark:text-white"
                        >
                            إسم الصلاحية
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                    
                            className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
                        />
                    
            </div>
             
              </div>
            </div>

            <CustomeTabel data={data} columns={columns} />

            <div className="add_return flex justify-between items-center mt-4 shadow-lg p-4 bg-white dark:bg-form-input">
              <div className="add_btn">
                  <button type="submit"  className={` py-2 px-6 rounded-md bg-main text-white hover:bg-transparent hover:border hover:border-blue-600 hover:text-blue-600`}>
                   إضافة
                  </button>
                </div>
                <div className="return_btn">
                  <NavLink to="/permissions" className="bg-gray-300 text-gray-700 py-2 px-6 rounded-md">عوده</NavLink>
                </div>
              
              </div>
          </form>
        </div>
    </div>
  )
}

export default Addpermission