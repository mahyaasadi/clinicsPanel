import { useEffect } from "react";

const DepartmentsHeader = ({ department, activeClass, handleDepTabChange }) => {
  useEffect(() => {
    if (activeClass) {
      handleDepTabChange(department.Services);
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
          onClick={() => handleDepTabChange(department.Services)}
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
