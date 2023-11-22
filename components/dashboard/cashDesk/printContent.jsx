import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { Modal } from "react-bootstrap";
import { axiosClient } from "class/axiosConfig";
import { toJpeg, toPng } from "html-to-image";
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
  const [fullscreen, setFullscreen] = useState(true);
  const [clinicData, setClinicData] = useState([]);

  const AnsLines = clinicData?.PrintSetting?.AnsText?.split("\n");
  const DesLines = clinicData?.PrintSetting?.Description?.split("\n");

  let PatientCost =
    parseInt(paymentData?.CartPayment) + parseInt(paymentData?.CashPayment);

  const getClinicById = () => {
    let url = `Clinic/getOne/${ClinicID}`;

    axiosClient
      .get(url)
      .then((response) => {
        console.log(response.data);
        setClinicData(response.data);
      })
      .catch((err) => console.log(err));
  };

  const handlePrint = () => {
    // let printNode = document.getElementById("printContent");
    // if (printNode)
    //   toPng(printNode).then((dataUrl) => {
    //     $("#printImg").attr("src", dataUrl);

    //     $("#printImg").show();

    //     $("#printContent").hide();
    //   });

    window.print();

    // const content = document.getElementById("printContent");
    // const iframe = document.getElementById("ifmcontentstoprint");

    // if (content && iframe) {
    //   const pri = iframe.contentWindow;

    // // setTimeout(() => {
    // const cssLink = document.createElement("link");
    // cssLink.href = "/assets/css/style.css";
    // cssLink.rel = "stylesheet";
    // cssLink.type = "text/css";

    // const cssLink2 = document.createElement("link");
    // cssLink2.href = "/assets/css/bootstrap.css";
    // cssLink2.rel = "stylesheet";
    // cssLink2.type = "text/css";

    // pri.document.open();
    // pri.document.write(content.innerHTML);
    // pri.document.write("<style>body { background-color: #f0f0f0; }</style>");
    // pri.document.body.appendChild(cssLink2);
    // pri.document.body.appendChild(cssLink);

    // pri.document.close();
    // pri.focus();
    // pri.print();
    // }, 3000);
    // }
  };

  // const handlePrint = () => {
  //   const content = document.getElementById("printContent");
  //   const iframe = document.getElementById("ifmcontentstoprint");

  //   if (content && iframe) {
  //     const pri = iframe.contentWindow;

  //     const cssLink = document.createElement("link");
  //     cssLink.href = "/assets/css/style.css";
  //     cssLink.rel = "stylesheet";
  //     cssLink.type = "text/css";

  //     const cssLink2 = document.createElement("link");
  //     cssLink2.href = "/assets/css/bootstrap.css";
  //     cssLink2.rel = "stylesheet";
  //     cssLink2.type = "text/css";

  //     console.log("click");
  //     cssLink2.onload = () => {
  //       console.log("click onLoad");

  //       // Bootstrap stylesheet has loaded
  //       pri.document.body.appendChild(cssLink2);

  //       cssLink.onload = () => {
  //         // Your stylesheet has loaded
  //         pri.document.body.appendChild(cssLink);

  //         // Now add the HTML content to the iframe
  //         pri.document.write(content.innerHTML);
  //         pri.document.close();

  //         // Focus and print
  //         pri.focus();
  //         pri.print();
  //       };

  //       // Append the stylesheets
  //       cssLink2.onerror = () => {
  //         console.error("Error loading bootstrap stylesheet");
  //       };
  //       cssLink.href = "/assets/css/style.css";
  //     };

  //     // Append the iframe to the DOM (make sure it's in the DOM before trying to load styles)
  //     document.body.appendChild(iframe);

  //     // Start loading the Bootstrap stylesheet
  //     cssLink2.href = "/assets/css/bootstrap.css";
  //   }
  // };

  useEffect(() => getClinicById(), []);

  const printContents = [];
  // for (let i = 0; i < clinicData?.PrintSetting?.NumberOfCopy; i++) {
  printContents.push(
    <div className="">
      {/* <div className={`${i == 0 ? "" : "dottedBorder"} `}></div> */}
      <div dir="rtl" className={` printContent page-break`}>
        <div className="d-flex flex-col reciptPrintHeader reciptLogoContainer col-12 mt-2 font-11">
          <div className="row">
            <div className="col-12 d-flex fw-bold font-12 justify-center align-items-center mb-2 reciptHeaderContainer">
              {clinicData?.PrintSetting?.Header}
            </div>
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
                  پرداختی بیمار :{" "}
                  {PatientCost ? PatientCost.toLocaleString() : 0} ریال
                </p>
                <p className="mb-1">
                  مبلغ بدهی :{" "}
                  {paymentData?.Debt
                    ? parseInt(paymentData?.Debt).toLocaleString()
                    : 0}{" "}
                  ریال
                </p>
                <p className="">
                  مبلغ بستانکار :{" "}
                  {paymentData?.ReturnPayment
                    ? parseInt(paymentData?.ReturnPayment).toLocaleString()
                    : 0}{" "}
                  ریال
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="table-responsive actionTable">
          <table className="table mt-4 font-10">
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

            <tbody className="font-10">
              {data?.Items?.map((item, index) => {
                let RowTotalCost = item.Price * item.Qty;
                let RowOrgCost = item.Qty * item.OC;
                let RowPatientCost = RowTotalCost - RowOrgCost;
                let RowTotalDiscount = calculateDiscount(item, RowPatientCost);

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
                        <td>{data?.Calculated?.TotalQty?.toLocaleString()}</td>
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

        {clinicData?.PrintSetting?.AnsText ? (
          <div className="answerContainer reciptLogoContainer mt-1">
            {AnsLines?.map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </div>
        ) : (
          ""
        )}

        {clinicData?.PrintSetting?.Description ? (
          <div className="reciptDesContainer reciptLogoContainer mt-1">
            {DesLines?.map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
  // }

  return (
    <>
      <Modal
        show={show}
        onHide={onHide}
        centered
        className="printSection"
        fullscreen={fullscreen}
      >
        <Modal.Header closeButton className="modalHeader">
          <div className="col-lg-4">
            <div className="printBtn">
              <button
                type="button"
                className="btn btn-outline-primary d-flex justify-center"
                onClick={() => handlePrint()}
              >
                <FeatherIcon icon="printer" />
              </button>
            </div>
          </div>
        </Modal.Header>

        <Modal.Body dir="ltr">
          {/* <img
            id="printImg"
            style={{ display: "none", height: "1000px", width: "706px" }}
          /> */}

          {/* <iframe
            style={
              {
                height: "0px",
                width: "0px",
                position: "absolute",
              }
            }
            id="ifmcontentstoprint"
          ></iframe> */}

          <div className="printContent" id="printContent">
            {printContents.map((content, index) => (
              <React.Fragment key={index}>
                <div className="printContent">{content}</div>
              </React.Fragment>
            ))}
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default PrintContent;
