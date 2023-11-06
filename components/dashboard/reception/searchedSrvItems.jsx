const SearchedServiceItems = ({ data, selectSearchedSrv }) => {
  return (
    <>
      {data?.map((x, index) => (
        <button
          key={index}
          className="btn btn-outline-secondary border-radius btn-sm w-100 mb-1 right-text bg-white searchSelectBtn"
          onClick={() =>
            selectSearchedSrv(
              x._id,
              x.Name,
              x.Code,
              x.EngName,
              x.Price,
              x.SS,
              x.ST,
              x.SA,
              x.ModalityID
            )
          }
        >
          {x.Code}
          {" | "}
          {x.EngName}
          {" | "}
          {x.Name}
        </button>
      ))}
    </>
  );
};

export default SearchedServiceItems;
