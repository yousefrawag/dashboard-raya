import React from 'react';
import clsx from 'clsx';
import Chart from 'react-apexcharts';

const ExpenseCard = ({ 
  total, 
  currentMonthExpense, 
 
  currency = "EUR" 
}) => {
  // Calculate trend direction


  // Modern gradient backgrounds
  const colorMap = {
    دولار: 'from-blue-500 to-cyan-400',
    شيكل: 'from-green-500 to-emerald-400',
    دينار: 'from-amber-500 to-yellow-400',
    ريال: 'from-purple-500 to-indigo-400',
    default: 'from-slate-600 to-slate-500',
  };

  const gradient = colorMap[currency] || colorMap.default;



  return (
    <div className={clsx(
      `rounded-xl p-5 w-full max-w-xs text-white
      bg-gradient-to-br ${gradient}
      shadow-lg transform transition-all hover:scale-[1.02]
      hover:shadow-xl border border-white/20
      relative overflow-hidden`
    )}>
      <div className="relative z-10">
        <h2 className="text-xl font-bold mb-3">{currency} العملة</h2>
        
        <div className="space-y-3 mb-4">
          <div className="flex justify-between">
            <span>إجمالى الرصيد</span>
            <span className="font-bold text-2xl  text-black">{total} </span>
          </div>
          <div className="flex justify-between">
            <span>هذا الشهر </span>
            <span className="font-bold text-2xl  text-black">{currentMonthExpense} </span>
          </div>
        </div>
        
  
      </div>
    </div>
  );
};

export default ExpenseCard;