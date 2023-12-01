import NavLink from "./navLink";

const ModalitiesHeader = ({ data, handleDepClick }) => {
  return (
    <>
      <div className="w-100 mb-4">
        <div className="card mb-0">
          <div className="card-body w-100">
            <ul className="nav nav-tabs nav-tabs-bottom nav-tabs-scroll font-14 padding-bottom-md flex-nowrap">
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
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalitiesHeader;
