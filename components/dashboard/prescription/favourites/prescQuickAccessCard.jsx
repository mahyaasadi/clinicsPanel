import { useState, useEffect } from "react";
import FeatherIcon from "feather-icons-react";
import { Tooltip } from "primereact/tooltip";
import { Skeleton } from "primereact/skeleton";
import FilterFavItems from "./filterFavItems";
import PatientVerticalCard from "components/dashboard/patientInfo/patientVerticalCard";

const PrescQuickAccessCard = ({
  data,
  handleEditService,
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
  quickAccessMode,
  salamatHeaderList,
  isLoading,
  depIsLoading,
}) => {
  const [favSearchInput, setFavSearchInput] = useState("");

  // Tamin Mode
  const [selectedFavTaminTab, setSelectedFavTaminTab] = useState("");
  const handleTaminFavTabChange = (tab) => setSelectedFavTaminTab(tab);

  const filteredTaminData = () => {
    if (selectedFavTaminTab === 1) {
      return data.filter((item) => item.prescId === 1);
    } else if (selectedFavTaminTab === 2) {
      return data.filter((item) => item.prescId === 2);
    } else if (selectedFavTaminTab === 5) {
      return data.filter((item) => item.prescId === 5);
    } else {
      return data;
    }
  };

  const searchedFavTaminItems = filteredTaminData().filter(
    (item) =>
      item?.SrvName?.toLowerCase().includes(favSearchInput?.toLowerCase()) ||
      item?.SrvCode?.includes(favSearchInput)
  );

  useEffect(() => handleTaminFavTabChange(1), []);

  // Salamat Mode
  let firstMatchingId = null;
  let firstMatchingIndex = -1;

  const [selectedFavSalamatTab, setSelectedFavSalamatTab] = useState("");
  const [matchingIDs, setMatchingIDs] = useState([]);
  const handleSalamatFavTabChange = (tab) => {
    setSelectedFavSalamatTab(tab);
    // $("#prescTypeId" + tab).click();
  };

  const searchedFavSalamatItems = data?.filter((item) =>
    item?.serviceInterfaceName
      ?.toLowerCase()
      .includes(favSearchInput?.toLowerCase())
  );

  const filteredSalamatData = () => {
    return searchedFavSalamatItems.filter(
      (item) => item.typeId === selectedFavSalamatTab
    );
  };

  useEffect(() => {
    // Find the first matching id
    salamatHeaderList?.some((item) => {
      if (matchingIDs?.includes(item.id)) {
        firstMatchingId = item.id;
        return true; // Exit loop after finding the first matching id
      }
      return false;
    });

    handleSalamatFavTabChange(firstMatchingId);
  }, [matchingIDs, salamatHeaderList]);

  useEffect(() => {
    const idsSet = new Set(); // to store unique values

    searchedFavSalamatItems?.forEach((dataItem) => {
      const matchingHeader = salamatHeaderList?.find(
        (headerItem) => headerItem.id === dataItem.typeId
      );

      if (matchingHeader) {
        idsSet.add(matchingHeader.id);
      }
    });

    const uniqueIds = Array.from(idsSet); // convert Set back to array

    setMatchingIDs(uniqueIds);
  }, [data, salamatHeaderList]);

  return (
    <>
      {!depIsLoading ? (
        <div>
          <ul className="nav nav-tabs nav-tabs-bottom navTabBorder-b fw-bold d-flex justify-center align-items-center">
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

                  {quickAccessMode == "tamin" && (
                    <>
                      <ul className="nav nav-tabs nav-justified nav-tabs-bottom navTabBorder-b font-12">
                        <li className="nav-item">
                          <a
                            className="nav-link active"
                            href="#bottom-tab-1"
                            data-bs-toggle="tab"
                            onClick={() => handleTaminFavTabChange(1)}
                          >
                            دارو
                          </a>
                        </li>
                        <li className="nav-item">
                          <a
                            className="nav-link"
                            href="#bottom-tab-2"
                            data-bs-toggle="tab"
                            onClick={() => handleTaminFavTabChange(2)}
                          >
                            پاراکلینیک
                          </a>
                        </li>
                        <li className="nav-item">
                          <a
                            className="nav-link"
                            href="#bottom-tab-3"
                            data-bs-toggle="tab"
                            onClick={() => handleTaminFavTabChange(5)}
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
                          {searchedFavTaminItems?.map((srv, index) =>
                            favItemIsLoading ? (
                              <div className="favItemSkeleton mb-1" key={index}>
                                <Skeleton></Skeleton>
                              </div>
                            ) : (
                              <div
                                className="btn d-flex justify-between text-secondary border-gray rounded my-1 p-1 quickAccessPrscBox"
                                onClick={(e) => {
                                  handleEditService(srv, true);
                                }}
                                key={index}
                              >
                                <div className="col d-flex flex-col font-12 fw-bold align-items-center gap-1">
                                  <p className="mb-1 w-75 text-center border-bottom-1">
                                    {srv.SrvCode}
                                  </p>

                                  <p className="mb-0 text-center">
                                    {srv.SrvName.length > 27
                                      ? srv.SrvName.substr(0, 27) + " ..."
                                      : srv.SrvName}
                                  </p>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    </>
                  )}

                  {quickAccessMode == "salamat" && (
                    <>
                      <ul
                        dir="rtl"
                        className="nav nav-tabs nav-justified nav-tabs-bottom navTabBorder-b nav-tabs-scroll font-12 pb-0"
                      >
                        {salamatHeaderList.map((item, index) => {
                          if (matchingIDs.includes(item.id)) {
                            // If it's the first matching tab found, store its index
                            if (firstMatchingIndex === -1) {
                              firstMatchingIndex = index;
                            }
                            return (
                              <li className="nav-item" key={index}>
                                <a
                                  className={`nav-link d-flex align-items-center justify-center gap-2 ${
                                    index === firstMatchingIndex
                                      ? "active"
                                      : item.Active
                                  }`}
                                  href={`#salamat-bottom-tab${index + 1}`}
                                  data-bs-toggle="tab"
                                  onClick={() =>
                                    handleSalamatFavTabChange(item.id)
                                  }
                                >
                                  {item.name}
                                </a>
                              </li>
                            );
                          } else {
                            return null; // Render nothing if the item's id is not in matchingIds
                          }
                        })}
                      </ul>

                      <div
                        className="favitemTab show active mt-3"
                        id="bottom-tab-1"
                        // onClick={${}}
                      >
                        <div className="dir-rtl p-0">
                          {filteredSalamatData()?.map((srv, index) =>
                            favItemIsLoading ? (
                              <div className="favItemSkeleton my-1" key={index}>
                                <Skeleton></Skeleton>
                              </div>
                            ) : (
                              <div
                                key={index}
                                className="btn d-flex justify-between text-secondary border-gray rounded align-items-center my-1 p-2 quickAccessPrscBox font-12 fw-bold"
                                onClick={(e) => {
                                  handleEditService(srv, true);
                                }}
                              >
                                <div className="col d-flex flex-col align-items-center text-center">
                                  <p>
                                    {srv.serviceInterfaceName.length > 27
                                      ? srv.serviceInterfaceName.substr(0, 27) +
                                        " ..."
                                      : srv.serviceInterfaceName}
                                  </p>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="tab-pane" id="bottom-tab3">
              <div className="card quickAccessCardHeight">
                <div className="card-body dir-rtl">
                  {quickAccessMode == "tamin" && (
                    <>
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
                          </button>
                        </div>

                        {editFavPrescData.length !== 0 && (
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

                              <Tooltip target=".editPrescBtn">
                                ویرایش نسخه فعلی
                              </Tooltip>
                            </button>
                          </div>
                        )}
                      </div>

                      {editFavPrescData.length !== 0 && (
                        <div className="d-flex gap-1 mt-1">
                          <div className="col">
                            <button
                              onClick={() =>
                                removeFavPresc(editFavPrescData._id)
                              }
                              className="height-40 btn btn-outline-primary w-100 font-12 d-flex align-items-center justify-center gap-2 removePrescBtn"
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
                              className="height-40 btn btn-outline-primary w-100 font-12 d-flex align-items-center justify-center gap-2 refreshPrescBtn"
                              data-pr-position="left"
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
                        </div>
                      )}

                      <div
                        className={`favitemTab mt-2 ${
                          editFavPrescData.length == 0
                            ? "d-flex flex-column-reverse"
                            : "d-flex"
                        } gap-1`}
                      >
                        <div
                          className={`${
                            editFavPrescData.length == 0 && "mt-1"
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
                                className={`${
                                  editFavPrescData._id === item._id
                                    ? "btn-outline-primary"
                                    : "text-secondary border-gray"
                                } btn btn-outline-primary w-100 rounded mb-1 py-2 px-3 font-14 d-flex align-items-center justify-between`}
                                key={index}
                                disabled={isLoading ? disabled : false}
                              >
                                <div>{item.Name}</div>
                              </button>
                            )
                          )}
                        </div>
                      </div>
                    </>
                  )}

                  {quickAccessMode == "salamat" && (
                    <>
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
                          </button>
                        </div>

                        {editFavPrescData.length !== 0 && (
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

                              <Tooltip target=".editPrescBtn">
                                ویرایش نسخه فعلی
                              </Tooltip>
                            </button>
                          </div>
                        )}
                      </div>

                      {editFavPrescData.length !== 0 && (
                        <div className="d-flex gap-1 mt-1">
                          <div className="col">
                            <button
                              onClick={() =>
                                removeFavPresc(editFavPrescData._id)
                              }
                              className="height-40 btn btn-outline-primary w-100 font-12 d-flex align-items-center justify-center gap-2 removePrescBtn"
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
                              className="height-40 btn btn-outline-primary w-100 font-12 d-flex align-items-center justify-center gap-2 refreshPrescBtn"
                              data-pr-position="left"
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
                        </div>
                      )}

                      <div className="mt-2 dir-rtl w-100">
                        {favPrescData.map((item, index) =>
                          favItemIsLoading ? (
                            <div className="favItemSkeleton mb-1" key={index}>
                              <Skeleton></Skeleton>
                            </div>
                          ) : (
                            <button
                              key={index}
                              onClick={() => handleAddFavPresc(item)}
                              className={`${
                                editFavPrescData._id === item._id
                                  ? "btn-outline-primary"
                                  : "text-secondary border-gray"
                              } btn btn-outline-primary w-100 rounded mb-1 py-2 px-3 font-14 d-flex align-items-center justify-between`}
                            >
                              <div>{item.Name}</div>
                            </button>
                          )
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="quickAccessSkeleton mt-2">
          <Skeleton></Skeleton>
        </div>
      )}
    </>
  );
};

export default PrescQuickAccessCard;
