import { useState, useEffect } from "react";
import Image from "next/image";
import FeatherIcon from "feather-icons-react";
import { Modal } from "react-bootstrap";
import { Tooltip } from "primereact/tooltip";
import FilterFavItems from "components/dashboard/prescription/filterFavItems";

const SalamatFavItemsModal = ({
  show,
  onHide,
  data,
  handleEditService,
  removeFavItem,
  salamatHeaderList,
  handleTabChange,
  selectedTab,
}) => {
  let firstMatchingId = null;

  const [favSearchInput, setFavSearchInput] = useState("");
  const [matchingIDs, setMatchingIDs] = useState([]);

  const searchedFavItems = data.filter((item) =>
    item.serviceInterfaceName
      .toLowerCase()
      .includes(favSearchInput.toLowerCase())
  );

  const filteredData = () => {
    return searchedFavItems.filter((item) => item.typeId === selectedTab);
  };

  useEffect(() => {
    // Find the first matching id
    salamatHeaderList.some((item) => {
      if (matchingIDs.includes(item.id)) {
        firstMatchingId = item.id;
        return true; // Exit loop after finding the first matching id
      }
      return false;
    });

    handleTabChange(firstMatchingId);
  }, [matchingIDs, salamatHeaderList]);

  useEffect(() => {
    // if (show) {
    console.log("object");
    const idsSet = new Set(); // to store unique values

    searchedFavItems?.forEach((dataItem) => {
      const matchingHeader = salamatHeaderList.find(
        (headerItem) => headerItem.id === dataItem.typeId
      );
      if (matchingHeader) {
        idsSet.add(matchingHeader.id);
      }
    });

    const uniqueIds = Array.from(idsSet); // convert Set back to array

    setMatchingIDs(uniqueIds);
    // }
  }, [data, salamatHeaderList]);

  const handleModalHide = () => {
    setFavSearchInput("");
    setMatchingIDs([]);
    onHide();
  };

  console.log(searchedFavItems, salamatHeaderList);

  return (
    <Modal show={show} onHide={handleModalHide} centered size="xl">
      <Modal.Header closeButton>
        <Modal.Title>
          <p className="mb-0 text-secondary font-14 fw-bold">خدمات پرمصرف</p>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body dir="ltr" className="favModalBody">
        <ul
          dir="rtl"
          className="nav nav-tabs nav-justified nav-tabs-bottom navTabBorder-b fw-bold nav-tabs-scroll"
        >
          {salamatHeaderList.map((item, index) => {
            if (matchingIDs.includes(item.id)) {
              return (
                <li className="nav-item" key={index}>
                  <a
                    className={`nav-link d-flex align-items-center justify-center gap-2 ${
                      index === 0 ? "active" : item.Active
                    }`}
                    href={`#bottom-tab${index + 1}`}
                    data-bs-toggle="tab"
                    onClick={() => handleTabChange(item.id)}
                  >
                    <img
                      src={`assets/img/salamatHeader/TaminPrescTypeID${item.id}.png`}
                      alt=""
                      width="30px"
                      height="30px"
                    />
                    {item.name}
                  </a>
                </li>
              );
            } else {
              return null; // Render nothing if the item's id is not in matchingIds
            }
          })}
        </ul>

        <div className="tab-content tabContentHeight p-0">
          <div className="tab-pane show active">
            <FilterFavItems
              favSearchInput={favSearchInput}
              setFavSearchInput={setFavSearchInput}
              filterSalamatMode={true}
            />

            <div className="accordion mt-4">
              {filteredData()?.map((srv, index) => (
                <div className="accordion-item" key={index}>
                  <h2
                    className="accordion-header text-secondary"
                    id={`heading${index}`}
                  >
                    <div className="row w-100">
                      <div className="col-2 d-flex gap-1 justify-center align-items-center">
                        <button
                          type="button"
                          className="btn p-2 btn-outline-danger removeBtn"
                          data-pr-position="left"
                          onClick={() =>
                            removeFavItem(srv.serviceNationalNumber)
                          }
                        >
                          <Tooltip target=".removeBtn">حذف</Tooltip>
                          <FeatherIcon icon="trash" className="prescItembtns" />
                        </button>
                        <button
                          type="button"
                          className="btn p-2 btn-outline-primary addBtn"
                          data-pr-position="right"
                          onClick={(e) => {
                            handleEditService(srv, true);
                          }}
                        >
                          <Tooltip target=".addBtn">اضافه به لیست</Tooltip>
                          <FeatherIcon icon="plus" className="prescItembtns" />
                        </button>
                      </div>

                      <div className="col-9 d-flex justify-end text-end">
                        <div className="d-flex  gap-2 font-13 align-items-center">
                          <div className="d-flex gap-2 font-13 align-items-center prescDetails">
                            <p>{srv.serviceInterfaceName}</p>
                          </div>

                          {srv.prescTypeImg ? (
                            <Image
                              src={srv.prescTypeImg}
                              alt="serviceIcon"
                              width="30"
                              height="30"
                            />
                          ) : (
                            ""
                          )}
                        </div>
                      </div>

                      <div className="col-1">
                        <button
                          className="accordion-button collapsed"
                          data-bs-toggle="collapse"
                          data-bs-target={`#collapse${index}`}
                          aria-expanded="false"
                          aria-controls={`collapse${index}`}
                        ></button>
                      </div>
                    </div>

                    <div
                      id={`collapse${index}`}
                      className="accordion-collapse collapse"
                      aria-labelledby={`heading${index}`}
                    >
                      <div className="accordion-body py-0 px-3 border-top">
                        <div className="row py-2">
                          <div className="d-flex mt-2 gap-2 flex-wrap justify-end">
                            <div className="d-flex gap-2">
                              <div className="srvTypeInfo dir-rtl">
                                {srv.numberOfRequest} عدد
                              </div>
                            </div>

                            {srv.consumption && (
                              <div className="d-flex gap-2">
                                <div className="srvTypeInfo">
                                  {srv.consumption}
                                </div>{" "}
                              </div>
                            )}

                            {srv.numberOfPeriod &&
                              !srv.consumptionInstruction && (
                                <div className="d-flex gap-2">
                                  <div className="srvTypeInfo">
                                    دستور مصرف / تعداد در وعده :{" "}
                                    {srv.numberOfPeriod}
                                  </div>
                                </div>
                              )}

                            {srv.consumptionInstruction && (
                              <div className="d-flex gap-2">
                                <div className="srvTypeInfo">
                                  دستور مصرف : {srv.consumptionInstruction}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </h2>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};
export default SalamatFavItemsModal;
