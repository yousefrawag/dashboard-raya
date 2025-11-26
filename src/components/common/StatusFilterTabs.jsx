import { useState, useMemo } from 'react';



const StatusFilterTabs = ({ selectedStatus, onStatusChange , statusConfig  }) => {

  return (
    <div className='relative mb-6'>
      <div className='flex gap-6 px-4 overflow-x-auto'>
        {Object.entries(statusConfig).map(([statusKey, config]) => (
          <button
            key={statusKey}
            type='button'
            className={`py-2 px-1 font-medium text-sm relative flex items-center gap-2 transition-colors ${
              selectedStatus === statusKey 
                ? 'text-main font-semibold' 
                : config.className
            }`}
            onClick={() => onStatusChange(statusKey)}
          >
         
           {config.label}
            {selectedStatus === statusKey && (
              <div className='absolute bottom-0 left-0 right-0 h-[2px] bg-main' />
            )}
          </button>
        ))}
      </div>
      <div className='border-b-[2px] border-gray-200 absolute bottom-0 left-0 right-0 -z-10' />
    </div>
  );
};
export default StatusFilterTabs