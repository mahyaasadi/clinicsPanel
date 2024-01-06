import NavLink from "./navLink";

const ModalitiesHeader = ({ data, handleDepClick }) => {
  return (
    <>
      <ul className="nav nav nav-tabs appointmentHeader nav-tabs-solid nav-tabs-rounded nav-tabs-scroll font-14 flex-nowrap paddingb-0">
        {data?.map((nav, index) => {
          return (
            <NavLink
              activeClass={index === 0 ? "active" : ""}
              key={index}
              data={nav}
              handleDepClick={handleDepClick}
            />
          );
        })}
      </ul>
    </>
  );
};

export default ModalitiesHeader;
