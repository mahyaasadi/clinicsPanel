const ParaServicesDropdown = ({ paraSrvItem }) => {
  return (
    <>
      <option
        type="button"
        value={paraSrvItem.srvType}
        className={
          "text-secondary font-13 prescTypeId" + paraSrvItem.prescTypeId
        }
        id={"prescService" + paraSrvItem.srvType}
      >
        {paraSrvItem.srvTypeDes}
      </option>
    </>
  );
};

export default ParaServicesDropdown;
