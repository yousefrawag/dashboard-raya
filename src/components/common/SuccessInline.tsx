// SuccessInline.jsx
import React from "react";

export default function SuccessInline({ title = "تم الإرسال بنجاح", subtitle = "سنقوم بالمتابعة معك قريبًا" }) {
  return (
    <div className="min-h-[220px] flex flex-col items-center justify-center gap-4 p-6">
      {/* Inline SVG */}
      <svg
        className="w-28 h-28"
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* دائرة خلفية */}
        <circle cx="60" cy="60" r="54" fill="#E9F7EF" />
        {/* دائرة متحركة (stroke) */}
        <circle
          cx="60"
          cy="60"
          r="46"
          stroke="#34D399"
          strokeWidth="6"
          strokeDasharray="290"
          strokeDashoffset="290"
        >
          <animate
            attributeName="stroke-dashoffset"
            from="290"
            to="0"
            dur="0.7s"
            fill="freeze"
          />
        </circle>

        {/* علامة الصح */}
        <path
          d="M38 62 L54 78 L82 44"
          stroke="#047857"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          opacity="0"
        >
          <animate attributeName="opacity" from="0" to="1" dur="0.2s" begin="0.6s" fill="freeze" />
        </path>
      </svg>

      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
      </div>
    </div>
  );
}
