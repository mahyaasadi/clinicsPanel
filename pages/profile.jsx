import { useEffect, useState } from "react";
import { getSession } from "lib/session";
import { axiosClient } from "@/class/axiosConfig";

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

let UserID = null;
const Profile = ({ ClinicUser }) => {
  UserID = ClinicUser._id;
  const [isLoading, setIsLoading] = useState(true);
  const [userInfo, setUserInfo] = useState([]);

  const getUserByID = () => {
    let url = "ClinicUser/getUserById";
    let data = {
      UserID,
    };

    axiosClient
      .post(url, data)
      .then((response) => {
        setUserInfo(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => getUserByID(), []);

  return (
    <>
      <div className="page-wrapper">
        <div className="content container-fluid">
          <div className="card profileCard p-4 dir-rtl">
            <div className="card-body">
              <div className="profile-info">
                <p className="font-17 text-secondary fw-bold ">پروفایل من</p>
                <hr className="marginb-md1" />
                <div className="profile-list">
                  <div className="profile-detail">
                    <label className="avatar profile-cover-avatar">
                      <img
                        className="avatar-img"
                        src={ClinicUser.Avatar}
                        alt="Profile Image"
                      />
                    </label>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      <h6 className="pro-title text-secondary">اطلاعات حساب</h6>
                    </div>
                    <div className="col-md-4 mb-3">
                      <h5>نام و نام خانوادگی</h5>
                      <p>{userInfo.FullName}</p>
                    </div>
                    <div className="col-md-4 mb-3">
                      <h5>نام کاربری</h5>
                      <p>{userInfo.User}</p>
                    </div>
                    <div className="col-md-4 mb-3">
                      <h5>نام مستعار</h5>
                      <p>{userInfo.NickName}</p>
                    </div>

                    <div className="col-md-12">
                      <h6 className="pro-title text-secondary">اطلاعات شخصی</h6>
                    </div>
                    <div className="col-md-4">
                      <h5>شماره همراه</h5>
                      <p>{userInfo.Tel}</p>
                    </div>
                    <div className="col-md-4 mb-3">
                      <h5>کد ملی</h5>
                      <p>{ClinicUser.NID ? ClinicUser.NID : ""}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
