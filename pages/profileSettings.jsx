import { useState } from "react";
import Head from "next/head";
import { getSession } from "lib/session";
import AvatarSettings from "components/userProfile/avatarSettings";
import PasswordSettings from "components/userProfile/passwordSettings";
import GenralUserInfoSettings from "components/userProfile/generalUserInfoSettings";

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
  const [isLoading, setIsLoading] = useState(true);
  const [newPassword, setNewPassword] = useState("");

  const handleNewPassword = (e) => setNewPassword(e.target.value);

  return (
    <>
      <Head>
        <title>تنظیمات پروفایل</title>
      </Head>
      <div className="page-wrapper">
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
                    <GenralUserInfoSettings
                      userInfo={ClinicUser}
                      //   editGeneralUserInfo={editGeneralUserInfo}
                      isLoading={isLoading}
                    />
                    <AvatarSettings
                      UserData={ClinicUser}
                      // changeUserAvatar={changeUserAvatar}
                      isLoading={isLoading}
                    />
                  </div>
                </div>
                <div className="tab-pane" id="solid-rounded-tab2">
                  <PasswordSettings
                    newPassword={newPassword}
                    handleNewPassword={handleNewPassword}
                    //   editUserPassword={editUserPassword}
                    UserData={ClinicUser}
                    isLoading={isLoading}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileSettings;
