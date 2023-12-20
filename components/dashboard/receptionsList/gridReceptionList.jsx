import ReceptionItem from "./receptionItem";
import FilterReceptionItems from "./filterReceptionItems";
import FeatherIcon from "feather-icons-react";

const GridReceptionList = ({
  data,
  deleteReception,
  applyFilterOnRecItems,
  handleResetFilterFields,
  SetRangeDate,
  ClinicID,
  selectedDepartment,
  FUSelectDepartment,
  searchIsLoading,
  openAppointmentModal,
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

        <div className="d-flex gap-1 justify-end">
          <button className="btn btn-outline-primary d-flex align-items-center justify-center">
            <FeatherIcon icon="grid" />
          </button>
          <button className="btn btn-outline-primary d-flex align-items-center justify-center">
            <FeatherIcon icon="list" />
          </button>
        </div>

        {data.map((item, index) => (
          <ReceptionItem
            key={index}
            srv={item}
            deleteReception={deleteReception}
            openAppointmentModal={openAppointmentModal}
          />
        ))}
      </div>
    </>
  );
};

export default GridReceptionList;
