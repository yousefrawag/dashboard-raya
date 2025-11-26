import React, { useState } from 'react';
import Header from '../components/common/Header/index';
import Sidebar from '../components/common/Sidebar/index';
import { Outlet } from 'react-router-dom';

const DefaultLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
<div className="flex h-screen overflow-hidden">
  {/* Sidebar */}
  <div
    className={`transition-all duration-300 ${
      sidebarOpen ? 'w-60' : 'w-0'
    }`}
  >
    <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
  </div>

  {/* Content Area */}
  <div className="relative z-1 flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
    <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
    <main>
      <div className="p-5 md:p-6 2xl:p-10 dark:bg-boxdark dark:drop-shadow-none">
        <Outlet />
      </div>
    </main>
  </div>
</div>

  );
};

export default DefaultLayout;
