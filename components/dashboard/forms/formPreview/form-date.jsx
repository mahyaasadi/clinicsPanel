import { useState } from "react";
import SingleDatePicker from "components/commonComponents/datepicker/singleDatePicker";

const FormDate = ({ data }) => {
  console.log("date", data);

  const [date, setDate] = useState(null);
  return (
    <>
      <div className="w-25">
        <SingleDatePicker setDate={setDate} label={data.lebel} />
      </div>
    </>
  );
};

export default FormDate;
