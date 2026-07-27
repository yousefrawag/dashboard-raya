import React from 'react';
import { useParams, Link } from 'react-router-dom';
import useQuerygetSpacficIteam from '../../services/QuerygetSpacficIteam';
import Loader from '../../components/common/Loader';
import { format } from 'date-fns';
import { FaBuilding, FaProjectDiagram, FaUsers, FaPhone, FaArrowLeft } from 'react-icons/fa';
import { MdOutlineEdit, MdDelete } from 'react-icons/md';

const InstuitionByid = () => {
  const { id } = useParams();
  const { isLoading, data } = useQuerygetSpacficIteam('InstitutionsCompany', 'InstitutionsCompany', id);

  if (isLoading) {
    return <Loader />;
  }

  // التأكد من وجود البيانات
  const institutionData = data?.data || {};
  const institution = institutionData.institution || {};
  const projects = institutionData.projects || [];
  const customers = institutionData.customers || [];
console.log("institutionData" , institutionData);

  return (
    <div className="container mx-auto p-4 md:p-6">
      {/* زر الرجوع */}
      <Link
        to="/InstitutionsCompany"
        className="inline-flex items-center gap-2 text-main hover:underline mb-6"
      >
        <FaArrowLeft />
        <span>العودة إلى المؤسسات</span>
      </Link>

      {/* معلومات المؤسسة */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <FaBuilding className="text-main text-3xl" />
          <h1 className="text-2xl font-bold text-gray-800">{institution.name || 'غير محدد'}</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-gray-600">
          <div>
            <span className="font-semibold">الحالة:</span>
            <span className={`mr-2 px-2 py-1 rounded-full text-sm ${
              institution.status === 'active' ? 'bg-green-100 text-green-700' :
              institution.status === 'غير نشط' ? 'bg-red-100 text-red-700' :
              'bg-gray-100 text-gray-700'
            }`}>
              {institution.status || 'غير محدد'}
            </span>
          </div>
          {/* <div>
            <span className="font-semibold">تاريخ الإنشاء:</span>
            <span className="mr-2">
              {institution.createdAt ? format(new Date(institution.createdAt), 'dd MMMM, yyyy') : 'غير معروف'}
            </span>
          </div> */}
          <div>
            <span className="font-semibold">عدد المشاريع:</span>
            <span className="mr-2">{projects.length}</span>
          </div>
          <div>
            <span className="font-semibold">عدد العملاء:</span>
            <span className="mr-2">{customers.length}</span>
          </div>
        </div>
      </div>

      {/* المشاريع */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <FaProjectDiagram className="text-blue-600 text-2xl" />
          <h2 className="text-xl font-semibold text-gray-800">المشاريع التابعة للمؤسسة</h2>
        </div>
        {projects.length === 0 ? (
          <div className="text-gray-500">لا توجد مشاريع لهذه المؤسسة</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <div
                key={project._id}
                className="bg-white rounded-lg shadow-md p-4 border border-gray-100 hover:shadow-lg transition-shadow"
              >
                <Link to={`/projects-main/${project._id}`}>
                  <h3 className="text-lg font-semibold text-main hover:underline">
                    {project.projectName || 'غير مسمى'}
                  </h3>
                </Link>
                <div className="mt-2 text-sm text-gray-600">
                  <span className="font-medium">نوع المساهمة:</span>
                  <span className="mr-2">{project.contributionType || 'غير محدد'}</span>
                </div>
                <div className="mt-3">
                  <Link
                    to={`/projects-main/${project._id}`}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    عرض التفاصيل
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* العملاء */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <FaUsers className="text-green-600 text-2xl" />
          <h2 className="text-xl font-semibold text-gray-800">العملاء المهتمون بمشاريع المؤسسة</h2>
        </div>
        {customers.length === 0 ? (
          <div className="text-gray-500">لا يوجد عملاء مرتبطون بهذه المؤسسة</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {customers.map((customer) => (
              <div
                key={customer._id}
                className="bg-white rounded-lg shadow-md p-4 border border-gray-100 hover:shadow-lg transition-shadow"
              >
                <Link to={`/cutomers/${customer._id}`}>
                  <h3 className="text-lg font-semibold text-main hover:underline">
                    {customer.fullName || 'غير معروف'}
                  </h3>
                </Link>
                <div className="mt-2 text-sm text-gray-600 flex items-center gap-2">
                  <FaPhone className="text-gray-400" />
                  <span>{customer.phoneNumber || 'لا يوجد رقم'}</span>
                </div>
                {customer.project && (
                  <div className="mt-1 text-sm text-gray-600">
                    <span className="font-medium">مهتم بمشروع:</span>
                    <span className="mr-2">{customer.project}</span>
                  </div>
                )}
                <div className="mt-3">
                  <Link
                    to={`/cutomers/${customer._id}`}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    عرض التفاصيل
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InstuitionByid;