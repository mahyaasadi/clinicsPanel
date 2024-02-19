import { useState, useEffect } from "react";
import Image from "next/image";
import FeatherIcon from "feather-icons-react";
import { Modal } from "react-bootstrap";
import { Tooltip } from "primereact/tooltip";
import { Accordion, AccordionTab } from "primereact/accordion";

const TaminFavItemsModal = ({
  show,
  onHide,
  data,
  handleEditService,
  removeFavItem,
}) => {
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

  useEffect(() => {
    handleTabChange(1);
  }, []);

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
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
            <Accordion dir="rtl" multiple className="mt-4">
              {filteredData()?.map((srv, index) => (
                <AccordionTab
                  key={index}
                  header={
                    <div className="d-flex">
                      <div className="d-flex col-9 gap-2 font-13 align-items-center">
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

                        <div className="d-flex gap-2 font-13 align-items-center prescDetails">
                          <p className="mb-0">{srv.SrvCode}</p>
                          <p className="mb-0">|</p>
                          <p>{srv.SrvName}</p>
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
                          onClick={() => removeFavItem(srv.SrvCode)}
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
                </AccordionTab>
              ))}
            </Accordion>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default TaminFavItemsModal;
