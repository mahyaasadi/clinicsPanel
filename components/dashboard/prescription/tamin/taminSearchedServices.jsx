const TaminSearchedServices = ({ data, selectSearchedService }) => {
  return data?.map((x, index) => {
    let code = x?.wsSrvCode;
    let ind1 = code.indexOf("-");
    if (ind1 !== -1) code = code.substr(0, ind1);

    return (
      <button
        key={index}
        className="btn btn-outline-primary border-radius btn-sm w-100 mb-1 right-text bg-white searchSelectBtn"
        onClick={() =>
          selectSearchedService(
            x?.srvName,
            x?.wsSrvCode,
            x?.srvType?.srvType,
            x?.parTarefGrp?.parGrpCode
          )
        }
      >
        {x.srvName}
        {" | "}
        {x.wsSrvCode}
      </button>
    );
  });
};

export default TaminSearchedServices;
