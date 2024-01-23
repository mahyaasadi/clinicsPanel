import dynamic from "next/dynamic";
import PatientHorizontalCard from "components/dashboard/patientInfo/patientHorizontalCard";

const FormPreviewInline = ({ data, formValues, patientData }) => {
  let componentsArr = [];

  data?.map((x, index) => {
    const MyComponent = dynamic(() =>
      import("components/dashboard/forms/formComponents/form-" + x?.type)
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

  return (
    <>
      <div className="row">
        <div className="table-responsive p-2 marginb-3">
          <PatientHorizontalCard data={patientData} />
        </div>

        <hr className="mb-4" />

        {componentsArr.map((component, index) => component)}
      </div>
    </>
  );
};

export default FormPreviewInline;
