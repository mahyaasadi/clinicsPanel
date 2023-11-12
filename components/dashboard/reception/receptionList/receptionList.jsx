import ReceptionItem from "./receptionItem";
import FilterReceptionItems from "./filterReceptionItems";

const ReceptionList = ({
  data,
  deleteReception,
  applyFilterOnRecItems,
  SetRangeDate,
  ClinicID,
  selectedDepartment,
  FUSelectDepartment,
}) => {
  return (
    <>
      <div className="row p-4">
        <div className="">
          <FilterReceptionItems
            applyFilterOnRecItems={applyFilterOnRecItems}
            SetRangeDate={SetRangeDate}
            ClinicID={ClinicID}
            selectedDepartment={selectedDepartment}
            FUSelectDepartment={FUSelectDepartment}
          />
        </div>
        {data.map((item, index) => (
          <ReceptionItem
            key={index}
            srv={item}
            deleteReception={deleteReception}
          />
        ))}
      </div>
    </>
  );
};

export default ReceptionList;
