import { useState, useEffect } from "react";
import Image from "next/image";
import FeatherIcon from "feather-icons-react";
import { Modal } from "react-bootstrap";
import { Tooltip } from "primereact/tooltip";
import { Accordion, AccordionTab } from "primereact/accordion";
import FilterFavItems from "components/dashboard/prescription/filterFavItems";

const TaminFavItemsModal = ({
  show,
  onHide,
  data,
  handleEditService,
  removeFavItem,
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
      item.SrvName.toLowerCase().includes(favSearchInput.toLowerCase()) ||
      item.SrvCode.includes(favSearchInput)
  );

  useEffect(() => handleTabChange(1), []);

  return (
    <Modal show={show} onHide={onHide} centered size="xl">
      <Modal.Header closeButton>
        <Modal.Title>
          <p className="mb-0 text-secondary font-14 fw-bold">خدمات پرمصرف</p>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body dir="ltr" className="favModalBody">
        <ul className="nav nav-tabs nav-justified nav-tabs-bottom navTabBorder-b fw-bold">
          <li className="nav-item">
            <a
              className="nav-link"
              href="#bottom-tab3"
              data-bs-toggle="tab"
              onClick={() => handleTabChange(5)}
            >
              خدمات
            </a>
          </li>
          <li className="nav-item">
            <a
              className="nav-link"
              href="#bottom-tab2"
              data-bs-toggle="tab"
              onClick={() => handleTabChange(2)}
            >
              پاراکلینیک
            </a>
          </li>
          <li className="nav-item">
            <a
              className="nav-link active"
              href="#bottom-tab1"
              data-bs-toggle="tab"
              onClick={() => handleTabChange(1)}
            >
              دارو
            </a>
          </li>
        </ul>

        <div className="tab-content tabContentHeight p-0">
          <div className="tab-pane show active">
            <FilterFavItems
              favSearchInput={favSearchInput}
              setFavSearchInput={setFavSearchInput}
            />

            <div className="accordion mt-4">
              {searchedFavItems?.map((srv, index) => (
                <div className="accordion-item" key={index}>
                  <h2 className="accordion-header" id={`heading${index}`}>
                    <div className="row w-100">
                      <div className="col-2 d-flex gap-1 justify-center align-items-center">
                        <button
                          type="button"
                          className="btn p-2 btn-outline-danger removeBtn"
                          data-pr-position="left"
                          onClick={() => removeFavItem(srv.SrvCode)}
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
                            <p className="mb-0">{srv.SrvCode}</p>
                            <p className="mb-0">|</p>
                            <p>{srv.SrvName}</p>
                          </div>

                          {srv.Img ? (
                            <Image
                              src={srv.Img}
                              alt="serviceIcon"
                              width="25"
                              height="25"
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
                  </h2>

                  <div
                    id={`collapse${index}`}
                    className="accordion-collapse collapse"
                    aria-labelledby={`heading${index}`}
                  >
                    <div className="accordion-body py-0 px-3 border-top">
                      <div className="row py-2">
                        <div className="d-flex mt-2 gap-2 flex-wrap justify-end">
                          <div className="d-flex gap-2 ">
                            <div className="srvTypeInfo">
                              نوع نسخه : {srv.PrescType}
                            </div>
                            <div className="srvTypeInfo">تعداد : {srv.Qty}</div>
                          </div>

                          {srv.TimesADay ? (
                            <div className="d-flex gap-2">
                              <div className="srvTypeInfo">
                                تعداد مصرف در روز : {srv.TimesADay}
                              </div>
                              <div className="srvTypeInfo">
                                دستور مصرف : {srv.DrugInstruction}
                              </div>
                            </div>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default TaminFavItemsModal;
