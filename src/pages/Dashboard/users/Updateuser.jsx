import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { FaRegPenToSquare } from "react-icons/fa6";
import Loader from '../../../components/common/Loader/index';
import toast from 'react-hot-toast';
import UploadSingalefile from '../../../hooks/UploadSingalefile';
import useQuerygetSpacficIteam from '../../../services/QuerygetSpacficIteam';
import useQueryupdate from '../../../services/useQueryupdate';
import useQuerygetiteams from '../../../services/Querygetiteams';
import { Link } from 'react-router-dom';
import PopupCheckdelete from '../../../components/common/popupmdules/PopupCheckdelete';
import useGetUserAuthentications from '../../../middleware/GetuserAuthencations';
import { useDashboardContext } from '../../../context/DashboardProviedr';
import authFetch from '../../../utils/axiosAuthfetch';
const Updateuser = () => {
    const { id } = useParams();
    const { data: roles } = useQuerygetiteams("roles", "roles");
    const [institionProjects , setInstitionProjects] = useState([])
    const { isLoading: loadingGet, data } = useQuerygetSpacficIteam("users", "users", id);
    const { updateiteam, isLoading } = useQueryupdate("users", "users");
    const { data: institutionsData } = useQuerygetiteams("InstitutionsCompany", "InstitutionsCompany");
    const { data: projectsData } = useQuerygetiteams("projects", "projects");
    const { setModuleDelete } = useDashboardContext();
    const { CanAdd, CanDelte, CanEdit, CanView, isAdmin } = useGetUserAuthentications("Employees");
    const Currentuser = data?.data;
    const navigate = useNavigate();

    // حالة البيانات المحلية لتعديلها
    const [userData, setUserData] = useState({
        fullName: "",
        email: "",
        password: "",
        phoneNumber: "",
        job: "",
        role: "",
        type: "",
        institution: "",
        allowedProjects: [],
    });
    const [image, setImage] = useState({});

    // عند تحميل بيانات المستخدم، نملأ الحالة
    useEffect(() => {
        if (Currentuser) {
            setUserData({
                fullName: Currentuser.fullName || "",
                email: Currentuser.email || "",
                password: "",
                phoneNumber: Currentuser.phoneNumber || "",
                job: Currentuser.job || "",
                role: Currentuser.role?._id || "",
                type: Currentuser.type || "",
                institution: Currentuser.institution || "",
                allowedProjects: Currentuser.allowedProjects || [],
            });
        }
    }, [Currentuser]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setImage({ file, view: URL.createObjectURL(file) });
        e.target.value = "";
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData(prev => ({ ...prev, [name]: value }));
    };

    // معالج اختيار المشاريع (Checkboxes)
    const handleProjectToggle = (projectId) => {
        setUserData(prev => {
            const current = prev.allowedProjects || [];
            const index = current.indexOf(projectId);
            if (index > -1) {
                return { ...prev, allowedProjects: current.filter(id => id !== projectId) };
            } else {
                return { ...prev, allowedProjects: [...current, projectId] };
            }
        });
    };
useEffect(() => {
  if (userData?.institution || userData?.type === "brokker") {
    const fetchProjects = async () => {
      try {
        if(userData?.institution) {
         const response = await authFetch(`/projects/InstiutionProject/${userData.institution}`);

       return setInstitionProjects( response?.data?.data || []); 
        }
        // const response = await authFetch(`/projects/InstiutionProject/${userData.institution}`);
        const PuplicProjects = await authFetch("/projects")
     
        
        setInstitionProjects(PuplicProjects?.data?.data || []);
      } catch (error) {
        console.error("Error fetching institution projects:", error);
        setInstitionProjects([]);
      }
    };
    fetchProjects();
  } else {
    setInstitionProjects([]); // مسح القائمة عند إلغاء اختيار المؤسسة
  }
}, [userData?.institution , userData?.type]);
    const handleSubmit = async (e) => {
        e.preventDefault();

        // التحقق من الحقول المطلوبة
        if (!userData.fullName) return toast.error("يجب إضافة اسم المستخدم");
        if (!userData.email) return toast.error("يجب إضافة الإيميل");
        if (!userData.phoneNumber) return toast.error("يجب إضافة الجوال");
        if (!userData.job) return toast.error("يجب إضافة الوظيفة");
        if (!userData.type) return toast.error("يجب اختيار نوع الحساب");
        if (userData.type === "InstitutionsUser" && !userData.institution) {
            return toast.error("يجب اختيار المؤسسة التابع لها");
        }

        const formData = new FormData();
        // نضيف كل الحقول مع معالجة allowedProjects
        for (const key in userData) {
            if (key === "allowedProjects") {
                formData.append(key, JSON.stringify(userData[key]));
            } else if (key === "institution" && userData.institution === "") {
                    continue;
            } else if (key === "password" && userData.password === "") {
                // إذا كانت كلمة المرور فارغة، لا نرسلها (لن يتم تحديثها)
                continue;
            } else {
                formData.append(key, userData[key]);
            }
        }
        if (image.file) {
            formData.append("image", image.file);
        }

        try {
            await updateiteam({ data: formData, id }, {
                onSuccess: () => {
                    toast.success("تم تحديث المستخدم بنجاح");
                    navigate("/All-users");
                },
                onError: (error) => {
                    const msg = error.response?.data?.mesg || "حدث خطأ أثناء التحديث";
                    toast.error(msg);
                }
            });
        } catch (error) {
            toast.error(error.response?.data?.mesg || "خطأ غير متوقع");
        }
    };

    if (isLoading || loadingGet) return <Loader />;

    const institutions = institutionsData?.data?.data || [];
    const projects = projectsData?.data?.data || [];

    return (
        <form onSubmit={handleSubmit} className='w-full h-full bg-white rounded-[10px] dark:bg-form-input'>
            <div className="dark:bg-form-input flex items-center shadow-lg gap-4 mb-4 w-full h-full p-4 bg-white rounded-[10px]">
                <div className="icon p-2 bg-main rounded-full">
                    <FaRegPenToSquare />
                </div>
                <p className="font-semibold text-lg">تعديل بيانات المستخدم</p>
            </div>

            <div className="flex gap-5 m-5">
                <Link to="/All-users" className='w-20 p-2 text-center bg-main text-white rounded-md'>
                    عوده
                </Link>
                {(isAdmin || CanDelte) && (
                    <button type='button' onClick={() => setModuleDelete(true)} className='w-20 p-2 bg-main text-white rounded-md'>
                        حذف
                    </button>
                )}
            </div>

            <div className='main-section w-full max-h-[400px] min-h-[100px] p-4 overflow-auto'>
                {/* الحقول الأساسية */}
                <div className="mb-6 flex flex-col gap-2">
                    <label className="w-full text-lg font-medium text-black dark:text-white">اسم المستخدم</label>
                    <input
                        type="text"
                        name="fullName"
                        value={userData.fullName}
                        onChange={handleInputChange}
                        className="focus:border-primary p-3 w-full outline-0 rounded-md border border-gray-300"
                    />
                </div>

                <div className="mb-6 flex flex-col gap-2">
                    <label className="w-full text-lg font-medium text-black dark:text-white">الإيميل</label>
                    <input
                        type="email"
                        name="email"
                        value={userData.email}
                        onChange={handleInputChange}
                        className="focus:border-primary p-3 w-full outline-0 rounded-md border border-gray-300"
                    />
                </div>

                <div className="mb-6 flex flex-col gap-2">
                    <label className="w-full text-lg font-medium text-black dark:text-white">الجوال</label>
                    <input
                        type="text"
                        name="phoneNumber"
                        value={userData.phoneNumber}
                        onChange={handleInputChange}
                        className="focus:border-primary p-3 w-full outline-0 rounded-md border border-gray-300"
                    />
                </div>

                <div className="mb-6 flex flex-col gap-2">
                    <label className="w-full text-lg font-medium text-black dark:text-white">الوظيفة</label>
                    <input
                        type="text"
                        name="job"
                        value={userData.job}
                        onChange={handleInputChange}
                        className="focus:border-primary p-3 w-full outline-0 rounded-md border border-gray-300"
                    />
                </div>

                <div className="mb-6 flex flex-col gap-2">
                    <label className="w-full text-lg font-medium text-black dark:text-white">نوع الحساب</label>
                    <select
                        name="type"
                        value={userData.type}
                        onChange={handleInputChange}
                        className="focus:border-primary p-3 w-full outline-0 rounded-md border border-gray-300"
                    >
                        <option value="">اختر</option>
                        <option value="admin">أدمن</option>
                        <option value="employee">موظف</option>
                        <option value="brokker">مسوق تحت التدريب</option>
                        <option value="InstitutionsUser">تابع لمؤسسة</option>
                    </select>
                </div>

                {/* حقول المؤسسة والمشاريع تظهر فقط إذا كان النوع "تابع لمؤسسة" */}
               {userData.type === "InstitutionsUser" && (
          <>
            <div className="mb-6 flex flex-col gap-2">
              <label className="w-full text-lg font-medium text-black dark:text-white">المؤسسة التابع لها</label>
              <select
                name="institution"
                value={userData.institution}
                onChange={handleInputChange}
                className="focus:border-primary p-3 w-full outline-0 rounded-md border border-gray-300"
              >
                <option value="">اختر المؤسسة</option>
                {institutions.map(item => (
                  <option key={item._id} value={item._id}>{item.name}</option>
                ))}
              </select>
            </div>

           
          </>
        )}
        {
  (userData?.institution || userData?.type === "brokker")  && (
      <div className="mb-6 flex flex-col gap-2">
              <label className="w-full text-lg font-medium text-black dark:text-white">المشاريع المسموح له العمل عليها</label>
              <div className="border rounded-md p-2 max-h-40 overflow-y-auto">
                <div className="grid grid-cols-1 gap-2">
                  {institionProjects.map(project => (
                    <label key={project._id} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                      <input
                        type="checkbox"
                        checked={userData.allowedProjects.includes(project._id)}
                        onChange={() => handleProjectToggle(project._id)}
                      />
                      <span className="text-sm">{project.projectName}</span>
                    </label>
                  ))}
                </div>
              </div>
              <small className="text-gray-500">اختر مشروعاً أو أكثر</small>
            </div>
  ) 

}

                <div className="mb-6 flex flex-col gap-2">
                    <label className="w-full text-lg font-medium text-black dark:text-white">كلمة المرور (اتركها فارغة إذا لم ترد التغيير)</label>
                    <input
                        type="password"
                        name="password"
                        value={userData.password}
                        onChange={handleInputChange}
                        placeholder="أدخل كلمة مرور جديدة لتغييرها"
                        className="focus:border-primary p-3 w-full outline-0 rounded-md border border-gray-300"
                    />
                </div>

                <div className="mb-6 flex flex-col gap-2">
                    <label className="w-full text-lg font-medium text-black dark:text-white">الصلاحية</label>
                    <select
                        name="role"
                        value={userData.role}
                        onChange={handleInputChange}
                        className="focus:border-primary p-3 w-full outline-0 rounded-md border border-gray-300"
                    >
                        <option value="">اختر</option>
                        {roles?.data?.map(item => (
                            <option key={item._id} value={item._id}>{item.name}</option>
                        ))}
                    </select>
                </div>

                <UploadSingalefile images={image} handelFile={handleFileChange} id="user" />
            </div>

            <div className="add_return flex justify-between items-center mt-4 shadow-lg p-4 bg-white dark:bg-form-input">
                <div className="add_btn">
                    <button type="submit" className="py-2 px-6 rounded-md bg-main text-white hover:bg-transparent hover:border hover:border-blue-600 hover:text-blue-600">
                        تحديث
                    </button>
                </div>
                <div className="return_btn">
                    <NavLink to="/All-users" className="bg-gray-300 text-gray-700 py-2 px-6 rounded-md">عوده</NavLink>
                </div>
            </div>

            <PopupCheckdelete value={true} navigatepage='/All-users' deleteKey="users" titale="المستخدم" id={id} />
        </form>
    );
};

export default Updateuser;