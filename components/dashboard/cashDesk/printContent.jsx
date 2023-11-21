import { useState, useEffect } from "react";
import React from "react";
import { axiosClient } from "class/axiosConfig";
import Image from "next/image";
import { Modal } from "react-bootstrap";
import FeatherIcon from "feather-icons-react";

const PrintContent = ({
  ClinicID,
  data,
  paymentData,
  calculatedTotalPC,
  calculateDiscount,
  show,
  onHide,
}) => {
  console.log({ data });
  const [fullscreen, setFullscreen] = useState(true);
  const [clinicData, setClinicData] = useState([]);

  let PatientCost =
    parseInt(data?.CashDesk?.CartPayment) +
    parseInt(data?.CashDesk?.CashPayment);

  const getClinicById = () => {
    let url = `Clinic/getOne/${ClinicID}`;

    axiosClient
      .get(url)
      .then((response) => {
        console.log(response.data);
        setClinicData(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handlePrint = () => {
    window.print();
  };

  useEffect(() => getClinicById(), []);

  const printContents = [];

  for (let i = 0; i < clinicData?.PrintSetting?.NumberOfCopy; i++) {
    printContents.push(
      <div className="">
        {/* <hr className={`${i == 0 ? "mt-0" : "margint-3"} mb-2`} /> */}
        <div
          dir="rtl"
          key={i}
          className={`${i == 0 ? "" : "margint-3"} printContent`}
        >
          <div className="d-flex reciptPrintHeader gap-2 justify-center">
            <div className="col-2 d-flex justify-center align-items-center reciptLogoContainer">
              <Image
                src={clinicData?.Logo}
                alt="clinicLogo"
                width="50"
                height="50"
              />
            </div>
            <div className="col-8 d-flex fw-bold font-11 justify-center align-items-center reciptLogoContainer reciptHeaderContainer">
              {clinicData?.PrintSetting?.Header}
            </div>
            <div className="col-2 barcode reciptLogoContainer"></div>
          </div>

          <div className="d-flex reciptPrintHeader reciptLogoContainer col-12 mt-2 font-11">
            <div className="col-4">
              <p className="mb-1">کد پذیرش : {data.ReceptionID}</p>
              <p className="mb-1">نام بیمار : {data?.Patient?.Name}</p>
              <p className="">کد ملی : {data.Patient?.NationalID}</p>
            </div>

            <div className="col-4 d-flex justify-center">
              <div className="">
                <p className="mb-1">بخش : {data?.Modality?.Name}</p>
                <p className="mb-1">تاریخ ثبت: {data?.Date}</p>
                <p className="">ساعت ثبت: {data?.Time}</p>
              </div>
            </div>

            <div className="col-4 d-flex justify-end">
              <div className="">
                <p className="mb-1">
                  پرداختی بیمار : {PatientCost.toLocaleString()} ریال
                </p>
                <p className="mb-1">
                  مبلغ بدهی : {parseInt(data?.CashDesk?.Debt).toLocaleString()}{" "}
                  ریال
                </p>
                <p className="">
                  مبلغ بستانکار :{" "}
                  {parseInt(data?.CashDesk?.ReturnPayment).toLocaleString()}{" "}
                  ریال
                </p>
              </div>
            </div>
          </div>

          <div className="table-responsive actionTable">
            <table className="table mt-4 font-10 text-secondary">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">کد خدمت</th>
                  <th scope="col">نام خدمت</th>
                  <th scope="col">تعداد</th>
                  <th scope="col">مبلغ کل</th>
                  <th scope="col">سهم بیمار</th>
                  <th scope="col">سهم سازمان</th>
                  <th scope="col">تخفیف</th>
                </tr>
              </thead>

              <tbody className="font-10 text-secondary">
                {data?.Items?.map((item, index) => {
                  let RowTotalCost = item.Price * item.Qty;
                  let RowOrgCost = item.Qty * item.OC;
                  let RowPatientCost = RowTotalCost - RowOrgCost;
                  let RowTotalDiscount = calculateDiscount(
                    item,
                    RowPatientCost
                  );

                  if (RowTotalDiscount) RowPatientCost -= RowTotalDiscount;

                  return (
                    <tr key={index}>
                      <th scope="row">{index + 1}</th>
                      <td>{item.Code}</td>
                      <td>{item.Name}</td>
                      <td>{item.Qty}</td>
                      <td>{RowTotalCost.toLocaleString()}</td>
                      <td>{RowPatientCost.toLocaleString()}</td>
                      <td>{RowOrgCost.toLocaleString()}</td>
                      <td>{RowTotalDiscount.toLocaleString()}</td>
                    </tr>
                  );
                })}

                {data?.Calculated
                  ? ((calculatedTotalPC = data?.Calculated?.TotalPC),
                    (
                      <>
                        <tr>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td>
                            {data?.Calculated?.TotalQty?.toLocaleString()}
                          </td>
                          <td>
                            {data?.Calculated?.TotalPrice?.toLocaleString()}
                          </td>
                          <td>{data?.Calculated?.TotalPC?.toLocaleString()}</td>
                          <td>{data?.Calculated?.TotalOC?.toLocaleString()}</td>
                          <td>
                            {data?.Calculated?.TotalDiscount?.toLocaleString()}
                          </td>
                        </tr>
                      </>
                    ))
                  : ""}
              </tbody>
            </table>
          </div>

          <div className="answerContainer reciptLogoContainer mt-1">
            <p className="">{clinicData?.PrintSetting?.AnsText}</p>
          </div>
          <div className="reciptDesContainer reciptLogoContainer mt-1">
            <p className="">{clinicData?.PrintSetting?.Description}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Modal
        show={show}
        onHide={onHide}
        centered
        className="printSection"
        fullscreen={fullscreen}
      >
        <Modal.Header closeButton>
          <div className="d-flex align-items-center col-lg-4">
            <div className="printBtn">
              <button
                type="button"
                className="btn btn-primary rounded font-13 d-flex align-items-center gap-2 justify-center"
                onClick={handlePrint}
              >
                <FeatherIcon icon="printer" />
                پرینت
              </button>
            </div>
          </div>
        </Modal.Header>

        <Modal.Body dir="ltr">
          <div className="printContent">
            {printContents.map((content, index) => (
              <React.Fragment key={index}>
                {index === printContents.length - 1 ? (
                  <div className="lastPrintContent">{content}</div>
                ) : (
                  <div className="printContent">{content}</div>
                )}
              </React.Fragment>
            ))}
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default PrintContent;
