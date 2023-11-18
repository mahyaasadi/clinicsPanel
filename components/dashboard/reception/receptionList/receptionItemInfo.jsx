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

const ReceptionItemInfoModal = ({ srv, show, onHide }) => {
  //   console.log({ srv });
  return (
    <>
      <Modal show={show} onHide={onHide} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <p className="mb-0 text-secondary font-14 fw-bold">شرح پذیرش</p>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="card">
            <div className="card-body text-secondary">
              <div className="">
                <p className="fw-bold">سرویس ها : </p>

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
                          <div className="d-flex col-9 gap-3 font-12 align-items-center">
                            <div className="d-flex gap-2 align-items-center prescDetails">
                              <p className="mb-0">{item.Qty} عدد,</p>
                              <p className="mb-0">
                                مبلغ : {item.Price.toLocaleString()} تومان,
                              </p>
                              <p className="mb-0">
                                سهم سازمان : {item.OC.toLocaleString()} تومان,
                              </p>

                              <p className="mb-0">
                                سهم تخفیف :{" "}
                                {calculateDiscount(
                                  item,
                                  RowPatientCost
                                ).toLocaleString()}{" "}
                                تومان
                              </p>
                            </div>
                          </div>
                        </div>
                      </AccordionTab>
                    );
                  })}
                </Accordion>
              </div>

              <hr />
              <div className="d-flex flex-col gap-2 mt-3">
                <div className="d-flex align-items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-16 marginR-1"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 6.878V6a2.25 2.25 0 012.25-2.25h7.5A2.25 2.25 0 0118 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 004.5 9v.878m13.5-3A2.25 2.25 0 0119.5 9v.878m0 0a2.246 2.246 0 00-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0121 12v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6c0-.98.626-1.813 1.5-2.122"
                    />
                  </svg>
                  <p>تعداد کل : {srv?.Calculated?.TotalQty}</p>
                </div>

                <div className="d-flex align-items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-16 marginR-1"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
                    />
                  </svg>
                  <p>
                    پرداختی کل : {srv?.Calculated?.TotalPrice?.toLocaleString()}{" "}
                    تومان
                  </p>
                </div>

                <div className="d-flex align-items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-16 marginR-1"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21"
                    />
                  </svg>
                  <p>
                    سهم سازمان : {srv?.Calculated?.TotalOC?.toLocaleString()}{" "}
                    تومان
                  </p>
                </div>

                <div className="d-flex align-items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-16 marginR-1"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                    />
                  </svg>
                  <p>
                    سهم بیمار : {srv?.Calculated?.TotalPC?.toLocaleString()}{" "}
                    تومان
                  </p>
                </div>

                <div className="d-flex align-items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-16 marginR-1"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"
                    />
                  </svg>
                  <p>
                    سهم تخفیف :{" "}
                    {srv?.Calculated?.TotalDiscount
                      ? srv?.Calculated?.TotalDiscount.toLocaleString()
                      : 0}{" "}
                    تومان
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ReceptionItemInfoModal;

