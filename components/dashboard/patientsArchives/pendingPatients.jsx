import Link from "next/link";
import { Tooltip } from "primereact/tooltip";
import FeatherIcon from "feather-icons-react";
import { axiosClient } from "@/class/axiosConfig";
import { ErrorAlert, QuestionAlert } from "class/AlertManage"

const PendingPatients = ({ pendingPatientsData, setPendingPatientsData, ClinicID }) => {
  console.log({ pendingPatientsData });

  const _deletePendingPatient = async (id) => {
    let result = await QuestionAlert("حذف بیمار!", "آیا از حذف اطمینان دارید؟");

    if (result) {
      // setIsLoading(true);

      let url = `Patient/deletePendingPatient`;
      let data = {
        CenterID: ClinicID,
        PatientID: id,
      };

      console.log({ data });

      await axiosClient
        .delete(url, { data })
        .then(function (response) {
          console.log(response.data);
          setPendingPatientsData(pendingPatientsData.filter((a) => a._id !== id));
          // setIsLoading(false);
        })
        .catch(function (error) {
          console.log(error);
          ErrorAlert("خطا", "حذف بیمار با خطا مواجه گردید!")
          // setIsLoading(false);
        });
    }
  }

  return (
    <>
      <label className="lblAbs fw-bold font-14">لیست بیماران بدون سابقه</label>
      <div className="card">
        <div className="card-body pendingPatientsCard mt-2">
          <div className="row">
            {pendingPatientsData.map((item, index) => (
              <div
                key={index}
                className="card col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2 mb-2 patientCard"
              >
                <div className="card-body p-2">
                  <div className="d-flex justify-between font-13  text-secondary fw-bold">
                    <div className="d-flex align-items-center gap-3">
                      <div>
                        <img
                          src={
                            "https://irannobat.ir/images/" + item?.Patient?.Avatar
                          }
                          alt="patientAvatar"
                          style={{
                            width: "35px",
                            height: "35px",
                            borderRadius: "10px",
                          }}
                          onError={({ currentTarget }) => {
                            item?.Patient?.Gender
                              ? (currentTarget.src = `assets/img/avatar-${item?.Patient?.Gender}-pic.png`)
                              : (currentTarget.src = `assets/img/avatar-O-pic.png`);
                          }}
                        />
                      </div>

                      <div>
                        <p className="mb-1">{item?.Patient?.Name}</p>
                        <div className="d-flex gap-2 align-items-center">
                          <div className="w-16 m-0 d-flex">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              className="w-100 m-0"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z"
                              />
                            </svg>
                          </div>

                          {item?.Patient?.NationalID}
                        </div>

                        <div className="d-flex gap-2 align-items-center">
                          <FeatherIcon
                            icon="smartphone"
                            style={{ width: "16px" }}
                          />
                          <p id="PatientTel">{item?.Patient?.Tel}</p>
                        </div>
                      </div>
                    </div>

                    <div className="d-flex flex-col gap-1 align-items-center">
                      <Link
                        href={{
                          pathname: "/editPatientsInfo",
                          query: { id: item?.Patient?._id },
                        }}
                        className="editBtn d-flex align-items-center float-end m-1"
                        data-pr-position="top"
                      >
                        <Tooltip target=".editBtn">تکمیل پرونده</Tooltip>
                        <FeatherIcon
                          icon="edit-2"
                          style={{ width: "15px", height: "16px" }}
                        />
                      </Link>

                      <button
                        className="btn btn-sm p-0 trashButton d-flex justify-end"
                        onClick={() => _deletePendingPatient(item?.Patient?._id)}
                        data-pr-position="left"
                      >
                        <FeatherIcon icon="trash" style={{ width: "15px" }} />
                        <Tooltip target=".trashButton">حذف</Tooltip>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </>
  );
};

export default PendingPatients;
