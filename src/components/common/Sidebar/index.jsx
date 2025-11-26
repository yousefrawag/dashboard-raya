import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import Logo from '../../../images/logo/logo.png';
import { FaGripHorizontal, FaUsers, FaTasks, FaProjectDiagram, FaCalendarAlt, FaChartLine, FaBuilding } from 'react-icons/fa';
import { MdContactSupport, MdOutlineSecurity } from 'react-icons/md';
import { IoLocation } from 'react-icons/io5';
import { useSelector } from 'react-redux';
import { FaCalendarDays } from "react-icons/fa6";
import { FaWhatsapp } from "react-icons/fa6";

import { FaArchive } from "react-icons/fa";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const user = useSelector((state) => state.userState.userinfo )
  const isAdmin = user?.type === "admin"
  const Permissions = user?.role?.permissions || []
  const HasPermission = (key) => {
const isauthencated = Permissions?.some((per) => per === key)
return isauthencated
  }
  console.log( HasPermission("canViewAdmin"));
  console.log( Permissions);
  
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
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  useEffect(() => {
    localStorage.setItem('sidebar-expanded', sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector('body')?.classList.add('sidebar-expanded');
    } else {
      document.querySelector('body')?.classList.remove('sidebar-expanded');
    }
  }, [sidebarExpanded]);
