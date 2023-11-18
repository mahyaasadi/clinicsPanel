import { useEffect } from "react";

const DepartmentsHeader = ({ department, activeClass, handleDepTabChange }) => {
  const handleAdditionalActions = () => {
    $("#searchDiv").hide();
    $("#srvSearchInput").val("");
    $("#unsuccessfulSearch").hide();
  };

  useEffect(() => {
    if (activeClass) {
      handleDepTabChange(department.Services, department._id);
    }
  }, []);

  return (
    <>
      <li className="nav-item">
        <a
          className={"nav-link media-nav-link font-13 " + activeClass}
          href={"#bottom-tab" + department._id}
          id={"department " + department._id}
          data-bs-toggle="tab"
          onClick={() => {
            handleDepTabChange(department.Services, department._id);
            handleAdditionalActions();
          }}
        >
          {department.Name}
          <span
            className="badge badge-primary"
            id={"srvItemCountId" + department._id}
          ></span>
        </a>
      </li>
    </>
  );
};

export default DepartmentsHeader;
