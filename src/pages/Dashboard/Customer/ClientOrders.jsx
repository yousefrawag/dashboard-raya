import React from "react";

const ClientOrders = ({ clientRequirements }) => {
  return (
    <div className="flex flex-col gap-6">
      {clientRequirements.length === 0 ? (
        <p className="text-center text-gray-500 py-8 bg-gray-50 rounded-xl border border-dashed border-gray-300">
          لا توجد طلبات حالياً
        </p>
      ) : (
        clientRequirements.map((req, index) => {
          const isCash = req.cashOption === "كاش";

          return (
            <div
              key={index}
              className="w-full bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center gap-3 px-6 py-4 bg-gray-50/70 border-b border-gray-200">
                <span className="w-9 h-9 rounded-full bg-main text-white text-sm font-bold flex items-center justify-center">
                  {index + 1}
                </span>
                <div>
                  <h4 className="text-base font-semibold text-main">
                    طلب رقم {index + 1}
                  </h4>
                  <p className="text-xs text-gray-500">
                    {req.rquireLocation || "-"} — {req.requireRegion || "-"}
                  </p>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 space-y-6">
                {/* بيانات العقار */}
                <section>
                  <h5 className="text-sm font-bold text-gray-700 mb-4 pb-2 border-b border-gray-100">
                    بيانات العقار
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <InfoItem label="موقع العقار" value={req.rquireLocation} />
                    <InfoItem label="منطقة العقار" value={req.requireRegion} />
                    <InfoItem label="نوع العقار" value={req.require} />
                    <InfoItem label="وصف العقار" value={req.requireType} />
                  </div>
                </section>

                {/* بيانات الدفع */}
                <section>
                  <h5 className="text-sm font-bold text-gray-700 mb-4 pb-2 border-b border-gray-100">
                    بيانات الدفع
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <InfoItem label="العملة" value={req.currency} />
                    <InfoItem
                      label="آلية الدفع"
                      value={req.cashOption}
                      highlight
                    />

                    {!isCash && (
                      <>
                        <InfoItem
                          label="الدفعة الأولى"
                          value={req.firstPayment}
                        />
                        <InfoItem
                          label="الدفعة الشهرية"
                          value={
                            req.Paymentpermonth
                              ? Number(req.Paymentpermonth).toLocaleString(
                                  "en-US"
                                )
                              : ""
                          }
                        />
                      </>
                    )}
                  </div>
                </section>

                {/* تفاصيل الطلب */}
                {req.requireDetails && (
                  <section>
                    <h5 className="text-sm font-bold text-gray-700 mb-4 pb-2 border-b border-gray-100">
                      تفاصيل الطلب
                    </h5>
                    <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-4 border border-gray-100 whitespace-pre-wrap leading-relaxed">
                      {req.requireDetails}
                    </p>
                  </section>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

/* مكوّن صغير لعرض معلومة */
const InfoItem = ({ label, value, highlight }) => (
  <div className="flex flex-col gap-1">
    <span className="text-xs text-gray-500 font-medium">{label}</span>
    <span
      className={`text-sm font-semibold break-words ${
        highlight ? "text-main" : "text-gray-800"
      }`}
    >
      {value || "-"}
    </span>
  </div>
);

export default ClientOrders;