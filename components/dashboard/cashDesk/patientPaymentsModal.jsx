import { useState } from "react";
import { axiosClient } from "class/axiosConfig";
import { Modal } from "react-bootstrap";
import FeatherIcon from "feather-icons-react";
import { Tooltip } from "primereact/tooltip";
// import { convertToLocaleString } from "utils/convertToLocaleString";

const PatientPaymentsModal = ({ show, onHide, data }) => {
  const [editPaymentModes1, setEditPaymentModes1] = useState(
    data?.Payments?.map(() => false) ?? []
  );
  const [editPaymentModes2, setEditPaymentModes2] = useState(
    data?.Payments?.map(() => false) ?? []
  );

  const [inputValues, setInputValues] = useState(
    data?.Payments?.map((x) => x.Price) || []
  );

  const [inputValues2, setInputValues2] = useState(
    data?.Payments?.map((x) => x.Price) || []
  );

  const handleInputChange2 = (index, value) => {
    const newValues = [...inputValues2];
    newValues[index] = value;
    setInputValues2(newValues);
  };

  const handleInputChange = (index, value) => {
    const newValues = [...inputValues];
    newValues[index] = value;
    setInputValues(newValues);
  };

  const submitPaymentChanges = (e) => {
    e.preventDefault();

    let formData = new FormData(e.target);
    const formProps = Object.fromEntries(formData);

    console.log({ formProps });

    // inputValues.forEach((value, index) => {
    //   console.log(`Value for patientPayment-${index}: ${value}`);
    // });
  };

  const handleEditClick1 = (index) => {
    const newEditModes = [...editPaymentModes1];
    newEditModes[index] = !newEditModes[index];
    setEditPaymentModes1(newEditModes);
  };

  const handleCancelClick1 = (index) => {
    const newEditModes = [...editPaymentModes1];
    newEditModes[index] = false;
    setEditPaymentModes1(newEditModes);
  };

  const handleEditClick2 = (index) => {
    const newEditModes = [...editPaymentModes2];
    newEditModes[index] = !newEditModes[index];
    setEditPaymentModes2(newEditModes);
  };

  const handleCancelClick2 = (index) => {
    const newEditModes = [...editPaymentModes2];
    newEditModes[index] = false;
    setEditPaymentModes2(newEditModes);
  };

  const handleCloseModal = () => {
    setEditPaymentModes1(data?.Payments?.map(() => false) ?? []);
    setEditPaymentModes2(data?.Payments?.map(() => false) ?? []);
    onHide();
  };

  return (
    <Modal show={show} onHide={handleCloseModal} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          <p className="mb-0 text-secondary font-14 fw-bold">
            سوابق پرداختی بیمار
          </p>
          <p className="text-secondary font-13 ">
            {data?.Patient?.Name} | کد پذیرش {data.ReceptionID}
          </p>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="paymentModalBody">
        <div className="table-responsive p-2">
          <table className="table mt-4 font-13 text-secondary table-bordered shadow-sm">
            <thead>
              <tr>
                <th scope="col">تاریخ</th>
                <th scope="col">شرح پرداخت</th>
                <th scope="col">بدهکار</th>
                <th scope="col">بستانکار</th>
              </tr>
            </thead>

            <tbody className="font-13 text-secondary">
              <tr>
                <td>
                  <p className="mb-1">{data.Date}</p>
                  <p>{data.Time}</p>
                </td>
                <th scope="row">سهم پرداختی بیمار</th>
                <td>{data?.Calculated?.TotalPC.toLocaleString() + " تومان"}</td>
                <td>0</td>
              </tr>

              {data?.Payments?.map((x, index) => (
                <tr key={index}>
                  <td>
                    <p className="mb-1">{x.Date}</p>
                    <p>{x.Time}</p>
                  </td>
                  <td>
                    {x.Cart
                      ? "پرداخت با کارت"
                      : x.Return
                      ? "دریافت وجه"
                      : "پرداخت نقدی"}
                  </td>

                  <td style={{ position: "relative" }}>
                    {editPaymentModes1 && editPaymentModes1[index] ? (
                      <form onSubmit={submitPaymentChanges}>
                        <input
                          dir="ltr"
                          className="form-control floating inputPadding text-center rounded text-secondary mt-3"
                          defaultValue={x.Price}
                          name={`patientPayment-${index}`}
                          // value={inputValues2[index]}
                          // onChange={(e) =>
                          //   handleInputChange2(index, e.target.value)
                          // }
                        />

                        <div
                          className="d-flex gap-1"
                          style={{
                            position: "absolute",
                            top: "4px",
                            left: "32px",
                          }}
                        >
                          {editPaymentModes1[index] && (
                            <>
                              <button className="btn btn-outline-primary p-1 btn-bg-white d-flex justify-content-center align-items-center">
                                <FeatherIcon
                                  icon="check"
                                  style={{ width: "13px", height: "13px" }}
                                  className="submitEditPayment"
                                  data-pr-position="right"
                                />
                                <Tooltip target=".submitEditPayment">
                                  ثبت
                                </Tooltip>
                              </button>
                              <button
                                className="btn btn-outline-primary p-1 btn-bg-white d-flex justify-content-center align-items-center"
                                onClick={() => handleCancelClick1(index)}
                              >
                                <FeatherIcon
                                  icon="x"
                                  style={{ width: "13px", height: "13px" }}
                                  className="cancelEditPayment"
                                  data-pr-position="top"
                                />
                                <Tooltip target=".cancelEditPayment">
                                  انصراف
                                </Tooltip>
                              </button>
                            </>
                          )}
                        </div>
                      </form>
                    ) : (
                      <p>
                        {x.Return ? x.Price.toLocaleString() + " تومان" : ""}
                      </p>
                    )}

                    {x.Return && x.Price && (
                      <button
                        style={{
                          position: "absolute",
                          top: "4px",
                          left: "6px",
                        }}
                        className="btn btn-outline-primary p-1 btn-bg-white d-flex justify-content-center align-items-center"
                        onClick={() => handleEditClick1(index)}
                      >
                        <FeatherIcon
                          icon="edit-3"
                          style={{ width: "13px", height: "13px" }}
                          className="editPayment"
                          data-pr-position="left"
                        />
                        <Tooltip target=".editPayment">ویرایش</Tooltip>
                      </button>
                    )}
                  </td>

                  <td style={{ position: "relative" }}>
                    {editPaymentModes2 && editPaymentModes2[index] ? (
                      <form onSubmit={submitPaymentChanges}>
                        <input
                          dir="ltr"
                          className="form-control floating inputPadding text-center rounded text-secondary mt-3"
                          defaultValue={x.Price}
                          name={`patientReturnPayment-${index}`}
                        />

                        <div
                          className="d-flex gap-1"
                          style={{
                            position: "absolute",
                            top: "4px",
                            left: "32px",
                          }}
                        >
                          {editPaymentModes2[index] && (
                            <>
                              <button
                                type="submit"
                                className="btn btn-outline-primary p-1 btn-bg-white d-flex justify-content-center align-items-center"
                              >
                                <FeatherIcon
                                  icon="check"
                                  style={{ width: "13px", height: "13px" }}
                                  className="submitEditPayment"
                                  data-pr-position="right"
                                />
                                <Tooltip target=".submitEditPayment">
                                  ثبت
                                </Tooltip>
                              </button>
                              <button
                                className="btn btn-outline-primary p-1 btn-bg-white d-flex justify-content-center align-items-center"
                                onClick={() => handleCancelClick2(index)}
                              >
                                <FeatherIcon
                                  icon="x"
                                  style={{ width: "13px", height: "13px" }}
                                  className="cancelEditPayment"
                                  data-pr-position="top"
                                />
                                <Tooltip target=".cancelEditPayment">
                                  انصراف
                                </Tooltip>
                              </button>
                            </>
                          )}
                        </div>
                      </form>
                    ) : (
                      <p>
                        {!x.Return ? x.Price.toLocaleString() + " تومان" : ""}
                      </p>
                    )}

                    {!x.Return && x.Price && (
                      <button
                        style={{
                          position: "absolute",
                          top: "4px",
                          left: "6px",
                        }}
                        className="btn btn-outline-primary p-1 btn-bg-white d-flex justify-content-center align-items-center"
                        onClick={() => handleEditClick2(index)}
                      >
                        <FeatherIcon
                          icon="edit-3"
                          style={{ width: "13px", height: "13px" }}
                          className="editPayment"
                          data-pr-position="left"
                        />
                        <Tooltip target=".editPayment">ویرایش</Tooltip>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default PatientPaymentsModal;
