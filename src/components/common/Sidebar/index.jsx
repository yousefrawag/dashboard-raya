import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Logo from '../../../images/logo/logo.png';
import {
  FaTachometerAlt,
  FaUsers,
  FaTasks,
  FaProjectDiagram,
  FaChartLine,
  FaBuilding,
  FaWhatsapp,
  FaArchive,
  FaUserTie,
  FaRegFileAlt,
  FaRegCalendarCheck,
  FaRegCalendarPlus,
  FaGripHorizontal,
  FaLink,
  FaUser,
  FaBell,
  FaSearch,
  FaBullhorn,
  FaFolderOpen,
  FaHome,
  FaLock,
  FaShareAlt,
  FaClipboardList,
  FaChartPie,
  FaChartBar,
  FaClock,
  FaCalendarDay,
  FaBalanceScale,
  FaUserGraduate,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaUserShield,
  FaUserPlus,
  FaPoll,
  FaLightbulb,
  FaTag,
  FaMapMarkerAlt,
  FaFlag,
  FaRulerCombined,
  FaMoneyBill,
  FaDollarSign,
  FaLayerGroup,
  FaCheckCircle,
  FaUserTag,
  FaFileInvoice,
  FaEye,
  FaPhoneAlt,
  FaBriefcase,
} from 'react-icons/fa';
import { MdOutlineSecurity } from 'react-icons/md';

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const user = useSelector((state) => state.userState.userinfo);
  const isAdmin = user?.type === 'admin';
  const permissions = user?.role?.permissions || [];

  const hasPermission = (key) => {
    if (!key) return true;
    return isAdmin || permissions?.some((p) => p === key);
  };

  const location = useLocation();
  const { pathname } = location;

  const trigger = useRef(null);
  const sidebar = useRef(null);

  const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true'
  );

  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      ) return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  }, [sidebarOpen, setSidebarOpen]);

  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  }, [sidebarOpen, setSidebarOpen]);

  useEffect(() => {
    localStorage.setItem('sidebar-expanded', sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector('body')?.classList.add('sidebar-expanded');
    } else {
      document.querySelector('body')?.classList.remove('sidebar-expanded');
    }
  }, [sidebarExpanded]);

  const [openDropdowns, setOpenDropdowns] = useState({});
  const toggleDropdown = (id) => {
    setOpenDropdowns(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // ---------- Configuration with icons for every item ----------
  const sections = [
    // Standalone links
    { type: 'link', id: 'dashboard', label: 'لوحه تحكم', path: '/', icon: FaTachometerAlt },
   
    // العملاء
    {
      type: 'dropdown',
      id: 'clients',
      label: 'العملاء',
      icon: FaUsers,
      children: [
        { label: 'العملاء', path: '/cutomers', icon: FaUser, permission: 'canViewClients' },
        { label: 'تنبيهات العملاء', path: '/User-Reminder', icon: FaBell },
        { label: 'بحث متقدم', path: '/Recommendations', icon: FaSearch, permission: 'canViewClients' },
        { label: 'تقارير العملاء', path: '/cutomer-reports', icon: FaRegFileAlt, permission: 'canViewReports' },
        { label: 'عملاء الحملات', path: '/customers-leads', icon: FaBullhorn, permission: 'canViewClients' },
        { label: 'عملاء مسوقين تحت التدريب', path: '/borkers-customers', icon: FaUserGraduate, permission: 'canViewReports' },

      ],
    },

    // المشاريع
    {
      type: 'dropdown',
      id: 'projects',
      label: 'المشاريع',
      icon: FaProjectDiagram,
      children: [
        { label: 'جميع مشاريع', path: '/projects-main', icon: FaFolderOpen, permission: 'canViewProjects' },
        { label: 'الشقق', path: '/projects/properties', icon: FaHome, permission: 'canViewProjects' },
      ],
    },

    // المهام
    {
      type: 'dropdown',
      id: 'tasks',
      label: 'المهام',
      icon: FaTasks,
      children: [
        { label: 'المهام الخاصة', path: '/privte-projects', icon: FaLock, permission: 'canViewPrivetProjects' },
        { label: 'توزيع المهام', path: '/Taskes', icon: FaShareAlt, permission: 'canViewMissions' },
        { label: 'تقارير المهام', path: '/missions-repoart', icon: FaClipboardList, permission: 'canViewMissions' },
      ],
    },

    // التقارير والتوصيات
    {
      type: 'dropdown',
      id: 'reports',
      label: 'التقارير والتوصيات',
      icon: FaChartLine,
      children: [
        { label: 'التقارير والتوصيات', path: '/Boardin-Reports', icon: FaChartPie, permission: 'canViewReports' },
        { label: 'تقارير المهام', path: '/missions-repoart', icon: FaClipboardList, permission: 'canViewReports' },
        { label: 'تقارير العملاء', path: '/cutomer-reports', icon: FaFileInvoice, permission: 'canViewReports' },
        { label: 'تقارير دوام موظفين', path: '/employee-reports', icon: FaClock, permission: 'canViewReports' },
        { label: 'تقرير اليومى', path: '/all-dealyReport', icon: FaCalendarDay, permission: 'canViewReports' },
        { label: 'مقارنه الاداء العام', path: '/compare-prevormance', icon: FaBalanceScale, permission: 'canViewReports' },
        { label: 'تقرير اليومى لمسوقين تحت التدريب', path: '/brokers-deaily-reports', icon: FaCalendarDay, permission: 'canViewReports' },
        { label: 'تقارير اسبوعيه وشهريه', path: '/reportMatch', icon: FaCalendarAlt, permission: 'canViewReports' },
      ],
    },
 { type: 'link', id: 'links', label: 'روابط خارجيه', path: '/Links', icon: FaLink },
    { type: 'link', id: 'my-reports', label: 'تقاريرى', path: '/User-Reports', icon: FaRegFileAlt },
    { type: 'link', id: 'raya-calendar', label: 'تقويم الراية', path: '/Googale-calnder', icon: FaRegCalendarCheck, permission: 'canViewclander' },
    { type: 'link', id: 'customer-calendar', label: 'تقويم العملاء', path: '/calnder-customer', icon: FaRegCalendarPlus, permission: 'canViewclanderCustomer' },
    { type: 'link', id: 'whatsapp', label: 'أتوميشن الواتساب', path: '/whatsap-boarding', icon: FaWhatsapp, permission: 'canViewAdministration' },

    // الإداره
    {
      type: 'dropdown',
      id: 'administration',
      label: 'الإداره',
      icon: FaGripHorizontal,
      children: [
        { label: 'إحصائيات النظام', path: '/dashboard', icon: FaChartBar, permission: 'canViewAdministration' },
        { label: 'الموظفين', path: '/All-users', icon: FaUsers, permission: 'canViewEmployees' },
        { label: 'المصاريف', path: '/expenss', icon: FaMoneyBillWave, permission: 'canViewexpensee' },
        { label: 'الصلاحيات', path: '/permissions', icon: FaUserShield, permission: 'canViewAdministration' },
        { label: 'المؤسسات والشركاء', path: '/InstitutionsCompany', icon: FaArchive, permission: 'canViewInstitutionsCompany' },
        { label: 'طلبات التوظيف', path: '/raya-jops', icon: FaUserPlus, permission: 'canViewAdministration' },
        { label: 'استبيان موظفين', path: '/raya-Survey', icon: FaPoll, permission: 'canViewAdministration' },
        { label: 'استبيان تطوير الافكار', path: '/raya-improve', icon: FaLightbulb, permission: 'canViewAdministration' },
        { label: 'أرشيف البيانات', path: '/archive-boarding', icon: FaArchive, permission: 'canViewAdministration' },
        { label: 'تحميل جميع الداتا', path: '/permissions', icon: FaUserShield, permission: 'canViewAdministration' },

      ],
      
    },

    // إدارة حقول المشاريع
    {
      type: 'dropdown',
      id: 'project-fields',
      label: 'إدارة حقول المشاريع',
      icon: FaBuilding,
      children: [
        { label: 'نوع العقار', path: '/projects-Types', icon: FaTag, permission: 'canViewprojectstypes' },
        { label: 'منطقة العقار', path: '/projects-location', icon: FaMapMarkerAlt, permission: 'canViewlocation' },
        { label: 'حاله العقار', path: '/projects-stauts', icon: FaFlag, permission: 'canViewprojectstuts' },
        { label: 'مساحه العقار', path: '/projects-area', icon: FaRulerCombined, permission: 'canViewprojectarae' },
        { label: 'الدفعة الأولى', path: '/FistPayment', icon: FaMoneyBill, permission: 'canViewappCurency' },
        { label: 'الدفعة الشهرية', path: '/PaymentMonthly', icon: FaMoneyBillWave, permission: 'canViewappCurency' },
        { label: 'أنواع العملات', path: '/Currency', icon: FaDollarSign, permission: 'canViewappCurency' },
        { label: 'الطوابق', path: '/FloorNumbers', icon: FaLayerGroup, permission: 'canViewappCurency' },
        { label: 'حالات الشقق', path: '/propertyStauts', icon: FaCheckCircle, permission: 'canViewpropertyStauts' },
              { label: 'انواع المساهمه', path: '/contrubutesTypes', icon: FaCheckCircle, permission: 'canViewcontrubutesTypes' },

      ],
    },

    // إدارة حقول العملاء
    {
      type: 'dropdown',
      id: 'customer-fields',
      label: 'إدارة حقول العملاء',
      icon: FaUserTie,
      children: [
        { label: 'وصف العميل', path: '/cutomers-types', icon: FaUserTag, permission: 'canViewCustomerTypes' },
        { label: 'نوع التقرير', path: '/ReportType', icon: FaFileInvoice, permission: 'canViewCustomerTypes' },
        { label: 'هل تمت المعاينة', path: '/customer-checksatuts', icon: FaEye, permission: 'canViewisvewied' },
        { label: 'حاله العميل فى قسم الاتصالات', path: '/customer-callcenter-stauts', icon: FaPhoneAlt, permission: 'canViewcallcentercustomer' },
        { label: 'طلبات العملاء', path: '/Requiremnts', icon: FaClipboardList, permission: 'canViewrequiremnts' },
        { label: 'وظائف العملاء', path: '/client-work', icon: FaBriefcase, permission: 'canViewwork' },
      ],
    },
  ];

  const hasVisibleChildren = (children) => children.some(child => hasPermission(child.permission));

  const isActiveLink = (path) => {
    if (path === '/') return pathname === '/';
    return pathname.includes(path);
  };

  // ---------- Render helpers ----------
  const renderLink = (item, isChild = false) => {
    const active = isActiveLink(item.path);
    const Icon = item.icon;
    return (
      <li key={item.id || item.label}>
        <NavLink
          to={item.path}
          className={`group flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
            active
              ? 'bg-main/10 text-main shadow-sm'
              : 'text-gray-700 hover:bg-gray-100 hover:text-main dark:text-gray-300 dark:hover:bg-gray-800'
          } ${isChild ? 'mr-4 border-r-2 border-main/20 pl-6' : ''}`}
        >
          <Icon className={`text-lg ${active ? 'text-main' : 'text-gray-500 group-hover:text-main'}`} />
          <span>{item.label}</span>
        </NavLink>
      </li>
    );
  };

  const renderDropdown = (dropdown) => {
    const { id, label, icon: Icon, children } = dropdown;
    const visibleChildren = children.filter(child => hasPermission(child.permission));
    if (visibleChildren.length === 0) return null;

    const isOpen = openDropdowns[id] || false;

    return (
      <li key={id} className="mb-1">
        <button
          onClick={() => toggleDropdown(id)}
          className={`flex w-full items-center justify-between rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
            isOpen
              ? 'bg-main/10 text-main'
              : 'text-gray-700 hover:bg-gray-100 hover:text-main dark:text-gray-300 dark:hover:bg-gray-800'
          }`}
        >
          <span className="flex items-center gap-3">
            <Icon className="text-lg" />
            <span>{label}</span>
          </span>
          <svg
            className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {isOpen && (
          <ul className="mt-1 space-y-0.5">
            {visibleChildren.map(child => renderLink({ ...child, id: child.label }, true))}
          </ul>
        )}
      </li>
    );
  };

  const renderSections = () => {
    return sections.map((section) => {
      if (section.type === 'link') {
        if (!hasPermission(section.permission)) return null;
        return renderLink(section);
      } else if (section.type === 'dropdown') {
        return renderDropdown(section);
      }
      return null;
    });
  };

  // ---------- Main ----------
  return (
    <aside
      ref={sidebar}
      className={`fixed right-0 top-0 z-50 flex h-screen w-[240px] flex-col overflow-y-auto bg-white shadow-2xl duration-300 ease-in-out dark:bg-boxdark lg:static ${
        sidebarOpen ? 'translate-x-0' : 'translate-x-[260px]'
      }`}
    >
      <div className="flex items-center justify-center border-b border-gray-200 px-4 py-6 dark:border-gray-700">
        <NavLink to="/">
          <img src={Logo} alt="Logo" className="h-14 w-auto object-contain" />
        </NavLink>
      </div>

      <nav className="flex-1 px-3 py-4">
        <ul className="space-y-1">{renderSections()}</ul>
      </nav>
    </aside>
  );
};

export default Sidebar;