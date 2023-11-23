const ArchiveRecipt = ({
  data,
  clinicData,
  calculateDiscount,
  paymentData,
}) => {
  console.log({ data, paymentData, clinicData });

  let RowTotalCost;
  let RowOrgCost;
  let RowPatientCost;
  let RowTotalDiscount;

  const insuranceType =
    data?.Patient?.Insurance === "1"
      ? "سلامت ایرانیان"
      : data?.Patient?.Insurance === "2"
      ? "تامین اجتماعی"
      : data?.Patient?.Insurance === "3"
      ? "نیروهای مسلح"
      : "آزاد";

  data?.Items?.map((item, index) => {
    RowTotalCost = item.Price * item.Qty;
    // RowOrgCost = item.Qty * item.OC;
    // RowPatientCost = RowTotalCost - RowOrgCost;
    // RowTotalDiscount = calculateDiscount(item, RowPatientCost);

    // if (RowTotalDiscount) RowPatientCost -= RowTotalDiscount;
  });

  return (
    <>
      <div className="reciptPrintHeader reciptLogoContainer p-3">
        <div className="d-flex justify-between mb-0 fw-bold font-12">
          <p>نسخه بایگانی</p>
          <p>{clinicData?.PrintSetting?.Header}</p>
        </div>

        <div className="border-b-1"></div>

        <div className="row justify-between font-11">
          <div className="col-6 text-start">
            <p className="font-11 fw-bold mb-1">
              کد پذیرش : {data?.ReceptionID}
            </p>
            <p>نوع بیمه : {insuranceType}</p>
            <p>سن : {data?.Patient.Age}</p>
          </div>
          <div className="col-6 text-end mb-1">
            <p className="mb-1">پذیرش : {data?.Date}</p>
            <p className="font-11 fw-bold">{data?.Modality?.Name}</p>
            <p>نام : {data?.Patient?.Name}</p>
            {/* <p>پزشک : </p> */}
          </div>
        </div>

        <div className="border-b-1"></div>

        <div className="font-11 fw-bold d-flex flex-wrap gap-2 justify-end">
          <div dir="rtl">
            خدمات :
            {data?.Items?.map((item, index) => (
              <span key={index}>
                {item.Name} {" | "}
              </span>
            ))}
          </div>
        </div>

        <div className="border-b-1"></div>

        <div className="row justify-between font-11">
          <div className="col-7">
            <p className="mb-1">
              جمع هزینه خدمات : {data?.Calculated?.TotalPrice?.toLocaleString()}{" "}
              ریال
            </p>
            <p className="mb-1">
              جمع سهم سازمان : {data?.Calculated?.TotalOC?.toLocaleString()}{" "}
              ریال
            </p>
            <p className="mb-1">
              سهم پرداختی بیمار : {data?.Calculated?.TotalPC?.toLocaleString()}{" "}
              ریال
            </p>

            <div className="border-b-1 w-50"></div>

            <p className="mb-1">
              مبلغ تخفیف : {data?.Calculated?.TotalDiscount?.toLocaleString()}{" "}
              ریال
            </p>
            <p className="mb-1">
              مبلغ بدهی:{" "}
              {paymentData?.Debt
                ? parseInt(paymentData?.Debt).toLocaleString()
                : 0}{" "}
              ریال
            </p>
          </div>

          <div dir="rtl" className="col-4 fw-bold">
            مهر و امضا :
          </div>
        </div>

        <div className="border-b-1"></div>

        <div className="text-end">
          <p className="font-11">{clinicData.Address} : آدرس </p>
          <p className="font-11"> : شماره مرکز </p>
        </div>
      </div>
    </>
  );
};

export default ArchiveRecipt;
