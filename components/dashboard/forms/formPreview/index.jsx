import dynamic from "next/dynamic";
import PatientCard from "components/dashboard/patientFile/PatientCard";

const FormPreviewInline = ({ data, formValues, patientData }) => {
  console.log({ data });

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
          <PatientCard data={patientData} />
        </div>

        <hr className="mb-4" />

        {componentsArr.map((component, index) => component)}
      </div>
    </>
  );
};

export default FormPreviewInline;
