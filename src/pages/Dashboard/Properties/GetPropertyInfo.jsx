import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FiArrowRight,
  FiHome,
  FiCalendar,
  FiDollarSign,
  FiMapPin,
} from 'react-icons/fi';

import useQuerygetSpacficIteam from '../../../services/QuerygetSpacficIteam';

const GetPropertyInfo = () => {
  const { id, propertyId } = useParams();

  const navigate = useNavigate();

  const { data, isLoading } = useQuerygetSpacficIteam(
    `projects/property/${id}`,
    `projects/property/${id}`,
    propertyId,
  );

  if (isLoading) {
    return <div className="p-10 text-center">جاري التحميل...</div>;
  }
console.log("property-data", data);

  const project = data?.project;
  const property = data?.property;

  if (!property) {
    return <div className="p-10">لا توجد بيانات</div>;
  }

  return (
    <div className="space-y-8 pb-20">
      {/* HEADER */}

      <div
        className="
bg-white
rounded-3xl
shadow
border
p-6
flex
justify-between
items-center
"
      >
        <div>
          <button
            onClick={() => navigate(-1)}
            className="
flex gap-2
items-center
text-purple-600
mb-4
"
          >
            <FiArrowRight />
            رجوع
          </button>

          <h1
            className="
text-3xl
font-bold
"
          >
            {property.unitName}
          </h1>

          <p className="text-gray-500 mt-2">{project?.projectName}</p>
        </div>

        <div
          className="
bg-purple-100
text-purple-700
px-5
py-3
rounded-2xl
font-bold
"
        >
          {property.propertyStatus || 'متاحة'}
        </div>
      </div>

      {/* IMAGES */}

      <div
        className="
bg-white
rounded-3xl
border
shadow
p-6
"
      >
        <h2 className="font-bold text-xl mb-5">صور الشقة</h2>

        <div
          className="
grid
md:grid-cols-4
gap-4
"
        >
          {property.imagesURLs?.length ? (
            property.imagesURLs.map((img, index) => (
              <img
                key={index}
                src={img.fileURL}
                className="
h-52
w-full
object-cover
rounded-2xl
"
              />
            ))
          ) : (
            <div
              className="
col-span-4
h-52
bg-gray-100
rounded-2xl
flex
items-center
justify-center
"
            >
                            <img
          
                src="https://images.unsplash.com/photo-1560185007-cde436f6a4d0"
                className="
                    h-52
                    w-full
                    object-cover
                    rounded-2xl
                    "
              />
          
            </div>
          )}
        </div>
      </div>

      {/* DETAILS */}

      <div
        className="
grid
md:grid-cols-3
gap-6
"
      >
        <Card title="نوع العقار" value={property.floorType} />

        <Card title="التابع" value={property.floorTypeFlow} />

        <Card title="رقم الشقة" value={property.floorNumber} />

        <Card title="الدور" value={property.floor} />

        <Card title="الغرف" value={property.rooms} />

        <Card title="الحمامات" value={property.bathrooms} />

        <Card title="المساحة" value={`${property.area} متر`} />

        <Card
          title="المساحة الخارجية"
          value={`${property.areaOutside || 0} متر`}
        />

        <Card title="التراس" value={`${property.areaTarth || 0} متر`} />
      </div>

      {/* MONEY */}

      <div
        className="
bg-white
rounded-3xl
border
shadow
p-6
"
      >
        <h2
          className="
font-bold
text-xl
mb-5
flex
gap-2
"
        >
          <FiDollarSign />
          بيانات الدفع
        </h2>

        <div
          className="
grid
md:grid-cols-3
gap-5
"
        >
          <Card title="السعر" value={Number(property.price).toLocaleString()} />

          <Card title="الدفعة الأولى" value={property.downPayment} />

          <Card title="القسط الشهري" value={property.monthlyInstallment} />
        </div>
      </div>

      {/* NOTES */}

      <div
        className="
grid
md:grid-cols-2
gap-6
"
      >
        <Card title="تفاصيل الشقة" value={property.FloorDetails} />

        <Card title="ملاحظات" value={property.propertyNote} />
      </div>

      {/* PROJECT */}

      <div
        className="
bg-white
rounded-3xl
border
shadow
p-6
"
      >
        <h2 className="font-bold text-xl mb-4">بيانات المشروع</h2>

        <div className="space-y-3 text-gray-700">
          <p className="flex gap-2">
            <FiHome />
            {project?.projectName}
          </p>

          <p className="flex gap-2">
            <FiMapPin />
            {project?.detailedAddress}
          </p>
        </div>
      </div>

      {/* DATE */}

      <div
        className="
bg-white
rounded-3xl
border
shadow
p-6
"
      >
        <h2 className="font-bold text-xl mb-4">التواريخ</h2>

        <div className="grid md:grid-cols-2 gap-4">
          <Card
            title="تاريخ الإضافة"
            value={new Date(property.createdAt).toLocaleDateString('ar-EG')}
          />

          <Card
            title="آخر تعديل"
            value={new Date(property.updatedAt).toLocaleDateString('ar-EG')}
          />
        </div>
      </div>
    </div>
  );
};

const Card = ({ title, value }) => (
  <div
    className="
bg-gray-50
rounded-2xl
p-5
"
  >
    <p className="text-gray-500 text-sm">{title}</p>

    <h3
      className="
font-bold
text-lg
mt-2
"
    >
      {value || '-'}
    </h3>
  </div>
);

export default GetPropertyInfo;