console.log("sidpare toggale" , sidebarOpen);

  return (
    <aside
      ref={sidebar}
      className={`absolute right-0 top-0 z-9 flex h-screen w-60 flex-col overflow-y-hidden bg-white border-l duration-300 ease-linear dark:bg-boxdark lg:static  ${
        sidebarOpen ? 'translate-x-0' : 'translate-x-[800px]'
      }`}
    >
      <div className="flex items-center justify-between gap-2 px-6 py-6">
        <NavLink to="/">
          <img src={Logo} alt="Logo" className="w-[200px]  h-[120px]" />
        </NavLink>

      </div>

      <div className="no-scrollbar flex flex-col overflow-y-auto">
        <nav className="mt-5  lg:mt-4 lg:px-2">
          <div>
            <ul className="mb-6 flex flex-col gap-1.5">
            <li>
                <NavLink
                  to="/"
                  className={`${liststyle} ${pathname === '/' && itemstyle}`}
                >
                  <FaTasks className="text-lg" /> لوحه تحكم
                </NavLink>
              </li>
                <li>
                <NavLink
                  to="/User-Reports"
                  className={`${liststyle} ${pathname === '/User-Reports' && itemstyle}`}
                >
                  <FaTasks className="text-lg" /> تقاريرى
                </NavLink>
              </li>
                  <li>
                <NavLink
                  to="/User-Reminder"
                  className={`${liststyle} ${pathname === '/User-Reminder' && itemstyle}`}
                >
                  <FaTasks className="text-lg" /> تنبيهات المتابعة
                </NavLink>
              </li>
              {
isAdmin || HasPermission("canViewProjects") ?     <li>
<NavLink
  to="/projects-main"
  className={`${liststyle} ${pathname.includes('projects-main') && itemstyle}`}
>
  <FaProjectDiagram className="text-lg" /> المشاريع العامة
</NavLink>
</li> :null
}

          
{
  isAdmin || HasPermission("canViewPrivetProjects") ?  
  <li>
  <NavLink
    to="/privte-projects"
    className={`${liststyle} ${pathname.includes('privte-projects') && itemstyle}`}
  >
    <FaProjectDiagram className="text-lg" /> المهام الخاصة
  </NavLink>
</li> :null
}
            {
     isAdmin || HasPermission("canViewClients") ? 
     <li>
 
                <NavLink
                  to="/customers-leads"
                  className={`${liststyle} ${pathname.includes('customers-leads') && itemstyle}`}
                >
                  <FaUsers className="text-lg" />  عملاء الحملات
                </NavLink>
 </li> : null
     
  }
            {
     isAdmin || HasPermission("canViewClients") ? 
     <li>
 
                <NavLink
                  to="/Recommendations"
                  className={`${liststyle} ${pathname.includes('Recommendations') && itemstyle}`}
                >
                  <FaUsers className="text-lg" /> توصيات العملاء
                </NavLink>
 </li> : null
     
  }
  {
   isAdmin || HasPermission("canViewAdministration") ? 
   <li>
                <NavLink
                  to="/whatsap-boarding"
                  className={`${liststyle} ${pathname.includes('permissions') && itemstyle}`}
                >
                  <FaWhatsapp className="text-lg text-green-500" />  أتوميشن الواتساب
                </NavLink>
              </li> : null

} 

            {
     isAdmin || HasPermission("canViewClients") ? 
     <li>
 
                <NavLink
                  to="/cutomers"
                  className={`${liststyle} ${pathname.includes('cutomers') && itemstyle}`}
                >
                  <FaUsers className="text-lg" /> العملاء
                </NavLink>
 </li> : null
     
  }

           
 
        

           
{
  isAdmin || HasPermission("canViewMissions") ?       <li>
  <NavLink
    to="/Taskes"
    className={`${liststyle} ${pathname.includes('Taskes') && itemstyle}`}
  >
    <FaTasks className="text-lg" /> توزيع المهام
  </NavLink>
</li> : null

}
         
{
   isAdmin || HasPermission("canViewReports") ? 
   <li>
   <NavLink
     to="/Boardin-Reports"
     className={`${liststyle} ${pathname === '/Boardin-Reports' && itemstyle}`}
   >
     <FaChartLine className="text-lg" /> التقارير والتواصل
   </NavLink>
 </li>:null
}
{
   isAdmin || HasPermission("canViewclander") ? 
   <li>
   <NavLink
     to="/Googale-calnder"
     className={`${liststyle} ${pathname === '/calnder' && itemstyle}`}
   >
     <FaCalendarDays className="text-lg" /> تقويم الراية
   </NavLink>
 </li>:null
}
{
   isAdmin || HasPermission("canViewclanderCustomer") ? 
   <li>
   <NavLink
     to="/calnder-customer"
     className={`${liststyle} ${pathname === '/calnder' && itemstyle}`}
   >
     <FaCalendarDays className="text-lg" /> تقويم  العملاء
   </NavLink>
 </li>:null
}
           


  {
    isAdmin || HasPermission("canViewAdministration") ? 
    <>
    <span className='text-xl text-black dark:text-white  mt-7 mb-5'>الإداره</span>
    <li>
      <NavLink
        to="/dashboard"
        className={`${liststyle} ${pathname.includes('dashboard') && itemstyle}`}
      >
        <FaGripHorizontal className="text-lg" /> إحصائيات النظام
      </NavLink>
    </li>
    </> : null
  }

            
          {
              isAdmin || HasPermission("canViewEmployees") ? 
              <li>
              <NavLink
                to="/All-users"
                className={`${liststyle} ${pathname.includes('All-users') && itemstyle}`}
              >
                <FaUsers className="text-lg" /> جميع الموظفين
              </NavLink>
            </li> : null
          }
      {
              isAdmin || HasPermission("canViewexpensee") ? 
              <li>
              <NavLink
                to="/expenss"
                className={`${liststyle} ${pathname.includes('expenss') && itemstyle}`}
              >
                <FaUsers className="text-lg" /> المصاريف
              </NavLink>
            </li> : null
          }
{
   isAdmin || HasPermission("canViewAdministration") ? 
   <li>
                <NavLink
                  to="/archive-boarding"
                  className={`${liststyle} ${pathname.includes('permissions') && itemstyle}`}
                >
                  <FaArchive className="text-lg text-red-500" /> أرشيف البيانات
                </NavLink>
              </li> : null

}            
{
   isAdmin || HasPermission("canViewAdministration") ? 
   <li>
                <NavLink
                  to="/permissions"
                  className={`${liststyle} ${pathname.includes('permissions') && itemstyle}`}
                >
                  <MdOutlineSecurity className="text-lg" /> الصلاحيات
                </NavLink>
              </li> : null

}
<span  className='mb-5 text-lg text-bold mt-5'> إداره حقول المشاريع</span>
{
   isAdmin || HasPermission("canViewprojectstypes") ? 
   <li>
                <NavLink
                  to="/projects-Types"
                  className={`${liststyle} ${pathname.includes('projects-Types') && itemstyle}`}
                >
                  <MdOutlineSecurity className="text-lg" /> أنواع العقارات
                </NavLink>
              </li> : null

}
{
   isAdmin || HasPermission("canViewlocation") ? 
   <li>
                <NavLink
                  to="/projects-location"
                  className={`${liststyle} ${pathname.includes('projects-location') && itemstyle}`}
                >
                  <MdOutlineSecurity className="text-lg" /> المناطق 
                </NavLink>
              </li> : null

}
{
   isAdmin || HasPermission("canViewprojectstuts") ? 
   <li>
                <NavLink
                  to="/projects-stauts"
                  className={`${liststyle} ${pathname.includes('projects-stauts') && itemstyle}`}
                >
                  <MdOutlineSecurity className="text-lg" /> حالات العقارات 
                </NavLink>
              </li> : null

}
{
   isAdmin || HasPermission("canViewprojectarae") ? 
   <li>
                <NavLink
                  to="/projects-area"
                  className={`${liststyle} ${pathname.includes('projects-area') && itemstyle}`}
                >
                  <MdOutlineSecurity className="text-lg" /> مساحه العقارات
                </NavLink>
              </li> : null

}
{
   isAdmin || HasPermission("canViewappCurency") ? 
   <li>
                <NavLink
                  to="/Currency"
                  className={`${liststyle} ${pathname.includes('Currency') && itemstyle}`}
                >
                  <MdOutlineSecurity className="text-lg" />  أنواع العملات 
                </NavLink>
              </li> : null

}
              

<span  className='mb-5 text-lg text-bold mt-5'> إداره حقول العملاء</span>
   
{
   isAdmin || HasPermission("canViewCustomerTypes") ? 
   <li>
                <NavLink
                  to="/cutomers-types"
                  className={`${liststyle} ${pathname.includes('cutomers-types') && itemstyle}`}
                >
                  <MdOutlineSecurity className="text-lg" />   أنواع العملاء 
                </NavLink>
              </li> : null

}
{
   isAdmin || HasPermission("canViewisvewied") ? 
   <li>
                <NavLink
                  to="/customer-checksatuts"
                  className={`${liststyle} ${pathname.includes('customer-checksatuts') && itemstyle}`}
                >
                  <MdOutlineSecurity className="text-lg" />   هل تمت المعاينة  
                </NavLink>
              </li> : null

}  

{
   isAdmin || HasPermission("canViewcallcentercustomer") ? 
   <li>
                <NavLink
                  to="/customer-callcenter-stauts"
                  className={`${liststyle} ${pathname.includes('customer-callcenter-stauts') && itemstyle}`}
                >
                  <MdOutlineSecurity className="text-lg" />   حالات العميل قسم الاتصال
                </NavLink>
              </li> : null

}          
{
   isAdmin || HasPermission("canViewrequiremnts") ? 
   <li>
                <NavLink
                  to="/Requiremnts"
                  className={`${liststyle} ${pathname.includes('Requiremnts') && itemstyle}`}
                >
                  <MdOutlineSecurity className="text-lg" />   طلبات العملاء
                </NavLink>
              </li> : null

} 
{
   isAdmin || HasPermission("canViewwork") ? 
   <li>
                <NavLink
                  to="/client-work"
                  className={`${liststyle} ${pathname.includes('client-work') && itemstyle}`}
                >
                  <MdOutlineSecurity className="text-lg" />   وظائف العملاء
                </NavLink>
              </li> : null

}          

            
            </ul>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
const itemstyle = 'text-main  border-main  dark:!text-main bg-gray-100 dark:bg-gray-800'
const liststyle =   'group relative border-[1px] rounded-[11px] flex items-center gap-2.5 rounded-sm px-4 py-3 font-bold dark:text-white duration-300 ease-in-out hover:text-main hover:border-main hover:mr-6 dark:hover:text-main hover:bg-gray-100 hover:dark:bg-gray-800';

