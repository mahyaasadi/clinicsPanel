import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { axiosClient } from "class/axiosConfig";
import FeatherIcon from "feather-icons-react";
import MainRecipt from "components/dashboard/cashDesk/recipt/mainRecipt";
import ArchiveRecipt from "components/dashboard/cashDesk/recipt/archiveRecipt";
import ServicesRecipt from "components/dashboard/cashDesk/recipt/servicesRecipt";

const PrintContent = ({
  ClinicID,
  data,
  paymentData,
  calculatedTotalPC,
  calculateDiscount,
  show,
  onHide,
}) => {
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
        setClinicData(response.data);
      })
      .catch((err) => console.log(err));
  };

  const handlePrint = () => window.print();

  useEffect(() => getClinicById(), []);

  return (
    <>
      <Modal
        show={show}
        onHide={onHide}
        centered
        className="printSection"
        fullscreen={true}
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

        <Modal.Body dir="ltr" className="p-2">
          <MainRecipt
            data={data}
            clinicData={clinicData}
            AnsLines={AnsLines}
            DesLines={DesLines}
            PatientCost={PatientCost}
            paymentData={paymentData}
            calculatedTotalPC={calculatedTotalPC}
            calculateDiscount={calculateDiscount}
          />

          <div className="row justify-between mt-2">
            <div className="col-6">
              <ServicesRecipt
                data={data}
                clinicData={clinicData}
                paymentData={paymentData}
              />
            </div>
            <div className="col-5">
              <ArchiveRecipt
                data={data}
                clinicData={clinicData}
                calculateDiscount={calculateDiscount}
                paymentData={paymentData}
              />
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default PrintContent;

// let printNode = document.getElementById("printContent");
// if (printNode)
//   toPng(printNode).then((dataUrl) => {
//     $("#printImg").attr("src", dataUrl);

//     $("#printImg").show();

//     $("#printContent").hide();
//   });

{
  /* <img
            id="printImg"
            style={{ display: "none", height: "1000px", width: "706px" }}
          /> */
}

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

{
  /* <iframe
            style={
              {
                height: "0px",
                width: "0px",
                position: "absolute",
              }
            }
            id="ifmcontentstoprint"
          ></iframe> */
}

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

// const printContents = [];
// for (let i = 0; i < clinicData?.PrintSetting?.NumberOfCopy; i++) {
// printContents.push(
// <div >
{
  /* <div className={`${i == 0 ? "" : "dottedBorder"} `}></div> */
}

{
  /* </div> */
}
// );
// }

{
  /* <div className="printContent" id="printContent">
            {printContents.map((content, index) => (
              <React.Fragment key={index}>
                <div className="printContent">{content}</div>
              </React.Fragment>
            ))}
          </div> */
}
