const SalamatSearchedServices = ({ data, selectSearchedService }) => {
  return data?.map((x, index) => {
    //   let code = x?.wsSrvCode;
    //   let ind1 = code.indexOf("-");
    //   let TaminCode = code;
    //   if (ind1 !== -1) code = code.substr(0, ind1);

    return (
      <button
        key={index}
        className="btn btn-outline-primary border-radius btn-sm w-100 mb-1 right-text bg-white searchSelectBtn"
        onClick={() =>
          selectSearchedService(
            x?.fullName,
            x?.state?.shape
            // x?.wsSrvCode,
            // x?.srvType?.srvType,
            // x?.parTarefGrp?.parGrpCode
          )
        }
      >
        {x.interfaceName}
        {/* {" | "}
          {x.wsSrvCode} */}
      </button>
    );
  });
};

export default SalamatSearchedServices;
