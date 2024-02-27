import { useState, useEffect } from "react";
import Image from "next/image";
import FeatherIcon from "feather-icons-react";
import { Tooltip } from "primereact/tooltip";
import { Skeleton } from "primereact/skeleton";
import FilterFavItems from "./filterFavItems";
import PatientVerticalCard from "components/dashboard/patientInfo/patientVerticalCard";

const PrescQuickAccessCard = ({
  data,
  handleEditService,
  // removeFavItem,
  patientInfo,
  ClinicID,
  ActivePatientNID,
  setPatientInfo,
  openApplyFavPrescModal,
  favPrescData,
  setFavPrescItemsData,
  handleAddFavPresc,
  removeFavPresc,
  editFavPrescData,
  handleReset,
  editFavPresc,
  favItemIsLoading,
}) => {
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
              >
                بیمار
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link text-center"
                href="#bottom-tab2"
                data-bs-toggle="tab"
              >
                خدمات پرمصرف
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link text-center"
                href="#bottom-tab3"
                data-bs-toggle="tab"
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

                  <ul className="nav nav-tabs nav-justified nav-tabs-bottom navTabBorder-b font-12">
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

                  <div
                    className="favitemTab show active mt-3"
                    id="bottom-tab-1"
                  >
                    <div className="dir-rtl p-1">
                      {searchedFavItems?.map((srv, index) =>
                        favItemIsLoading ? (
                          <div className="favItemSkeleton mb-1" key={index}>
                            <Skeleton></Skeleton>
                          </div>
                        ) : (
                          <div
                            className="d-flex justify-between text-secondary border-gray rounded my-1 p-1 quickAccessPrscBox"
                            key={index}
                          >
                            <div className="col d-flex flex-col font-12 fw-bold align-items-center gap-1">
                              <p className="mb-1 w-75 text-center border-bottom-1">
                                {srv.SrvCode}
                              </p>
                              <p className="mb-0 text-center">
                                {srv.SrvName.substr(0, 27) + " ..."}
                              </p>
                            </div>

                            <div className="d-flex justify-end align-items-center">
                              <button
                                type="button"
                                className="btn p-2 addBtn formBtns"
                                data-pr-position="left"
                                onClick={(e) => {
                                  handleEditService(srv, true);
                                }}
                              >
                                <Tooltip target=".addBtn">
                                  اضافه به لیست
                                </Tooltip>
                                <FeatherIcon
                                  icon="plus"
                                  className="prescItembtns"
                                />
                              </button>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="tab-pane" id="bottom-tab3">
              <div className="card quickAccessCardHeight">
                <div className="card-body dir-rtl">
                  <div className="d-flex gap-1">
                    <div className="col">
                      <button
                        onClick={openApplyFavPrescModal}
                        className="height-40 btn btn-outline-primary w-100 font-12 d-flex align-items-center justify-center gap-2 addPrescBtn"
                        data-pr-position="right"
                      >
                        <FeatherIcon
                          icon="plus"
                          style={{ width: "14px", height: "14px" }}
                        />

                        {editFavPrescData.length == 0 && "افزودن نسخه فعلی"}

                        <Tooltip target=".addPrescBtn">
                          {" "}
                          افزودن نسخه فعلی
                        </Tooltip>
                      </button>
                    </div>

                    {editFavPrescData.length !== 0 &&
                      <div className="col">
                        <button
                          onClick={() => editFavPresc(editFavPrescData._id)}
                          className="height-40 btn btn-outline-primary w-100 font-12 d-flex align-items-center justify-center gap-2 editPrescBtn"
                          data-pr-position="left"
                        >
                          <FeatherIcon
                            icon="edit-2"
                            style={{ width: "14px", height: "14px" }}
                          />
                          {/* ویرایش نسخه فعلی */}
                          <Tooltip target=".editPrescBtn">
                            {" "}
                            ویرایش نسخه فعلی
                          </Tooltip>
                        </button>
                      </div>
                    }
                  </div>

                  {editFavPrescData.length !== 0 && (
                    <div className="d-flex gap-1 mt-1">
                      <div className="col">
                        <button
                          onClick={() => removeFavPresc(editFavPrescData._id)}
                          className="height-40 btn btn-outline-primary w-100 font-12 d-flex align-items-center justify-center gap-2 removePrescBtn"
                          data-pr-position="right"
                        >
                          <FeatherIcon
                            icon="trash"
                            style={{ width: "14px", height: "14px" }}
                          />
                          {/* حذف نسخه فعلی */}

                          <Tooltip target=".removePrescBtn">
                            {" "}
                            حذف نسخه فعلی
                          </Tooltip>
                        </button>
                      </div>

                      <div className="col">
                        <button
                          onClick={handleReset}
                          className="height-40 btn btn-outline-primary w-100 font-12 d-flex align-items-center justify-center gap-2 refreshPrescBtn"
                          data-pr-position="left"
                        >
                          <FeatherIcon
                            icon="refresh-cw"
                            style={{ width: "14px", height: "14px" }}
                          />
                          {/* تنظیم مجدد */}

                          <Tooltip target=".refreshPrescBtn">
                            تنظیم مجدد
                          </Tooltip>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* {editFavPrescData.length !== 0 && (
                      <>
                        <div className="col">
                          <button
                            onClick={() => editFavPresc(editFavPrescData._id)}
                            className="height-40 btn btn-outline-primary w-100 font-12 d-flex align-items-center justify-center gap-2 editPrescBtn"
                            data-pr-position="bottom"
                          >
                            <FeatherIcon
                              icon="edit-2"
                              style={{ width: "14px", height: "14px" }}
                            />
                            ویرایش نسخه فعلی
                            <Tooltip target=".editPrescBtn">
                              {" "}
                              ویرایش نسخه فعلی
                            </Tooltip>
                          </button>
                        </div>

                        <div className="col">
                          <button
                            onClick={() => removeFavPresc(editFavPrescData._id)}
                            className="height-40 btn btn-outline-primary w-100 font-12 d-flex align-items-center justify-center gap-2 removePrescBtn"
                            data-pr-position="bottom"
                          >
                            <FeatherIcon
                              icon="trash"
                              style={{ width: "14px", height: "14px" }}
                            />
                            حذف نسخه فعلی

                            <Tooltip target=".removePrescBtn">
                              {" "}
                              حذف نسخه فعلی
                            </Tooltip>
                          </button>
                        </div>

                        <div className="col">
                          <button
                            onClick={handleReset}
                            className="height-40 btn btn-outline-primary w-100 font-12 d-flex align-items-center justify-center gap-2 refreshPrescBtn"
                            data-pr-position="left"
                          >
                            <FeatherIcon
                              icon="refresh-cw"
                              style={{ width: "14px", height: "14px" }}
                            />
                            تنظیم مجدد

                            <Tooltip target=".refreshPrescBtn">
                              تنظیم مجدد
                            </Tooltip>
                          </button>
                        </div>
                      </>
                    )} */}

                  <div
                    className={`favitemTab mt-2 ${editFavPrescData.length == 0
                      ? "d-flex flex-column-reverse"
                      : "d-flex"
                      } gap-1`}
                  >
                    <div
                      className={`${editFavPrescData.length == 0 && "mt-1"
                        } dir-rtl w-100`}
                    >
                      {favPrescData.map((item, index) =>
                        favItemIsLoading ? (
                          <div className="favItemSkeleton mb-1" key={index}>
                            <Skeleton></Skeleton>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleAddFavPresc(item)}
                            className={`${editFavPrescData._id === item._id
                              ? "btn-outline-primary"
                              : "text-secondary border-gray"
                              } btn btn-outline-primary w-100 rounded mb-1 py-2 px-3 font-14 d-flex align-items-center justify-between`}
                            key={index}
                          >
                            <div>{item.Name}</div>
                            <div></div>
                          </button>
                        )
                      )}
                    </div>

                    {/* <div className="d-flex flex-col gap-1">
                      <div className="col">
                        <button
                          onClick={openApplyFavPrescModal}
                          className="btn btn-outline-primary w-100 font-13 d-flex align-items-center justify-center gap-1 height-40 addPrescBtn"
                          data-pr-position="right"
                        >
                          {editFavPrescData.length == 0 && "افزودن نسخه فعلی"}
                          <FeatherIcon
                            icon="plus"
                            style={{ width: "14px", height: "14px" }}
                          />

                          <Tooltip target=".addPrescBtn">
                            {" "}
                            افزودن نسخه فعلی
                          </Tooltip>
                        </button>
                      </div>

                      {editFavPrescData.length !== 0 && (
                        <>
                          <div className="col">
                            <button
                              onClick={() => editFavPresc(editFavPrescData._id)}
                              className="btn btn-outline-primary w-100 font-13 d-flex align-items-center justify-center gap-1 height-40 editPrescBtn"
                              data-pr-position="right"
                            >
                              <FeatherIcon
                                icon="edit-2"
                                style={{ width: "14px", height: "14px" }}
                              />
                              <Tooltip target=".editPrescBtn">
                                {" "}
                                ویرایش نسخه فعلی
                              </Tooltip>
                            </button>
                          </div>

                          <div className="col">
                            <button
                              onClick={() =>
                                removeFavPresc(editFavPrescData._id)
                              }
                              className="btn btn-outline-primary w-100 font-13 d-flex align-items-center justify-center gap-1 height-40 removePrescBtn"
                              data-pr-position="right"
                            >
                              <FeatherIcon
                                icon="trash"
                                style={{ width: "14px", height: "14px" }}
                              />
                              <Tooltip target=".removePrescBtn">
                                {" "}
                                حذف نسخه فعلی
                              </Tooltip>
                            </button>
                          </div>

                          <div className="col">
                            <button
                              onClick={handleReset}
                              className="btn btn-outline-primary w-100 font-13 d-flex align-items-center justify-center gap-1 height-40 refreshPrescBtn"
                              data-pr-position="right"
                            >
                              <FeatherIcon
                                icon="refresh-cw"
                                style={{ width: "14px", height: "14px" }}
                              />
                              <Tooltip target=".refreshPrescBtn">
                                تنظیم مجدد
                              </Tooltip>
                            </button>
                          </div>
                        </>
                      )}
                    </div> */}
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
