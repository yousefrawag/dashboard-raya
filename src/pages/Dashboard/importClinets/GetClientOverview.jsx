import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { format } from 'date-fns';
import {
  FiEdit,
  FiArrowRight,
  FiUser,
  FiMail,
  FiPhone,
  FiBriefcase,
  FiTag,
  FiStar,
  FiGlobe,
  FiFlag,
  FiMessageSquare,
  FiCalendar,
} from 'react-icons/fi';

import HeadPagestyle from '../../../components/common/HeadPagestyle';
import useQuerygetSpacficIteam from '../../../services/QuerygetSpacficIteam';
import StatusFilterTabs from '../../../components/common/StatusFilterTabs';
import ImportFoloowUpdata from './importFoloowUpdata';
import Loader from '../../../components/common/Loader';

/* =========================================================
   دالة format آمنة - بتمنع RangeError: Invalid time value
   ========================================================= */
const formatDate = (date, fmt = 'dd MMMM, yyyy') => {
  if (!date) return null;
  const d = new Date(date);
  if (isNaN(d.getTime())) return null;
  try {
    return format(d, fmt);
  } catch {
    return null;
  }
};

const GetClientOverview = () => {
  const { id } = useParams();
  const { isLoading, data } = useQuerygetSpacficIteam(
    'importClients',
    'importClients',
    id
  );

  const client = data?.data;
  const [activeTab, setActiveTab] = useState('info');

  const statusConfig = {
    info: {
      label: 'بيانات العميل',
      className: 'text-yellow-600 hover:text-yellow-700',
      icon: 'clock',
    },
    followup: {
      label: 'المتابعات والاتصالات',
      className: 'text-yellow-600 hover:text-yellow-700',
      icon: 'clock',
    },
    ordears: {
      label: 'الطلبات',
      className: 'text-yellow-600 hover:text-yellow-700',
      icon: 'clock',
    },
  };

  if (isLoading) return <Loader />;

  if (!client) {
    return (
      <p className="text-center text-red-500 text-xl font-semibold py-10">
        لم يتم العثور على بيانات العميل
      </p>
    );
  }

  // آخر متابعة (مع safe guard)
  const lastFollow = client?.SectionFollow?.length
    ? [...client.SectionFollow].sort(
        (a, b) => new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0)
      )[0]
    : null;

  const clientDetails = [
    { label: 'اسم العميل', value: client?.fullName, icon: <FiUser /> },
    {
      label: 'الجوال',
      value: client?.phoneNumber,
      icon: <FiPhone />,
      dir: 'ltr',
    },
    {
      label: 'جوال إضافي',
      value: client?.secondaryPhoneNumber || 'غير متوفر',
      icon: <FiPhone />,
      dir: 'ltr',
    },
    {
      label: 'البريد الإلكتروني',
      value: client?.email || 'غير متوفر',
      icon: <FiMail />,
      dir: 'ltr',
    },
    {
      label: 'نوع العميل',
      value: client?.customerType || 'غير متوفر',
      icon: <FiBriefcase />,
    },
    {
      label: 'نوع الاهتمام',
      value: client?.interestType || 'غير متوفر',
      icon: <FiTag />,
    },
    {
      label: 'أولوية العميل',
      value: client?.priority || 'غير متوفر',
      icon: <FiStar />,
    },
    {
      label: 'مصدر العميل',
      value: client?.source || 'غير متوفر',
      icon: <FiGlobe />,
    },
    {
      label: 'حالة العميل',
      value: client?.clientStatus || 'غير متوفر',
      icon: <FiFlag />,
    },
    {
      label: 'وصف حالة العميل',
      value: client?.relatedStauts || 'غير متوفر',
      icon: <FiMessageSquare />,
    },
    {
      label: 'عدد المتابعات',
      value: client?.SectionFollow?.length || 0,
      icon: <FiMessageSquare />,
    },
    {
      label: 'عدد الطلبات',
      value: client?.clientRequirements?.length || 0,
      icon: <FiTag />,
    },
    {
      label: 'تاريخ آخر تواصل',
      value:
        formatDate(lastFollow?.detailsDate || lastFollow?.createdAt) ||
        'غير مضاف',
      icon: <FiCalendar />,
    },
    {
      label: 'تاريخ الإنشاء',
      value: formatDate(client?.createdAt) || 'غير متوفر',
      icon: <FiCalendar />,
    },
  ];

  return (
    <div className="w-full h-full" dir="rtl">
      <HeadPagestyle
        pageName="بيانات العميل"
        to="/import-clinets"
        title="عوده"
      />

      <StatusFilterTabs
        statusConfig={statusConfig}
        onStatusChange={(key) => setActiveTab(key)}
        selectedStatus={activeTab}
      />

      {/* Actions */}
      <div className="flex gap-4 m-5 flex-wrap">
        <Link
          to={`/edit-import-client/${id}`}
          className="py-2 px-6 bg-main text-white rounded-md flex items-center gap-2 hover:bg-blue-700 transition-colors"
        >
          <FiEdit /> تعديل
        </Link>
        <Link
          to="/import-clinets"
          className="py-2 px-6 bg-gray-200 text-gray-700 rounded-md flex items-center gap-2 hover:bg-gray-300 transition-colors"
        >
          <FiArrowRight /> عوده
        </Link>
      </div>

      {/* ============================================
          تاب: بيانات العميل
      ============================================ */}
      {activeTab === 'info' && (
        <div className="px-5 pb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {clientDetails.map((item, i) => (
              <InfoCard key={i} {...item} />
            ))}
          </div>

          {client?.notes && (
            <div className="mt-4">
              <InfoCard
                label="ملاحظات"
                value={client.notes}
                icon={<FiMessageSquare />}
                full
              />
            </div>
          )}
        </div>
      )}

      {/* ============================================
          تاب: المتابعات والاتصالات  ✅ اتصلح من contacts لـ followup
      ============================================ */}
      {activeTab === 'followup' && (
        <ImportFoloowUpdata
          id={id}
          SectionFollow={client?.SectionFollow || []}
        />
      )}

      {/* ============================================
          تاب: الطلبات
      ============================================ */}
      {activeTab === 'ordears' && (
        <div className="p-8 text-center text-gray-500 border border-dashed border-gray-300 rounded-md m-5">
          قريباً — عرض طلبات العميل
        </div>
      )}
    </div>
  );
};

/* =========================================================
   كارت لعرض تفصيلة
   ========================================================= */
const InfoCard = ({ label, value, icon, dir, full }) => (
  <div
    className={`bg-white dark:bg-form-input rounded-lg border border-gray-200 dark:border-form-strokedark shadow-sm hover:shadow-md transition-shadow p-4 ${
      full ? 'md:col-span-2 xl:col-span-3' : ''
    }`}
  >
    <div className="flex items-center gap-2 mb-2">
      {icon && <span className="text-main text-base">{icon}</span>}
      <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
        {label}
      </span>
    </div>
    <p
      className="text-base text-black dark:text-white font-semibold break-words"
      dir={dir}
    >
      {value || '—'}
    </p>
  </div>
);

export default GetClientOverview;