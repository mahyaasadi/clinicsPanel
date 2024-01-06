import { useState, useEffect } from "react";
import Head from "next/head";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { getSession } from "lib/session";
import { setSession } from "lib/SessionMange";
import { axiosClient } from "class/axiosConfig";
import { convertBase64 } from "utils/convertBase64";
import { ErrorAlert, SuccessAlert } from "class/AlertManage";
import Loading from "components/commonComponents/loading/loading";
import AvatarSettings from "components/userProfile/avatarSettings";
import PasswordSettings from "components/userProfile/passwordSettings";
import GeneralUserInfoSettings from "components/userProfile/generalUserInfoSettings";

export const getServerSideProps = async ({ req, res }) => {
  const result = await getSession(req, res);

  if (result) {
    const { ClinicUser } = result;
    return { props: { ClinicUser } };
  } else {
    return {
      redirect: {
        permanent: false,
        destination: `/`,
      },
    };
  }
};

const ProfileSettings = ({ ClinicUser }) => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [infoIsLoading, setInfoIsLoading] = useState(false);
  const [avatarIsLoading, setAvatarIsLoading] = useState(false);
  const [passIsLoading, setPassIsLoading] = useState(false);

  const [userInfo, setUserInfo] = useState([]);
  const [newPassword, setNewPassword] = useState("");
  const [showTelAlertText, setShowTelAlertText] = useState(false);
  const [showPasswordAlertText, setShowPasswordAlertText] = useState(false);
  const [showConfPassAlertText, setShowConfPassAlertText] = useState(false);

  const handleNewPassword = (e) => setNewPassword(e.target.value);

  const getClinicUserById = () => {
    setIsLoading(true);

    let url = "ClinicUser/getUserById";
    let data = {
      UserID: ClinicUser._id,
    };

    axiosClient
      .post(url, data)
      .then((response) => {
        setUserInfo(response.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  // Edit GeneralInfo
  const editGeneralUserInfo = (e) => {
    e.preventDefault();
    setInfoIsLoading(true);

    let formData = new FormData(e.target);
    const formProps = Object.fromEntries(formData);

    let url = "ClinicUser/updateUser";
    let data = {
      UserID: formProps.userId,
      FullName: formProps.editUserFullName,
      Tel: formProps.editUserTel,
      User: formProps.editUserName,
    };

    axiosClient
      .put(url, data)
      .then(async (response) => {
        setUserInfo({
          FullName: response.data.FullName,
          Tel: response.data.Tel,
          User: formProps.editUserName,
          _id: formProps.userId,
        });

        // reset cookies
        let clinicSession = await setSession(userInfo);
        Cookies.set("clinicSession", clinicSession, { expires: 1 });

        SuccessAlert("موفق", "ویرایش اطلاعات با موفقیت انجام گرفت!");
        setInfoIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setInfoIsLoading(false);
        ErrorAlert("خطا", "ویرایش اطلاعات با خطا مواجه گردید!");
      });
  };

  // Edit Avatar
  const changeUserAvatar = async (formData) => {
    setAvatarIsLoading(true);

    const formProps = Object.fromEntries(formData);
    if (formProps.editUserAvatar) {
      let avatarBlob;

      if (formProps.editUserAvatar) {
        avatarBlob = await convertBase64(formProps.editUserAvatar);

        let url = "ClinicUser/ChangeAvatar";
        let data = {
          UserID: formProps.userId,
          Avatar: avatarBlob,
        };

        axiosClient
          .put(url, data)
          .then(async (response) => {
            setUserInfo({ ...userInfo, Avatar: response.data.Avatar });

            document
              .getElementById("avatar")
              .setAttribute(
                "src",
                "https://irannobat.ir" + response.data.Avatar
              );
            document
              .getElementById("avatar")
              .setAttribute(
                "srcSet",
                "https://irannobat.ir" + response.data.Avatar
              );
            document
              .getElementById("dropdownAvatar")
              .setAttribute(
                "src",
                "https://irannobat.ir" + response.data.Avatar
              );
            document
              .getElementById("dropdownAvatar")
              .setAttribute(
                "srcSet",
                "https://irannobat.ir" + response.data.Avatar
              );

            userInfo.Avatar = "https://irannobat.ir" + response.data.Avatar;

            // reset cookies
            let clinicSession = await setSession(userInfo);
            Cookies.set("clinicSession", clinicSession, { expires: 1 });

            setTimeout(() => {
              router.push("/profile");
            }, 300);

            SuccessAlert("موفق", "تغییر آواتار با موفقیت انجام گردید!");
            setAvatarIsLoading(false);
          })
          .catch((err) => {
            console.log(err);
            setAvatarIsLoading(false);

            ErrorAlert("خطا", "تغییر آواتار با خطا مواجه گردید!");
          });
      }
    }
  };

  // Edit Password
  const editUserPassword = (e) => {
    e.preventDefault();
    setPassIsLoading(true);

    let formData = new FormData(e.target);
    const formProps = Object.fromEntries(formData);

    let url = "ClinicUser/ChangePassword";
    let data = {
      UserID: formProps.userId,
      Password: formProps.currentPassword,
      NewPassword: newPassword,
    };

    axiosClient
      .put(url, data)
      .then((response) => {
        setPassIsLoading(false);
        SuccessAlert("موفق", "رمز عبور با موفقیت تغییر پیدا کرد!");
      })
      .catch((err) => {
        console.log(err);
        setPassIsLoading(false);
        ErrorAlert("خطا", "تغییر رمز عبور با خطا مواجه گردید!");
      });
  };

  useEffect(() => {
    getClinicUserById();
    setShowTelAlertText(false);
    setShowPasswordAlertText(false);
    setShowConfPassAlertText(false);
  }, []);

  return (
    <>
      <Head>
        <title>تنظیمات پروفایل</title>
      </Head>
      <div className="page-wrapper">
        {isLoading ? (
          <Loading />
        ) : (
          <div className="content container-fluid">
            <div className="card">
              <div className="card-body padding-2">
                <div className="page-header">
                  <div className="row">
                    <div className="col-sm-6">
                      <p className="font-17 fw-bold text-secondary">
                        تنظیمات پروفایل
                      </p>
                      <hr className="marginb-md1" />
                    </div>
                  </div>
                </div>

                <ul className="nav nav-tabs nav-tabs-solid nav-tabs-rounded">
                  <li className="nav-item">
                    <a
                      className="nav-link active"
                      href="#solid-rounded-tab1"
                      data-bs-toggle="tab"
                    >
                      اطلاعات حساب
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      className="nav-link"
                      href="#solid-rounded-tab2"
                      data-bs-toggle="tab"
                    >
                      رمز عبور
                    </a>
                  </li>
                </ul>

                <div className="tab-content">
                  <div className="tab-pane show active" id="solid-rounded-tab1">
                    <div className="row">
                      <GeneralUserInfoSettings
                        userInfo={userInfo}
                        editGeneralUserInfo={editGeneralUserInfo}
                        infoIsLoading={infoIsLoading}
                        showTelAlertText={showTelAlertText}
                        setShowTelAlertText={setShowTelAlertText}
                      />
                      <AvatarSettings
                        ClinicUser={ClinicUser}
                        userInfo={userInfo}
                        changeUserAvatar={changeUserAvatar}
                        avatarIsLoading={avatarIsLoading}
                      />
                    </div>
                  </div>
                  <div className="tab-pane" id="solid-rounded-tab2">
                    <PasswordSettings
                      userInfo={userInfo}
                      passIsLoading={passIsLoading}
                      newPassword={newPassword}
                      handleNewPassword={handleNewPassword}
                      editUserPassword={editUserPassword}
                      showPasswordAlertText={showPasswordAlertText}
                      setShowPasswordAlertText={setShowPasswordAlertText}
                      showConfPassAlertText={showConfPassAlertText}
                      setShowConfPassAlertText={setShowConfPassAlertText}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProfileSettings;
