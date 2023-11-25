const ServicesRecipt = ({ clinicData, data, paymentData }) => {
  console.log({ data, clinicData });

  const insuranceType =
    data?.Patient?.Insurance === "1"
      ? "سلامت ایرانیان"
      : data?.Patient?.Insurance === "2"
      ? "تامین اجتماعی"
      : data?.Patient?.Insurance === "3"
      ? "نیروهای مسلح"
      : "آزاد";

  return (
    <>
      <div className="reciptPrintHeader reciptLogoContainer font-11 p-3">
        <div className="d-flex justify-between mb-0 fw-bold font-12">
          <p>کد پذیرش : {data.ReceptionID}</p>
          <p>{clinicData?.PrintSetting?.Header}</p>
        </div>

        <div className="border-b-1"></div>

        <div className="row justify-between font-11">
          <div className="col-6 text-start">
            <p className="font-11 fw-bold">{data?.Modality?.Name}</p>
            <p>سن : {data.Patient.Age}</p>
            <p>نوع بیمه : {insuranceType}</p>
          </div>

          <div className="col-6 text-end mb-2">
            <p>پذیرش : {data?.Date}</p>
            <p>نام : {data?.Patient?.Name}</p>
          </div>
        </div>

        <div className="border-b-1"></div>

        <div className="font-11 fw-bold d-flex flex-wrap gap-2 justify-end">
          <div dir="rtl">
            خدمات :{" "}
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

          <p dir="rtl" className="col-4 fw-bold d-flex justify-start">
            مهر و امضا :
          </p>
        </div>

        <div className="border-b-1"></div>

        <div className="otherReciptInfo"></div>
      </div>
    </>
  );
};

export default ServicesRecipt;
