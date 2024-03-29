import { useState } from "react";
import Link from "next/link";
import { setPatientAvatarUrl } from "lib/session";
import FeatherIcon from "feather-icons-react";
import { convertBase64 } from "utils/convertBase64";
import { axiosClient } from "class/axiosConfig";
import { Tooltip } from "primereact/tooltip";
import { ErrorAlert } from "class/AlertManage";
import { convertDateFormat } from "utils/convertDateFormat";
import UploadAvatarModal from "components/dashboard/patientInfo/uploadAvatarModal";
import QRCodeGeneratorModal from "components/commonComponents/qrcode";
import useImageCropper from "@/components/commonComponents/cropper/useImageCropper";

const PatientHorizontalCard = ({
  ClinicUserID,
  data,
  patientInfoArchiveMode,
  avatarEditMode,
  generalEditMode,
  getOnePatient,
}) => {
  // upload avatar modal
  const [showUploadAvatarModal, setShowUploadAvatarModal] = useState(false);
  const [avatarIsLoading, setAvatarIsLoading] = useState(false);
  const openUploadAvatarModal = () => setShowUploadAvatarModal(true);
  const closeUploadAvatarModal = () => setShowUploadAvatarModal(false);

  const handleCroppedImage = async (blob) => {
    await changePatientAvatar(blob);
  };

  const [avatarSrc, setAvatarSrc] = useState(data.Avatar);
  const [imageElement, handleSubmit] = useImageCropper(avatarSrc, 1);

  const changePatientAvatar = async (blob) => {
    setAvatarIsLoading(true);

    if (blob) {
      let avatarBlob = await convertBase64(blob);

      let url = "Patient/ChangeAvatar";
      let editData = {
        PatientID: data._id,
        Avatar: avatarBlob,
      };

      axiosClient
        .put(url, editData)
        .then((response) => {
          getOnePatient();
          setAvatarIsLoading(false);
          setShowUploadAvatarModal(false);
        })
        .catch((err) => {
          console.log(err);
          ErrorAlert("خطا", "آپلود آواتار با خطا مواجه گردید!");
          setAvatarIsLoading(false);
        });
    }
  };

  // QRCode modal
  const [showQRCodeModal, setShowQRCodeModal] = useState(false);
  const openQRCodeModal = () => setShowQRCodeModal(true);
  const closeQRCodeModal = () => setShowQRCodeModal(false);

  let InsuranceType,
    GenderType = null;

  if (data) {
    // switch (data.Insurance) {
    //   case "1":
    //     InsuranceType = "سلامت ایرانیان";
    //     break;
    //   case "2":
    //     InsuranceType = "تامین اجتماعی";
    //     break;
    //   case "3":
    //     InsuranceType = "نیروهای مسلح";
    //     break;
    //   case "4":
    //     InsuranceType = "آزاد";
    //     break;
    //   default:
    //     break;
    // }

    switch (data.Gender) {
      case "M":
        GenderType = "مرد";
        break;
      case "F":
        GenderType = "زن";
        break;
      case "O":
        GenderType = "دیگر";
        break;
      default:
        break;
    }
  }

  let PatientAvatarUrl = setPatientAvatarUrl(data._id + ";" + ClinicUserID);

  return (
    <div className="cantainer">
      <div className="Cardmain ">
        <div className="profile col-md-5 col-12 p-relative">
          {generalEditMode && (
            <Link
              href={{
                pathname: "/editPatientsInfo",
                query: { id: data._id },
              }}
              className="btn eventBtns editPatientInfo"
              style={{ position: "absolute", top: "0", left: "0" }}
              data-pr-position="top"
            >
              <FeatherIcon icon="edit-3" />
              <Tooltip target=".editPatientInfo">ویرایش اطلاعات</Tooltip>
            </Link>
          )}

          <div className="pro-im-na">
            <div className="Cardimg">
              {data.Avatar ? (
                <img
                  src={"https://irannobat.ir/images/Avatar/" + data?.Avatar}
                  alt="patientAvatar"
                  style={{
                    width: "85px",
                    height: "85px",
                    borderRadius: "100%",
                  }}
                />
              ) : (
                <svg className="svg-icon" viewBox="0 0 20 20">
                  <path
                    fill="#F5E8DF"
                    d="M12.443,9.672c0.203-0.496,0.329-1.052,0.329-1.652c0-1.969-1.241-3.565-2.772-3.565S7.228,6.051,7.228,8.02c0,0.599,0.126,1.156,0.33,1.652c-1.379,0.555-2.31,1.553-2.31,2.704c0,1.75,2.128,3.169,4.753,3.169c2.624,0,4.753-1.419,4.753-3.169C14.753,11.225,13.821,10.227,12.443,9.672z M10,5.247c1.094,0,1.98,1.242,1.98,2.773c0,1.531-0.887,2.772-1.98,2.772S8.02,9.551,8.02,8.02C8.02,6.489,8.906,5.247,10,5.247z M10,14.753c-2.187,0-3.96-1.063-3.96-2.377c0-0.854,0.757-1.596,1.885-2.015c0.508,0.745,1.245,1.224,2.076,1.224s1.567-0.479,2.076-1.224c1.127,0.418,1.885,1.162,1.885,2.015C13.961,13.689,12.188,14.753,10,14.753z M10,0.891c-5.031,0-9.109,4.079-9.109,9.109c0,5.031,4.079,9.109,9.109,9.109c5.031,0,9.109-4.078,9.109-9.109C19.109,4.969,15.031,0.891,10,0.891z M10,18.317c-4.593,0-8.317-3.725-8.317-8.317c0-4.593,3.724-8.317,8.317-8.317c4.593,0,8.317,3.724,8.317,8.317C18.317,14.593,14.593,18.317,10,18.317z"
                  ></path>
                </svg>
              )}

              {avatarEditMode && (
                <button
                  type="button"
                  onClick={openUploadAvatarModal}
                  className="btn btn-outline-primary changeAvatarIcon2"
                  data-pr-position="left"
                >
                  <FeatherIcon icon="camera" />
                  <Tooltip target=".changeAvatarIcon2">ویرایش آواتار</Tooltip>
                </button>
              )}
            </div>

            <div className="name">{data?.Name ? data.Name : "-"}</div>
            <div className="job">
              {data?.NationalID ? data.NationalID : "-"}
            </div>
          </div>
        </div>

        <div className="viwer">
          <div className="boxall">
            <span className="value">سن</span>
            <span className="parameter">
              {data?.Age ? data.Age + " ساله" : "-"}{" "}
            </span>
          </div>
          <div className="boxall2">
            <span className="value">تاریخ تولد</span>
            <span className="parameter">
              {data?.BD
                ? data.BD.includes("/")
                  ? data.BD
                  : convertDateFormat(data.BD)
                : "-"}
            </span>
          </div>
        </div>

        <div className="viwer">
          <div className="boxall">
            <span className="value">نام بیمه</span>
            <span className="parameter">
              {data?.InsuranceName ? data.InsuranceName : "-"}
            </span>
          </div>
          <div className="boxall2">
            <span className="value">نوع بیمه</span>
            <span className="parameter">
              {data?.InsuranceTypeName ? data.InsuranceTypeName : "-"}
            </span>
          </div>
        </div>

        <div className="viwer">
          <div className="boxall">
            <span className="value">شماره همراه</span>
            <span className="parameter">
              {data?.NationalID ? data.NationalID : "-"}
            </span>
          </div>

          <div className="boxall2">
            <span className="value">جنسیت</span>
            <span className="parameter">{GenderType ? GenderType : "-"}</span>
          </div>
        </div>

        {!patientInfoArchiveMode && (
          <div className="viwer">
            <div className="boxall">
              <span className="value">قد</span>
              <span className="parameter">
                {data?.PatientHeight ? data.PatientHeight : "-"}
              </span>
            </div>
            <div className="boxall2">
              <span className="value">وزن</span>
              <span className="parameter">
                {data?.PatientWeight ? data.PatientWeight : "-"}
              </span>
            </div>
          </div>
        )}
      </div>

      <UploadAvatarModal
        data={data}
        show={showUploadAvatarModal}
        onHide={closeUploadAvatarModal}
        changePatientAvatar={changePatientAvatar}
        avatarIsLoading={avatarIsLoading}
        openQRCodeModal={openQRCodeModal}
        avatarSrc={avatarSrc}
        setAvatarSrc={setAvatarSrc}
        handleSubmit={handleSubmit}
        handleCroppedImage={handleCroppedImage}
        imageElement={imageElement}
      />

      <QRCodeGeneratorModal
        show={showQRCodeModal}
        onHide={closeQRCodeModal}
        url={"changePatientAvatar"}
        token={PatientAvatarUrl}
      />
    </div>
  );
};

export default PatientHorizontalCard;
