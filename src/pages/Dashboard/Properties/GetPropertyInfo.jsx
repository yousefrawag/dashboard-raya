
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiArrowRight,
  FiHome,
  FiCalendar,
  FiDollarSign,
  FiMapPin,
  FiImage,
  FiVideo,
  FiFileText,
  FiDownload,
  FiExternalLink,
  FiFile,
} from "react-icons/fi";

import StatusFilterTabs from "../../../components/common/StatusFilterTabs";
import MatchedClients from "./MatchedClients";
import useQuerygetSpacficIteam from "../../../services/QuerygetSpacficIteam";

const GetPropertyInfo = () => {
  const { id, propertyId } = useParams();
  const navigate = useNavigate();

  const [CurrenTap, setCurrentTap] = useState("info");

  const { data, isLoading } = useQuerygetSpacficIteam(
    `projects/property/${id}`,
    `projects/property/${id}`,
    propertyId
  );

  const {
    data: MatchedClientsdata,
    isLoading: matchLoading,
  } = useQuerygetSpacficIteam(
    `customers/customertpropertymatch/${id}`,
    `customers/customertpropertymatch/${id}`,
    propertyId
  );

  const statusConfig = {
    info: {
      label: "بيانات الشقة",
      className: "text-yellow-600 hover:text-yellow-700",
      icon: "clock",
    },

    clients: {
      label: "عملاء مقترحة",
      className: "text-green-600 hover:text-green-700",
      icon: "check-circle",
    },
  };

  if (isLoading) {
    return (
      <div className="p-10 text-center text-gray-500">
        جاري تحميل بيانات الشقة...
      </div>
    );
  }

  const project = data?.project;
  const property = data?.property;

  if (!property) {
    return (
      <div className="p-10 text-center text-gray-500">
        لا توجد بيانات لهذه الشقة
      </div>
    );
  }

  /*
  =========================================================
  FILE HELPERS
  =========================================================
  Schema:
  {
    fileURL: String,
    fileID: String
  }
  */

  const getFileUrl = (file) => {
    if (!file) return "";

    if (typeof file === "string") {
      return file;
    }

    return file.fileURL || "";
  };

  const getFileId = (file) => {
    if (!file || typeof file === "string") return "";

    return file.fileID || "";
  };

  const images = Array.isArray(property.imagesURLs)
    ? property.imagesURLs
    : [];

  const videos = Array.isArray(property.videosURLs)
    ? property.videosURLs
    : [];

  const docs = Array.isArray(property.docsURLs)
    ? property.docsURLs
    : [];

  /*
  =========================================================
  FORMAT NUMBER
  =========================================================
  */

  const formatNumber = (value) => {
    if (
      value === undefined ||
      value === null ||
      value === ""
    ) {
      return "-";
    }

    const number = Number(value);

    if (Number.isNaN(number)) {
      return value;
    }

    return number.toLocaleString("ar-EG");
  };

  /*
  =========================================================
  FORMAT DATE
  =========================================================
  */

  const formatDate = (date) => {
    if (!date) return "-";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "-";
    }

    return parsedDate.toLocaleDateString("ar-EG");
  };

  return (
    <div
      className="pt-20 pb-20"
      dir="rtl"
    >

      {/* ================================================= */}
      {/* TABS */}
      {/* ================================================= */}

      <StatusFilterTabs
        statusConfig={statusConfig}
        onStatusChange={(key) => setCurrentTap(key)}
        selectedStatus={CurrenTap}
      />

      {/* ================================================= */}
      {/* PROPERTY INFO */}
      {/* ================================================= */}

      {CurrenTap === "info" && (
        <div className="space-y-8">

          {/* ================================================= */}
          {/* HEADER */}
          {/* ================================================= */}

          <div
            className="
              bg-white
              rounded-3xl
              shadow
              border
              p-6
              flex
              flex-col
              md:flex-row
              justify-between
              items-start
              md:items-center
              gap-5
            "
          >

            <div>

              <button
                onClick={() => navigate(-1)}
                className="
                  flex
                  gap-2
                  items-center
                  text-purple-600
                  hover:text-purple-800
                  transition
                  mb-4
                  font-medium
                "
              >
                <FiArrowRight />

                رجوع
              </button>

              <h1
                className="
                  text-3xl
                  font-bold
                  text-gray-800
                "
              >
                {property.unitName ||
                  `الشقة رقم ${
                    property.floorNumber || "-"
                  }`}
              </h1>

              <p className="text-gray-500 mt-2">
                {project?.projectName ||
                  "بدون اسم مشروع"}
              </p>

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
              {property.propertyStatus || "متاحة"}
            </div>

          </div>

          {/* ================================================= */}
          {/* IMAGES */}
          {/* ================================================= */}

          <div
            className="
              bg-white
              rounded-3xl
              border
              shadow
              p-6
            "
          >

            <div
              className="
                flex
                items-center
                gap-2
                mb-5
              "
            >

              <FiImage
                className="
                  text-purple-600
                  text-xl
                "
              />

              <h2
                className="
                  font-bold
                  text-xl
                  text-gray-800
                "
              >
                صور الشقة
              </h2>

              <span
                className="
                  bg-gray-100
                  text-gray-600
                  text-sm
                  px-3
                  py-1
                  rounded-full
                "
              >
                {images.length}
              </span>

            </div>

            {images.length > 0 ? (

              <div
                className="
                  grid
                  grid-cols-1
                  sm:grid-cols-2
                  lg:grid-cols-4
                  gap-4
                "
              >

                {images.map((image, index) => {

                  const imageUrl =
                    getFileUrl(image);

                  if (!imageUrl) {
                    return null;
                  }

                  return (
                    <a
                      key={
                        getFileId(image) ||
                        index
                      }
                      href={imageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="
                        group
                        relative
                        block
                        overflow-hidden
                        rounded-2xl
                        bg-gray-100
                        border
                        aspect-video
                      "
                    >

                      <img
                        src={imageUrl}
                        alt={`صورة الشقة ${
                          index + 1
                        }`}
                        className="
                          w-full
                          h-full
                          object-cover
                          transition
                          duration-300
                          group-hover:scale-105
                        "
                      />

                      <div
                        className="
                          absolute
                          inset-0
                          bg-black/0
                          group-hover:bg-black/30
                          transition
                          flex
                          items-center
                          justify-center
                        "
                      >

                        <FiExternalLink
                          className="
                            text-white
                            text-2xl
                            opacity-0
                            group-hover:opacity-100
                            transition
                          "
                        />

                      </div>

                    </a>
                  );
                })}

              </div>

            ) : (

              <EmptyMedia
                icon={<FiImage />}
                text="لا توجد صور مضافة لهذه الشقة"
              />

            )}

          </div>

          {/* ================================================= */}
          {/* VIDEOS */}
          {/* ================================================= */}

          <div
            className="
              bg-white
              rounded-3xl
              border
              shadow
              p-6
            "
          >

            <div
              className="
                flex
                items-center
                gap-2
                mb-5
              "
            >

              <FiVideo
                className="
                  text-red-500
                  text-xl
                "
              />

              <h2
                className="
                  font-bold
                  text-xl
                  text-gray-800
                "
              >
                فيديوهات الشقة
              </h2>

              <span
                className="
                  bg-gray-100
                  text-gray-600
                  text-sm
                  px-3
                  py-1
                  rounded-full
                "
              >
                {videos.length}
              </span>

            </div>

            {videos.length > 0 ? (

              <div
                className="
                  grid
                  grid-cols-1
                  md:grid-cols-2
                  xl:grid-cols-3
                  gap-6
                "
              >

                {videos.map((video, index) => {

                  const videoUrl =
                    getFileUrl(video);

                  if (!videoUrl) {
                    return null;
                  }

                  return (
                    <div
                      key={
                        getFileId(video) ||
                        index
                      }
                      className="
                        bg-gray-50
                        rounded-2xl
                        overflow-hidden
                        border
                      "
                    >

                      <video
                        src={videoUrl}
                        controls
                        preload="metadata"
                        className="
                          w-full
                          aspect-video
                          object-cover
                          bg-black
                        "
                      />

                      <div
                        className="
                          p-4
                          flex
                          items-center
                          justify-between
                          gap-3
                        "
                      >

                        <div
                          className="
                            flex
                            items-center
                            gap-2
                            min-w-0
                          "
                        >

                          <div
                            className="
                              w-10
                              h-10
                              rounded-xl
                              bg-red-100
                              text-red-600
                              flex
                              items-center
                              justify-center
                              shrink-0
                            "
                          >
                            <FiVideo />
                          </div>

                          <div className="min-w-0">

                            <p
                              className="
                                font-semibold
                                text-gray-800
                              "
                            >
                              فيديو الشقة{" "}
                              {index + 1}
                            </p>

                            <p
                              className="
                                text-xs
                                text-gray-500
                                truncate
                              "
                            >
                              {getFileId(video) ||
                                "ملف فيديو"}
                            </p>

                          </div>

                        </div>

                        <a
                          href={videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="
                            w-9
                            h-9
                            rounded-xl
                            bg-white
                            border
                            flex
                            items-center
                            justify-center
                            text-gray-600
                            hover:text-purple-600
                            hover:border-purple-300
                            transition
                            shrink-0
                          "
                          title="فتح الفيديو"
                        >
                          <FiExternalLink />
                        </a>

                      </div>

                    </div>
                  );
                })}

              </div>

            ) : (

              <EmptyMedia
                icon={<FiVideo />}
                text="لا توجد فيديوهات مضافة لهذه الشقة"
              />

            )}

          </div>

          {/* ================================================= */}
          {/* DOCUMENTS */}
          {/* ================================================= */}

          <div
            className="
              bg-white
              rounded-3xl
              border
              shadow
              p-6
            "
          >

            <div
              className="
                flex
                items-center
                gap-2
                mb-5
              "
            >

              <FiFileText
                className="
                  text-blue-600
                  text-xl
                "
              />

              <h2
                className="
                  font-bold
                  text-xl
                  text-gray-800
                "
              >
                ملفات الشقة
              </h2>

              <span
                className="
                  bg-gray-100
                  text-gray-600
                  text-sm
                  px-3
                  py-1
                  rounded-full
                "
              >
                {docs.length}
              </span>

            </div>

            {docs.length > 0 ? (

              <div
                className="
                  grid
                  grid-cols-1
                  md:grid-cols-2
                  gap-4
                "
              >

                {docs.map((doc, index) => {

                  const docUrl =
                    getFileUrl(doc);

                  if (!docUrl) {
                    return null;
                  }

                  const fileId =
                    getFileId(doc);

                  return (
                    <div
                      key={
                        fileId || index
                      }
                      className="
                        border
                        rounded-2xl
                        p-4
                        flex
                        items-center
                        justify-between
                        gap-4
                        bg-gray-50
                        hover:bg-gray-100
                        transition
                      "
                    >

                      <div
                        className="
                          flex
                          items-center
                          gap-3
                          min-w-0
                        "
                      >

                        <div
                          className="
                            w-12
                            h-12
                            rounded-xl
                            bg-blue-100
                            text-blue-600
                            flex
                            items-center
                            justify-center
                            text-xl
                            shrink-0
                          "
                        >
                          <FiFile />
                        </div>

                        <div className="min-w-0">

                          <p
                            className="
                              font-bold
                              text-gray-800
                              truncate
                            "
                            title={
                              fileId ||
                              "ملف مرفق"
                            }
                          >
                            {fileId ||
                              `ملف ${index + 1}`}
                          </p>

                          <p
                            className="
                              text-xs
                              text-gray-500
                              mt-1
                            "
                          >
                            ملف مرفق للشقة
                          </p>

                        </div>

                      </div>

                      <div
                        className="
                          flex
                          items-center
                          gap-2
                          shrink-0
                        "
                      >

                        <a
                          href={docUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="
                            w-10
                            h-10
                            rounded-xl
                            bg-white
                            border
                            flex
                            items-center
                            justify-center
                            text-gray-600
                            hover:text-blue-600
                            hover:border-blue-300
                            transition
                          "
                          title="فتح الملف"
                        >
                          <FiExternalLink />
                        </a>

                        <a
                          href={docUrl}
                          download
                          className="
                            w-10
                            h-10
                            rounded-xl
                            bg-blue-600
                            text-white
                            flex
                            items-center
                            justify-center
                            hover:bg-blue-700
                            transition
                          "
                          title="تحميل الملف"
                        >
                          <FiDownload />
                        </a>

                      </div>

                    </div>
                  );
                })}

              </div>

            ) : (

              <EmptyMedia
                icon={<FiFileText />}
                text="لا توجد ملفات مضافة لهذه الشقة"
              />

            )}

          </div>

          {/* ================================================= */}
          {/* PROPERTY DETAILS */}
          {/* ================================================= */}

          <div
            className="
              grid
              md:grid-cols-3
              gap-6
            "
          >

            <Card
              title="نوع العقار"
              value={property.floorType}
            />

            <Card
              title="التابع"
              value={property.floorTypeFlow}
            />

            <Card
              title="رقم الشقة"
              value={property.floorNumber}
            />

            <Card
              title="الدور"
              value={property.floor}
            />

            <Card
              title="الغرف"
              value={property.rooms}
            />

            <Card
              title="الحمامات"
              value={property.bathrooms}
            />

            <Card
              title="المساحة"
              value={
                property.area
                  ? `${property.area} متر`
                  : "-"
              }
            />

            <Card
              title="المساحة الخارجية"
              value={
                property.areaOutside
                  ? `${property.areaOutside} متر`
                  : "0 متر"
              }
            />

            <Card
              title="التراس"
              value={
                property.areaTarth
                  ? `${property.areaTarth} متر`
                  : "0 متر"
              }
            />

            <Card
              title="مساحة البلكونة"
              value={
                property.areaBark
                  ? `${property.areaBark} متر`
                  : "0 متر"
              }
            />

          </div>

          {/* ================================================= */}
          {/* PAYMENT */}
          {/* ================================================= */}

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
                items-center
                gap-2
                text-gray-800
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

              <Card
                title="السعر"
                value={
                  property.price
                    ? `${formatNumber(
                        property.price
                      )} جنيه`
                    : "-"
                }
              />

              <Card
                title="الدفعة الأولى"
                value={
                  property.downPayment
                    ? `${formatNumber(
                        property.downPayment
                      )} جنيه`
                    : "-"
                }
              />

              <Card
                title="القسط الشهري"
                value={
                  property.monthlyInstallment
                    ? `${formatNumber(
                        property.monthlyInstallment
                      )} جنيه`
                    : "-"
                }
              />

            </div>

          </div>

          {/* ================================================= */}
          {/* NOTES */}
          {/* ================================================= */}

          <div
            className="
              grid
              md:grid-cols-2
              gap-6
            "
          >

            <Card
              title="تفاصيل الشقة"
              value={property.FloorDetails}
            />

            <Card
              title="ملاحظات"
              value={property.propertyNote}
            />

          </div>

          {/* ================================================= */}
          {/* PROJECT */}
          {/* ================================================= */}

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
                items-center
                gap-2
              "
            >
              <FiHome />

              بيانات المشروع
            </h2>

            <div
              className="
                space-y-4
                text-gray-700
              "
            >

              <p
                className="
                  flex
                  gap-3
                  items-start
                "
              >
                <FiHome
                  className="
                    mt-1
                    text-purple-600
                  "
                />

                <span>
                  {project?.projectName || "-"}
                </span>
              </p>

              <p
                className="
                  flex
                  gap-3
                  items-start
                "
              >
                <FiMapPin
                  className="
                    mt-1
                    text-purple-600
                  "
                />

                <span>
                  {project?.detailedAddress || "-"}
                </span>
              </p>

            </div>

          </div>

          {/* ================================================= */}
          {/* DATES */}
          {/* ================================================= */}

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
                items-center
                gap-2
              "
            >
              <FiCalendar />

              التواريخ
            </h2>

            <div
              className="
                grid
                md:grid-cols-2
                gap-4
              "
            >

              <Card
                title="تاريخ الإضافة"
                value={formatDate(
                  property.createdAt
                )}
              />

              <Card
                title="آخر تعديل"
                value={formatDate(
                  property.updatedAt
                )}
              />

            </div>

          </div>

        </div>
      )}

      {/* ================================================= */}
      {/* MATCHED CLIENTS */}
      {/* ================================================= */}

      {CurrenTap === "clients" && (
        <MatchedClients
          matchLoading={matchLoading}
          MatchedClientsdata={
            MatchedClientsdata
          }
        />
      )}

    </div>
  );
};

/* ========================================================= */
/* CARD COMPONENT */
/* ========================================================= */

const Card = ({ title, value }) => {
  return (
    <div
      className="
        bg-gray-50
        rounded-2xl
        p-5
        border
        border-gray-100
      "
    >

      <p
        className="
          text-gray-500
          text-sm
        "
      >
        {title}
      </p>

      <h3
        className="
          font-bold
          text-lg
          mt-2
          text-gray-800
          break-words
        "
      >
        {value || "-"}
      </h3>

    </div>
  );
};

/* ========================================================= */
/* EMPTY MEDIA */
/* ========================================================= */

const EmptyMedia = ({ icon, text }) => {
  return (
    <div
      className="
        h-40
        bg-gray-50
        border
        border-dashed
        rounded-2xl
        flex
        flex-col
        items-center
        justify-center
        text-gray-400
        gap-3
      "
    >

      <div className="text-3xl">
        {icon}
      </div>

      <p className="text-sm">
        {text}
      </p>

    </div>
  );
};

export default GetPropertyInfo;
