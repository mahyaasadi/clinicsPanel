import { useEffect } from "react";

const NavLink = ({ data, activeClass, handleDepClick }) => {
  useEffect(() => {
    if (activeClass === "active") handleDepClick(data._id);
  }, [activeClass]);

  return (
    <>
      <li className="nav-item">
        <a
          className={"nav-link ServiceNav " + activeClass}
          data-bs-toggle="tab"
          onClick={() => handleDepClick(data._id)}
        >
          {data.Name}
        </a>
      </li>
    </>
  );
};

export default NavLink;
