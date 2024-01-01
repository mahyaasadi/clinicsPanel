import { useEffect } from "react";

const ModalitiesNavLink = ({ data, activeClass, handleDepClick }) => {
  useEffect(() => {
    if (activeClass === "active") handleDepClick(data.value);
  }, [activeClass]);

  return (
    <>
      <li className="nav-item">
        <a
          className={"nav-link ServiceNav " + activeClass}
          data-bs-toggle="tab"
          onClick={() => handleDepClick(data.value)}
        >
          {data.label}
        </a>
      </li>
    </>
  );
};

export default ModalitiesNavLink;
