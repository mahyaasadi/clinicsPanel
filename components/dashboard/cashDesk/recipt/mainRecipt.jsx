const MainRecipt = ({
  data,
  clinicData,
  calculatedTotalPC,
  AnsLines,
  DesLines,
  PatientCost,
  paymentData,
  calculateDiscount,
}) => {
  return (
    <>
      <div dir="rtl" className="printContent">
        <div className="d-flex flex-col reciptPrintHeader reciptLogoContainer col-12 mt-2 font-11">
          <div className="row">
            <div className="col-12 d-flex fw-bold font-12 justify-center align-items-center mb-2 reciptHeaderContainer">
              {clinicData?.PrintSetting?.Header}
            </div>
            <div className="col-4">
              <p className="mb-1">کد پذیرش : {data.ReceptionID}</p>
              <p className="mb-1">نام بیمار : {data?.Patient?.Name}</p>
              <p>کد ملی : {data.Patient?.NationalID}</p>
            </div>

            <div className="col-4 d-flex justify-center">
              <div>
                <p className="mb-1">بخش : {data?.Modality?.Name}</p>
                <p className="mb-1">تاریخ ثبت: {data?.Date}</p>
                <p>ساعت ثبت: {data?.Time}</p>
              </div>
            </div>

            <div className="col-4 d-flex justify-end">
              <div>
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
                <p>
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
    </>
  );
};

export default MainRecipt;
