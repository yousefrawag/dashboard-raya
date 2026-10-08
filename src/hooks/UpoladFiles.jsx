
import { MdAttachFile } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaPlayCircle } from "react-icons/fa";
import { FaFilePdf } from "react-icons/fa6";
import { useRef } from "react";

const UploadFiles = ({
  images,
  setImages,
  docs,
  setDocs,
}) => {
  const videoRef = useRef({});

  /* =========================================================
     DELETE IMAGE / VIDEO
  ========================================================= */

  const handleDeleteImage = (index) => {
    const newImages = images.filter(
      (_, imageIndex) => imageIndex !== index
    );

    setImages(newImages);
  };

  /* =========================================================
     DELETE DOCUMENT
  ========================================================= */

  const handleDeleteDoc = (index) => {
    const newDocs = docs.filter(
      (_, docIndex) => docIndex !== index
    );

    setDocs(newDocs);
  };

  /* =========================================================
     PLAY / PAUSE VIDEO
  ========================================================= */

  const handlePlay = async (index) => {
    const video = videoRef.current[index];

    if (!video) return;

    try {
      if (video.paused) {
        await video.play();
      } else {
        video.pause();
      }
    } catch (error) {
      console.log("Play error:", error);
    }
  };

  /* =========================================================
     FILE SIZE
  ========================================================= */

  const formatFileSize = (size) => {
    if (!size) return "0 KB";

    if (size / 1024 < 900) {
      return `${(size / 1024).toFixed(2)} KB`;
    }

    return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  };

  /* =========================================================
     FILE NAME
  ========================================================= */

  const formatFileName = (name) => {
    if (!name) return "ملف";

    if (name.length <= 18) {
      return name;
    }

    return `${name.substring(0, 18)}...`;
  };

  return (
    <div className="uploads mt-8 p-5 rounded-lg border">

      {/* ===================================================== */}
      {/* IMAGES & VIDEOS */}
      {/* ===================================================== */}

      <div className="flex items-center gap-2 mb-4">

        <span
          className="
            w-11
            h-11
            flex
            items-center
            justify-center
            rounded-full
            bg-blue-100
            text-blue-500
          "
        >
          <MdAttachFile className="text-2xl" />
        </span>

        <p>
          الصور والفيديوهات ({images.length})
        </p>

      </div>

      {images.length > 0 ? (

        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-2
            gap-4
          "
        >

          {images.map((image, i) => {

            const isImage =
              image?.type?.includes("image");

            const previewURL =
              URL.createObjectURL(image);

            return (
              <div
                key={`${image.name}-${i}`}
                className="
                  relative
                  rounded-lg
                  overflow-hidden
                  group
                  bg-black
                "
              >

                {/* ================================================= */}
                {/* IMAGE */}
                {/* ================================================= */}

                {isImage ? (

                  <>

                    <img
                      src={previewURL}
                      alt={image.name}
                      className="
                        w-full
                        h-40
                        object-cover
                      "
                    />

                    {/* Overlay */}

                    <div
                      className="
                        absolute
                        inset-0
                        bg-black/60
                        opacity-0
                        group-hover:opacity-100
                        flex
                        flex-col
                        justify-between
                        p-2
                        transition
                      "
                    >

                      {/* DELETE */}

                      <button
                        type="button"
                        className="
                          absolute
                          top-2
                          right-2
                          w-8
                          h-8
                          flex
                          items-center
                          justify-center
                          rounded-full
                          bg-red-600
                          text-white
                          hover:bg-red-700
                          transition
                          z-10
                        "
                        onClick={() =>
                          handleDeleteImage(i)
                        }
                        title="حذف الصورة"
                      >
                        <RiDeleteBin6Line />
                      </button>

                      {/* FILE INFO */}

                      <div
                        className="
                          flex
                          justify-between
                          items-end
                          text-white
                          text-sm
                          mt-auto
                        "
                      >

                        <span>
                          {formatFileSize(
                            image.size
                          )}
                        </span>

                        <span
                          title={image.name}
                        >
                          {formatFileName(
                            image.name
                          )}
                        </span>

                      </div>

                    </div>

                  </>

                ) : (

                  /* ================================================= */
                  /* VIDEO */
                  /* ================================================= */

                  <div
                    className="
                      relative
                      w-full
                      h-40
                      bg-black
                      overflow-hidden
                    "
                  >

                    <video
                      ref={(video) => {
                        videoRef.current[i] =
                          video;
                      }}
                      src={previewURL}
                      className="
                        w-full
                        h-full
                        object-cover
                      "
                    />

                    {/* Video Overlay */}

                    <div
                      className="
                        absolute
                        inset-0
                        bg-black/50
                        opacity-0
                        group-hover:opacity-100
                        flex
                        items-center
                        justify-center
                        transition
                      "
                    >

                      {/* PLAY */}

                      <button
                        type="button"
                        className="
                          w-10
                          h-10
                          flex
                          items-center
                          justify-center
                          rounded-full
                          bg-white
                          text-black
                          hover:scale-110
                          transition
                        "
                        onClick={() =>
                          handlePlay(i)
                        }
                        title="تشغيل الفيديو"
                      >
                        <FaPlayCircle
                          className="text-xl"
                        />
                      </button>

                    </div>

                    {/* DELETE VIDEO */}

                    <button
                      type="button"
                      className="
                        absolute
                        top-2
                        right-2
                        w-8
                        h-8
                        flex
                        items-center
                        justify-center
                        rounded-full
                        bg-red-600
                        text-white
                        opacity-0
                        group-hover:opacity-100
                        transition
                        z-20
                      "
                      onClick={() =>
                        handleDeleteImage(i)
                      }
                      title="حذف الفيديو"
                    >
                      <RiDeleteBin6Line />
                    </button>

                    {/* VIDEO INFO */}

                    <div
                      className="
                        absolute
                        bottom-0
                        left-0
                        right-0
                        p-2
                        text-white
                        text-sm
                        bg-gradient-to-t
                        from-black/80
                        to-transparent
                        pointer-events-none
                      "
                    >

                      <div className="flex justify-between">

                        <span>
                          {formatFileSize(
                            image.size
                          )}
                        </span>

                        <span
                          title={image.name}
                        >
                          {formatFileName(
                            image.name
                          )}
                        </span>

                      </div>

                    </div>

                  </div>

                )}

              </div>
            );
          })}

        </div>

      ) : (

        <div
          className="
            h-28
            border
            border-dashed
            rounded-lg
            flex
            items-center
            justify-center
            text-gray-400
          "
        >
          لا توجد صور أو فيديوهات مضافة
        </div>

      )}

      {/* ===================================================== */}
      {/* DIVIDER */}
      {/* ===================================================== */}

      <span
        className="
          block
          my-6
          h-px
          bg-gray-200
        "
      />

      {/* ===================================================== */}
      {/* DOCUMENTS */}
      {/* ===================================================== */}

      <div>

        <div className="flex items-center gap-2 mb-4">

          <span
            className="
              w-11
              h-11
              flex
              items-center
              justify-center
              rounded-full
              bg-blue-100
              text-blue-500
            "
          >
            <MdAttachFile className="text-2xl" />
          </span>

          <p>
            المرفقات ({docs.length})
          </p>

        </div>

        {docs.length > 0 ? (

          <div
            className="
              grid
              grid-cols-1
              lg:grid-cols-3
              gap-4
            "
          >

            {docs.map((doc, i) => (

              <div
                key={`${doc.name}-${i}`}
                className="
                  relative
                  flex
                  items-center
                  justify-between
                  p-4
                  h-20
                  bg-red-100
                  rounded-lg
                  group
                "
              >

                {/* FILE INFO */}

                <div className="flex flex-col min-w-0">

                  <span
                    className="
                      text-red-500
                      font-semibold
                      truncate
                      max-w-[180px]
                    "
                    title={doc.name}
                  >
                    {formatFileName(
                      doc.name
                    )}
                  </span>

                  <span className="text-sm">
                    {formatFileSize(
                      doc.size
                    )}
                  </span>

                </div>

                {/* PDF ICON */}

                <FaFilePdf
                  className="
                    text-4xl
                    text-red-500
                    shrink-0
                  "
                />

                {/* DELETE DOCUMENT */}

                <button
                  type="button"
                  className="
                    absolute
                    top-2
                    right-2
                    w-8
                    h-8
                    flex
                    items-center
                    justify-center
                    rounded-full
                    bg-orange-500
                    text-white
                    opacity-0
                    group-hover:opacity-100
                    transition
                    z-10
                  "
                  onClick={() =>
                    handleDeleteDoc(i)
                  }
                  title="حذف الملف"
                >
                  <RiDeleteBin6Line />
                </button>

              </div>

            ))}

          </div>

        ) : (

          <div
            className="
              h-28
              border
              border-dashed
              rounded-lg
              flex
              items-center
              justify-center
              text-gray-400
            "
          >
            لا توجد ملفات مرفقة
          </div>

        )}

      </div>

    </div>
  );
};

export default UploadFiles;