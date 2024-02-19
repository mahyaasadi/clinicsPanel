import { useState, useEffect } from "react";
import Image from "next/image";
import FeatherIcon from "feather-icons-react";
import { Modal } from "react-bootstrap";
import { Tooltip } from "primereact/tooltip";
import { Accordion, AccordionTab } from "primereact/accordion";

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
  const filteredData = () => {
    return data.filter((item) => item.typeId === selectedTab);
  };
  console.log({ data, filteredData });

  useEffect(() => handleTabChange(1), []);

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
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
          {salamatHeaderList.map((item, index) => (
            <li className="nav-item" key={index}>
              <a
                className={`nav-link ${index === 0 ? "active" : item.Active} ${
                  index === 1 || index === 3 || index === 6 || index === 7
                    ? "w-170"
                    : ""
                }`}
                href={`#bottom-tab${index + 1}`}
                data-bs-toggle="tab"
                onClick={() => handleTabChange(item.id)}
              >
                {item.name}
              </a>
            </li>
          ))}
        </ul>

        <div className="tab-content tabContentHeight p-0 mt-4">
          <div className="tab-pane show active">
            <Accordion dir="rtl" multiple className="mt-4">
              {filteredData()?.map((srv, index) => (
                <AccordionTab
                  key={index}
                  header={
                    <div className="d-flex">
                      <div className="d-flex col-9 gap-2 font-13 align-items-center">
                        {srv.prescTypeImg ? (
                          <Image
                            src={srv.prescTypeImg}
                            alt="serviceIcon"
                            width="25"
                            height="25"
                          />
                        ) : (
                          ""
                        )}

                        <div className="d-flex gap-2 font-13 align-items-center prescDetails">
                          <p>{srv.serviceInterfaceName}</p>
                        </div>
                      </div>

                      <div className="d-flex col-3 gap-1 justify-end">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary addBtn"
                          onClick={() => handleEditService(srv, true)}
                          data-pr-position="right"
                        >
                          <Tooltip target=".addBtn">اضافه به لیست</Tooltip>
                          <FeatherIcon icon="plus" className="prescItembtns" />
                        </button>

                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger removeBtn"
                          onClick={() =>
                            removeFavItem(srv.serviceNationalNumber)
                          }
                          data-pr-position="left"
                        >
                          <Tooltip target=".removeBtn">حذف</Tooltip>
                          <FeatherIcon icon="trash" className="prescItembtns" />
                        </button>
                      </div>
                    </div>
                  }
                >
                  <div className="row">
                    <div className="d-flex mt-2 gap-2 flex-wrap">
                      <div className="d-flex gap-2 ">
                        <div className="srvTypeInfo">
                          {srv.numberOfRequest} عدد
                        </div>
                      </div>

                      {srv.consumption && (
                        <div className="d-flex gap-2">
                          <div className="srvTypeInfo">{srv.consumption}</div>{" "}
                        </div>
                      )}

                      {/* {srv.numberOfPeriod ||
                        (srv.consumptionInstruction && (
                          <div className="d-flex gap-2">
                            <div className="srvTypeInfo">
                              دستور مصرف :{" "}
                              {srv.consumptionInstruction
                                ? srv.consumptionInstruction
                                : srv.numberOfPeriod}
                            </div>
                          </div>
                        ))} */}
                    </div>
                  </div>
                </AccordionTab>
              ))}
            </Accordion>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default SalamatFavItemsModal;
