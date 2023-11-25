import ReceptionItem from "./receptionItem";
import FilterReceptionItems from "./filterReceptionItems";

const ReceptionList = ({
  data,
  deleteReception,
  applyFilterOnRecItems,
  handleResetFilterFields,
  SetRangeDate,
  setStartDate,
  setEndDate,
  ClinicID,
  selectedDepartment,
  FUSelectDepartment,
  searchIsLoading,
  addAppointment,
  show,
  onHide,
  openAppointmnetModal,
}) => {
  return (
    <>
      <div className="row p-4">
        <div>
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
            addAppointment={addAppointment}
            show={show}
            onHide={onHide}
            openAppointmnetModal={openAppointmnetModal}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
          />
        ))}
      </div>
    </>
  );
};

export default ReceptionList;
