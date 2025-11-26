import React, { useEffect, useState, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import allLocales from '@fullcalendar/core/locales-all';
import { useNavigate } from 'react-router-dom';
import useQuerygetiteams from '../../services/Querygetiteams';
import Breadcrumb from '../../components/common/Breadcrumbs/Breadcrumb';
import { format, formatDistanceToNow } from "date-fns";
import * as XLSX from "xlsx";
import { toast } from 'react-toastify';

const Calnder = () => {
  const { data } = useQuerygetiteams("missions", "missions");
  const { data: projects } = useQuerygetiteams("customers", "customers");
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [selectedSection, setSelectedSection] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const calendarRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      const mobileRegex = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i;
      setIsMobile(mobileRegex.test(userAgent));
    };
    checkMobile();
  }, []);

  useEffect(() => {
    if (projects?.data?.data) {
      let filteredProjects = projects?.data?.data;
      if (selectedSection) {
        filteredProjects = filteredProjects.filter(
          (item) => item.clientStatus === selectedSection
        );
      }

      const formattedProjects = filteredProjects.map((item) => ({
        id: item?._id,
        title: item?.fullName,
        date: item?.customerDate?.split("T")[0],
        start: item?.customerDate?.split("T")[0],
        extendedProps: {
          ...item,
          type: "projects",
        },
      }));

      setCalendarEvents([...formattedProjects]);
    }
  }, [projects, selectedSection]);

  const arabicTimeAgo = (date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

 const columnsfile = [
    { 
      name: "إسم المسوق", 
      selector: (row) => row.addBy || 'غير محدد' 
    },
    { 
      name: "إسم المشترى", 
      selector: (row) => row.fullName || 'غير محدد' 
    },
    { 
      name: "جوال 1", 
      selector: (row) => row.phoneNumber || 'غير محدد' 
    },
    { 
      name: "جوال 2", 
      selector: (row) => row.secondaryPhoneNumber || 'غير محدد' 
    },
    { 
      name: "مصدر العميل", 
      selector: (row) => row.source || 'غير محدد' 
    },
    { 
      name: "حالة العميل", 
      selector: (row) => row.clientStatus || 'غير محدد' 
    },
    { 
      name: "موقع المشروع", 
      selector: (row) => row.region || 'غير محدد' 
    },
    { 
      name: "المشروع المهتم به", 
      selector: (row) => row.project || 'غير محدد' 
    },
    { 
      name: "نوع العملة", 
      selector: (row) => row.currency || 'غير محدد' 
    },
    { 
      name: "الدفع كاش", 
      selector: (row) => row.cashOption || 'غير محدد' 
    },
    { 
      name: "الدفعة الأولى", 
      selector: (row) => row.firstPayment || 'غير محدد' 
    },
    { 
      name: "تقسيط على كام سنة", 
      selector: (row) => row.installmentsPyYear || 'غير محدد' 
    },
    { 
      name: "اخر ماتم التواصل مع العميل", 
      selector: (row) => row.clientendRequr || 'غير محدد' 
    },
    { 
      name: "هل تمت المعاينة", 
      selector: (row) => row.isViwed || 'غير محدد' 
    },
    { 
      name: "متطلبات العميل", 
      selector: (row) => row.clientRequire || 'غير محدد' 
    },
    { 
      name: "ملاحظات", 
      selector: (row) => row.notes || 'غير محدد' 
    },
    {
      name: "قسم المتابعة",
      selector: (row) => {
        if (!row.SectionFollow || !Array.isArray(row.SectionFollow)) {
          return 'غير محدد';
        }
        return row.SectionFollow.map((item) => {
          const userName = item?.user?.fullName || '';
          const createdAt = item?.createdAt ? arabicTimeAgo(item?.createdAt) : '';
          const details = item?.details || '';
          const detailsDate = item?.detailsDate ? format(new Date(item.detailsDate), "dd MMMM, yyyy") : 'غير محدد';
          const status = item?.CustomerDealsatuts || '';
          return `الإسم: ${userName}\nتاريخ النشر: ${createdAt}\nالتفاصيل: ${details}\nتاريخ الإتصال: ${detailsDate}\nالحالة: ${status}`;
        }).join("\n\n") || 'غير محدد';
      }
    },
    {
      name: "تاريخ الانشاء",
      selector: (row) => row.createdAt ? format(new Date(row.createdAt), "dd MMMM, yyyy") : 'غير محدد',
    },
  ];

  const handleEventClick = (info) => {
    const id = info.event.id;
    const type = info.event.extendedProps.type;
    if (type === "projects") {
      navigate(`/cutomers/${id}`);
    } else {
      navigate(`/Taskes/${id}`);
    }
  };

const downloadExcel = () => {
  try {
    if (!calendarRef.current) {
      throw new Error("Calendar instance not available");
    }
    
    const calendarApi = calendarRef.current.getApi();
    
    // Get the current view's date range
    const view = calendarApi.view;
    const startDate = view.activeStart;
    const endDate = view.activeEnd;
    
    // Filter events that fall within the current view's date range
    const visibleEvents = calendarEvents.filter(event => {
      const eventDate = new Date(event.start);
      return eventDate >= startDate && eventDate <= endDate;
    });

    if (!visibleEvents || visibleEvents.length === 0) {
      toast.warning("لا توجد بيانات معروضة للتصدير");
      return;
    }

    // Prepare data for export
    const eventsToExport = visibleEvents.map(event => {
      const extendedProps = event.extendedProps || {};
      return {
        ...extendedProps,
        title: event.title,
        date: event.start ? format(new Date(event.start), 'yyyy-MM-dd') : 'غير محدد',
        clientStatus: extendedProps.clientStatus || 'غير محدد'
      };
    });

    // Verify we have data to export
    if (eventsToExport.length === 0) {
      throw new Error("No valid data to export");
    }

    // Prepare worksheet data
    const headers = columnsfile.map(col => col.name);
    const rows = eventsToExport.map(item => 
      columnsfile.map(col => {
        try {
          if (col.name === "تاريخ الانشاء") {
            return item.createdAt ? format(new Date(item.createdAt), "dd MMMM, yyyy") : 'غير محدد';
          }
          return col.selector ? col.selector(item) : item[col.key] || 'غير محدد';
        } catch (e) {
          console.warn(`Error in column ${col.name}:`, e);
          return 'غير محدد';
        }
      })
    );

    // Create worksheet
    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    const wscols = columnsfile.map(() => ({ width: 20 }));
    worksheet['!cols'] = wscols;

    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "العملاء");

    // Generate filename based on current view
    let viewName = "التقويم";
    if (view.type === 'dayGridMonth') {
      viewName = `شهر_${format(view.activeStart, 'MMMM_yyyy')}`;
    } else if (view.type === 'timeGridWeek') {
      viewName = `أسبوع_${format(view.activeStart, 'dd_MMMM')}`;
    } else if (view.type === 'timeGridDay') {
      viewName = `يوم_${format(view.activeStart, 'dd_MMMM_yyyy')}`;
    }
    
    // Download the file
    const fileName = `عملاء_${viewName}.xlsx`;
    XLSX.writeFile(workbook, fileName);
    
    toast.success(`تم تصدير ${visibleEvents.length} عميل بنجاح`);
    
  } catch (error) {
    console.error("Error exporting data:", error);
    toast.error(`حدث خطأ أثناء تصدير البيانات: ${error.message}`);
  }
};

  return (
    <div className='w-full h-full'>
      <Breadcrumb pageName="التقويم" />
      
      <div className="mb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        {/* <div className="w-full md:w-1/2">
          <label className="block text-lg font-semibold text-gray-700 mb-2">فلترة حسب حالة العميل:</label>
          <select
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-main focus:border-main transition-all"
          >
            <option value="" className="bg-gray-100 text-gray-700">جميع العملاء</option>
            {Array.from(
              new Set(
                projects?.data?.data
                  ?.filter((project) => project?.clientStatus)
                  ?.map((project) => JSON.stringify({ name: project.clientStatus }))
              )?.map((section) => {
                const parsedSection = JSON.parse(section);
                return (
                  <option key={parsedSection.name} value={parsedSection.name}>
                    {parsedSection.name}
                  </option>
                );
              }))}
          </select>
        </div> */}
        
        <button
          onClick={downloadExcel}
          disabled={calendarEvents.length === 0}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          تصدير البيانات
        </button>
      </div>

      <div className='shadow-md w-full h-full'>
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            start: 'today prev,next',
            center: 'title',
            end: 'dayGridMonth,timeGridWeek,timeGridDay',
          }}
          height={isMobile ? 'auto' : '90vh'}
          events={calendarEvents}
          locales={allLocales}
          locale="ar"
          eventClick={handleEventClick}
          eventClassNames={() => "cursor-pointer w-full h-full"}
          eventContent={(arg) => (
            <div className="fc-event-content p-2 w-full h-full">
              <span>العميل: {arg.event?.title}</span>
              <div style={{ marginTop: '5px' }}>
                <p className="ivo-client text-wrap">الجوال: <span>{arg.event.extendedProps.phoneNumber}</span></p>
              </div>
            </div>
          )}
        />
      </div>
    </div>
  );
};

export default Calnder;