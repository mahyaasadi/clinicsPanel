import FeatherIcon from "feather-icons-react";

const SalamatSearchedServices = ({ data, selectSearchedService }) => {
  return data?.map((x, index) => {
    return (
      <button
        key={index}
        className="btn btn-outline-primary border-radius btn-sm w-100 mb-1 right-text bg-white searchSelectBtn"
        onClick={() =>
          selectSearchedService(
            x?.interfaceName,
            x?.state?.shape,
            x?.nationalNumber
          )
        }
      >
        {x.interfaceName}

        <div className="mt-2 d-flex justify-center">
          {x?.state?.isCovered ? (
            <button className="btn btn-sm btn-success font-12 w-18 d-flex justify-center align-items-center gap-1">
              <FeatherIcon icon="check" />
              تحت پوشش بیمه
            </button>
          ) : (
            <button className="btn btn-sm btn-danger font-12 w-18 d-flex justify-center align-items-center gap-1">
              <FeatherIcon icon="x" />
              فاقد پوشش بیمه
            </button>
          )}
        </div>
      </button>
    );
  });
};

export default SalamatSearchedServices;
