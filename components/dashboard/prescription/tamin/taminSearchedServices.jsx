const TaminSearchedServices = ({ data, selectSearchedService }) => {
  return data?.map((x, index) => {
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
