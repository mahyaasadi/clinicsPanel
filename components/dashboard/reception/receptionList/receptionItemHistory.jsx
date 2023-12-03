import { Modal } from "react-bootstrap";
import { Accordion, AccordionTab } from "primereact/accordion";

const calculateDiscount = (srvItem, totalPatientCost) => {
  if (srvItem.Discount?.Percent) {
    return (totalPatientCost * parseInt(srvItem.Discount?.Value)) / 100;
  } else if (srvItem.Discount?.Percent === false) {
    return srvItem.Qty * parseInt(srvItem.Discount?.Value);
  }
  return 0;
};
const ReceptionItemHistoryModal = ({ srv, show, onHide }) => {
  console.log({ srv });
  const renderEditHistory = (historyArray) => {
    return (
      <div>
        <ul className="p-1">
          {historyArray?.EditHistory?.map((historyItem, index) => (
            <li key={index}>
              <div className="text-secondary font-12">
                <div className="">
                  <p className="mb-1">
                    تاریخ ویرایش :
                    {historyItem.EditDate
                      ? historyArray.EditDate
                      : historyArray.Date}
                  </p>
                  <p className="">
                    ساعت ویرایش :    {historyItem.EditTime
                      ? historyArray.EditTime
                      : historyArray.Time}
                  </p>
                </div>

                <Accordion multiple className="mt-3">
                  {historyItem?.Items.map((item, index) => {
                    let RowPatientCost = item.Price - item.OC;
                    return (
                      <AccordionTab
                        key={index}
                        header={
                          <div className="d-flex">
                            <div className="d-flex col-9 gap-3 font-13 align-items-center">
                              <div className="d-flex gap-2 font-13 align-items-center prescDetails">
                                <p className="mb-0">{item.Code}</p>
                                <p className="mb-0">|</p>
                                <p>{item.Name}</p>
                              </div>
                            </div>
                          </div>
                        }
                      >
                        <div className="row">
                          <div className="d-flex col-12 gap-3 font-12 align-items-center mb-2">
                            <div className="d-flex flex-wrap media-flex-col gap-2 align-items-center prescDetails">
                              <p className="mb-0">{item.Qty} عدد,</p>
                              <p className="mb-0">
                                قیمت واحد :{" "}
                                {parseInt(item.Price).toLocaleString()} ریال,
                              </p>

                              <p className="mb-0">
                                قیمت کل :{" "}
                                {(
                                  item.Qty * parseInt(item.Price)
                                ).toLocaleString()}{" "}
                                ریال,
                              </p>

                              <p className="mb-0">
                                سهم سازمان :{" "}
                                {parseInt(item.OC).toLocaleString()} ریال,
                              </p>

                              <p className="mb-0">
                                سهم تخفیف :{" "}
                                {calculateDiscount(
                                  item,
                                  RowPatientCost
                                ).toLocaleString()}{" "}
                                ریال
                              </p>
                            </div>
                          </div>

                          {item.Des ? (
                            <>
                              <hr />
                              <div className="font-12">
                                توضیحات : {item.Des}
                              </div>
                            </>
                          ) : (
                            ""
                          )}
                        </div>
                      </AccordionTab>
                    );
                  })}
                </Accordion>
              </div>

              <hr />

              {/* Check if there is a nested EditHistory array */}
              {historyItem && renderEditHistory(historyItem)}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <>
      <Modal show={show} onHide={onHide} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <p className="mb-0 text-secondary font-14 fw-bold">تاریخچه پذیرش {srv.ReceptionID}</p>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="recHistoryModal">
          <div dir="rtl"
          >
            <p className="text-secondary font-13">حالت اولیه</p>
            <Accordion multiple>
              {srv?.Items.map((item, index) => {
                let RowPatientCost = item.Price - item.OC;
                return (
                  <AccordionTab
                    key={index}
                    header={
                      <div className="d-flex">
                        <div className="d-flex col-9 gap-3 font-13 align-items-center">
                          <div className="d-flex gap-2 font-13 align-items-center prescDetails">
                            <p className="mb-0">{item.Code}</p>
                            <p className="mb-0">|</p>
                            <p>{item.Name}</p>
                          </div>
                        </div>
                      </div>
                    }
                  >
                    <div className="row">
                      <div className="d-flex col-12 gap-3 font-12 align-items-center mb-2">
                        <div className="d-flex flex-wrap media-flex-col gap-2 align-items-center prescDetails">
                          <p className="mb-0">{item.Qty} عدد,</p>
                          <p className="mb-0">
                            قیمت واحد : {parseInt(item.Price).toLocaleString()}{" "}
                            ریال,
                          </p>

                          <p className="mb-0">
                            قیمت کل :{" "}
                            {(item.Qty * parseInt(item.Price)).toLocaleString()}{" "}
                            ریال,
                          </p>

                          <p className="mb-0">
                            سهم سازمان : {parseInt(item.OC).toLocaleString()}{" "}
                            ریال,
                          </p>

                          <p className="mb-0">
                            سهم تخفیف :{" "}
                            {calculateDiscount(
                              item,
                              RowPatientCost
                            ).toLocaleString()}{" "}
                            ریال
                          </p>
                        </div>
                      </div>

                      {item.Des ? (
                        <>
                          <hr />
                          <div className="font-12">توضیحات : {item.Des}</div>
                        </>
                      ) : (
                        ""
                      )}
                    </div>
                  </AccordionTab>
                );
              })}
            </Accordion>

            <hr />

            {renderEditHistory(srv || [])}
          </div>

        </Modal.Body>
      </Modal>
    </>
  );
};

export default ReceptionItemHistoryModal;

