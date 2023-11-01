import { useState } from "react";
import { getSession } from "lib/session";

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
const Profile = ({ ClinicUser }) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      <div className="page-wrapper">
        <div className="content container-fluid">
          <div className="card profileCard p-4">
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
                      <p>{ClinicUser.FullName}</p>
                    </div>
                    <div className="col-md-4 mb-3">
                      <h5>نام کاربری</h5>
                      <p>{ClinicUser.User ? ClinicUser.User : ""}</p>
                    </div>

                    <div className="col-md-12">
                      <h6 className="pro-title text-secondary">اطلاعات شخصی</h6>
                    </div>
                    <div className="col-md-4">
                      <h5>شماره همراه</h5>
                      <p>{ClinicUser.Tel ? ClinicUser.Tel : ""}</p>
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
