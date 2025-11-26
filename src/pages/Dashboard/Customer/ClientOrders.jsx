import React from 'react'

const ClientOrders = ({clientRequirements}) => {
  return (
         <div className="space-y-4 overflow-y-auto">
        {clientRequirements.length === 0 ? (
          <p className="text-center text-gray-500">لا توجد طلبات حالياً</p>
        ) : (
          clientRequirements.map((req, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-xl p-5 bg-gray-50 shadow-sm flex flex-col gap-2 relative"
            >
              <button
                onClick={() => handleDelete(index)}
                type="button"
                className="absolute top-2 left-2 text-red-500 hover:text-red-700"
              >
                ✕
              </button>

              <h4 className="text-lg font-semibold text-main mb-2">
                طلب رقم {index + 1}
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                <p>
                  <span className="font-medium">📍 موقع العقار:</span>{" "}
                  {req.rquireLocation}
                </p>
                <p>
                  <span className="font-medium">🏙 منطقة العقار:</span>{" "}
                  {req.requireRegion}
                </p>
                <p>
                  <span className="font-medium">🏠 نوع العقار:</span>{" "}
                  {req.require}
                </p>
                <p>
                  <span className="font-medium">📝 وصف العقار:</span>{" "}
                  {req.requireType}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
  )
}

export default ClientOrders