import { useState, useEffect } from "react";
import Image from "next/image";
import FeatherIcon from "feather-icons-react";
import FilterFavItems from "./filterFavItems";
import { Tooltip } from "primereact/tooltip";
import PatientVerticalCard from "components/dashboard/patientInfo/patientVerticalCard";

const PrescQuickAccessCard = ({
  data,
  handleEditService,
  removeFavItem,
  patientInfo,
  ClinicID,
  ActivePatientNID,
  setPatientInfo,
  openApplyFavPrescModal,
  favPrescData,
  handleAddFavPresc,
}) => {
  // console.log({ favPrescData });
  const [favSearchInput, setFavSearchInput] = useState("");
  const [selectedTab, setSelectedTab] = useState("");

  const handleTabChange = (tab) => setSelectedTab(tab);

  const filteredData = () => {
    if (selectedTab === 1) {
      return data.filter((item) => item.prescId === 1);
    } else if (selectedTab === 2) {
      return data.filter((item) => item.prescId === 2);
    } else if (selectedTab === 5) {
      return data.filter((item) => item.prescId === 5);
    } else {
      return data;
    }
  };

  const searchedFavItems = filteredData().filter(
    (item) =>
      item?.SrvName?.toLowerCase().includes(favSearchInput?.toLowerCase()) ||
      item?.SrvCode?.includes(favSearchInput)
  );

  useEffect(() => handleTabChange(1), []);

  return (
    <>
      <div>
        <div>
          <ul className="nav nav-tabs nav-tabs-bottom navTabBorder-b fw-bold d-flex justify-center">
            <li className="nav-item">
              <a
                className="nav-link active text-center"
                href="#bottom-tab1"
                data-bs-toggle="tab"
                onClick={() => handleTabChange(1)}
              >
                بیمار
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link text-center"
                href="#bottom-tab2"
                data-bs-toggle="tab"
                onClick={() => handleTabChange(2)}
              >
                خدمات پرمصرف
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link text-center"
                href="#bottom-tab3"
                data-bs-toggle="tab"
                onClick={() => handleTabChange(3)}
              >
                نسخ پرمصرف
              </a>
            </li>
          </ul>

          <div className="tab-content pt-4">
            <div className="tab-pane active show" id="bottom-tab1">
              <PatientVerticalCard
                data={patientInfo}
                ClinicID={ClinicID}
                ActivePatientNID={ActivePatientNID}
                setPatientInfo={setPatientInfo}
              />
            </div>

            <div className="tab-pane" id="bottom-tab2">
              <div className="card">
                <div className="card-body">
                  <div className="py-2">
                    <FilterFavItems
                      favSearchInput={favSearchInput}
                      setFavSearchInput={setFavSearchInput}
                    />
                  </div>

                  <ul className="nav nav-tabs nav-justified nav-tabs-bottom navTabBorder-b fw-bold">
                    <li className="nav-item">
                      <a
                        className="nav-link active"
                        href="#bottom-tab-1"
                        data-bs-toggle="tab"
                        onClick={() => handleTabChange(1)}
                      >
                        دارو
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        className="nav-link"
                        href="#bottom-tab-2"
                        data-bs-toggle="tab"
                        onClick={() => handleTabChange(2)}
                      >
                        پاراکلینیک
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        className="nav-link"
                        href="#bottom-tab-3"
                        data-bs-toggle="tab"
                        onClick={() => handleTabChange(5)}
                      >
                        خدمات
                      </a>
                    </li>
                  </ul>

                  <div className="show active padding-1" id="bottom-tab-1">
                    {searchedFavItems?.map((srv, index) => (
                      <div
                        className="row text-secondary border-gray rounded my-1 p-1 quickAccessPrscBox"
                        key={index}
                      >
                        <div className="col-11 d-flex  font-12 fw-bold align-items-center gap-1">
                          <p className="mb-0">{srv.SrvCode}</p>
                          <p className="mb-0">|</p>
                          <p className="mb-0">
                            {srv.SrvName.substr(0, 30) + " ..."}
                          </p>
                        </div>

                        <div className="col-1 d-flex justify-center align-items-center">
                          <button
                            type="button"
                            className="btn p-2 addBtn formBtns"
                            data-pr-position="left"
                            onClick={(e) => {
                              handleEditService(srv, true);
                            }}
                          >
                            <Tooltip target=".addBtn">اضافه به لیست</Tooltip>
                            <FeatherIcon
                              icon="plus"
                              className="prescItembtns"
                            />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="tab-pane" id="bottom-tab3">
              <div className="card quickAccessCardHeight">
                <div className="card-body dir-rtl">
                  <div>
                    <button
                      onClick={openApplyFavPrescModal}
                      className="btn btn-outline-primary w-100 font-13 d-flex align-items-center justify-center gap-1"
                    >
                      <FeatherIcon
                        icon="plus"
                        style={{ width: "14px", height: "14px" }}
                      />
                      افزودن نسخه فعلی
                    </button>
                  </div>

                  <div className="mt-3">
                    {favPrescData.map((item, index) => (
                      <div
                        className="border-gray rounded my-1 py-2 px-3 fw-bold font-14 text-secondary quickAccessPrscBox d-flex align-items-center justify-between"
                        key={index}
                      >
                        <div className="">{item.Name}</div>
                        <div className="">
                          <button
                            type="button"
                            className="btn addPrescBtn formBtns p-1"
                            data-pr-position="left"
                            onClick={() => handleAddFavPresc(item)}
                          >
                            <Tooltip target=".addPrescBtn">مشاهده نسخه</Tooltip>
                            <FeatherIcon
                              icon="plus"
                              className="prescItembtns"
                            />
                          </button>
                        </div>
                      </div>
                    ))}
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

export default PrescQuickAccessCard;
