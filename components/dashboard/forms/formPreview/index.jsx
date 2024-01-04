import dynamic from "next/dynamic";
import PatientCard from "components/dashboard/patientFile/PatientCard";

const FormPreviewInline = ({ data, formValues, patientData }) => {
  // console.log({ data, patientData });
  let componentsArr = [];

  data?.map((x, index) => {
    const MyComponent = dynamic(() =>
      import("components/dashboard/forms/formPreview/form-" + x?.type)
    );

    componentsArr.push(
      <MyComponent
        data={x}
        key={index}
        index={index}
        defaultValue={formValues[x.name]}
      />
    );
  });

  let InsuranceType,
    GenderType = null;
  if (patientData) {
    switch (patientData.Insurance) {
      case "1":
        InsuranceType = "سلامت ایرانیان";
        break;
      case "2":
        InsuranceType = "تامین اجتماعی";
        break;
      case "3":
        InsuranceType = "نیروهای مسلح";
        break;
      case "4":
        InsuranceType = "آزاد";
      default:
        break;
    }

    switch (patientData.Gender) {
      case "M":
        GenderType = "مرد";
        break;
      case "F":
        GenderType = "زن";
        break;
      case "O":
        GenderType = "دیگر";
        break;
      default:
        break;
    }
  }

  return (
    <>
      <div className="row">
        <div className="table-responsive p-2 marginb-3">
          {/* <table className="table mt-4 font-13 fw-bold text-secondary table-bordered">
            <tbody>
              <tr>
                <td>نام بیمار</td>
                <td>نوع بیمه</td>
                <td>کد ملی</td>
                <td>سن</td>
                <td>جنسیت</td>
              </tr>
              <tr>
                <td>{patientData.Name}</td>
                <td>{InsuranceType}</td>
                <td>{patientData.NationalID}</td>
                <td>{patientData.Age}</td>
                <td>{GenderType}</td>
              </tr>
            </tbody>
          </table> */}
          <PatientCard />
        </div>

        <hr className="mb-4" />

        {componentsArr.map((component, index) => component)}
      </div>
    </>
  );
};

export default FormPreviewInline;
