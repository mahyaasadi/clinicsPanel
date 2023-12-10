import { useEffect } from "react";

const NavLink = ({ data, activeClass, handleDepClick }) => {
  useEffect(() => {
    if (activeClass === "active")
      handleDepClick(
        data._id,
        parseInt(data.OpeningHours),
        parseInt(data.ClosingHours)
      );
  }, [activeClass]);

  return (
    <>
      <li className="nav-item">
        <a
          className={"nav-link ServiceNav " + activeClass}
          data-bs-toggle="tab"
          onClick={() =>
            handleDepClick(
              data._id,
              parseInt(data.OpeningHours),
              parseInt(data.ClosingHours)
            )
          }
        >
          {data.Name}
        </a>
      </li>
    </>
  );
};

export default NavLink;
