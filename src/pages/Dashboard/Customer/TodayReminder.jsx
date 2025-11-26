import React from "react";
import {
  FaBell,
  FaPhoneAlt,
  FaCalendarAlt,
  FaCheckCircle,
} from "react-icons/fa";
import { format, differenceInDays, differenceInHours, differenceInMinutes  , formatDistanceToNow } from "date-fns";
import { FaWhatsapp } from "react-icons/fa";
import { Link } from "react-router-dom";
import useQuerygetiteams from "../../../services/Querygetiteams";
import Loader from "../../../components/common/Loader";
import CustomeTabel from '../../../components/common/CustomeTabel'

const TodayReminders = () => {
  const { data, isLoading, isError } = useQuerygetiteams(
    "customers/nextreminder",
    "customers/nextreminder"
  );

  console.log("data-notvaction", data);

  if (isLoading) {
    return <Loader />;
  }

  const reminders = data?.data?.data || [];
  const totalReminders = reminders.length;
const columns = [
  {
    name: "إسم العميل",
    selector: (row) => row?.customerName,
    width: "130px",
    cell: (row) => (
      <Link
        target="_blank"
        rel="noopener noreferrer"
        to={`/cutomers/${row.id}`}
        style={{
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {row.customerName}
      </Link>
    ),
  },
  {
    name: "جوال 1",
    width: "160px",
    cell: (row) => (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          whiteSpace: "nowrap",
        }}
      >
        <span>{row.phoneNumber}</span>
        <a
          href={`whatsapp://send?phone=${row.phoneNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#075E54", fontSize: "18px" }}
        >
          <FaWhatsapp />
        </a>
      </div>
    ),
  },
  {
    name: "المشروع",
    selector: (row) => row?.project,
    width: "200px",
    cell: (row) => (
      <span style={{ whiteSpace: "normal", wordBreak: "break-word" }}>
        {row?.project || "غير متوفر"}
      </span>
    ),
  },
  {
    name: "آخر اتصال",
    width: "150px",
    cell: (row) => <span>{row?.followDetails || "—"}</span>,
  },
  {
    name: "تاريخ التنبيه",
    selector: (row) => row.nextReminderDate,
    sortable: true,
    width: "150px",
    cell: (row) => (
      <span>
        {format(new Date(row.nextReminderDate), "dd MMMM, yyyy")}
      </span>
    ),
  },
];



  return (
    <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <FaBell className="text-yellow-500" /> تنبيهات اليوم
        </h2>
        <span className="text-sm text-gray-500">
          {new Date().toLocaleDateString("ar-SA", {
            weekday: "long",
            day: "numeric",
            month: "short",
          })}
        </span>
      </div>

      {/* Card إجمالي التنبيهات */}
      <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white p-4 rounded-xl mb-6 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <FaBell size={28} />
          <div>
            <h3 className="text-lg font-semibold">إجمالي تنبيهات اليوم</h3>
            <p className="text-sm opacity-90">
              عدد التنبيهات المسجلة لهذا اليوم
            </p>
          </div>
        </div>
        <span className="text-3xl font-bold">{totalReminders}</span>
      </div>

      {/* Empty State */}
      {totalReminders === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <FaBell size={40} className="text-gray-400 mb-3" />
          <p className="text-gray-500 text-sm">لا توجد تنبيهات لليوم 🎉</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
         
              <CustomeTabel   defaultSortField="firstPayment"
  defaultSortAsc={false}  data={data?.data?.data} columns={columns}/>
          </div>
      )}
    </div>
  );
};

export default TodayReminders;
