import ReceptionItem from "./receptionItem";
import FilterReceptionItems from "./filterReceptionItems";

const ReceptionList = ({
  data,
  deleteReception,
  applyFilterOnRecItems,
  handleResetFilterFields,
  SetRangeDate,
  ClinicID,
  selectedDepartment,
  FUSelectDepartment,
  searchIsLoading
}) => {
  return (
    <>
      <div className="row p-4">
        <div className="">
          <FilterReceptionItems
            ClinicID={ClinicID}
            SetRangeDate={SetRangeDate}
            applyFilterOnRecItems={applyFilterOnRecItems}
            handleResetFilterFields={handleResetFilterFields}
            selectedDepartment={selectedDepartment}
            FUSelectDepartment={FUSelectDepartment}
            searchIsLoading={searchIsLoading}
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
