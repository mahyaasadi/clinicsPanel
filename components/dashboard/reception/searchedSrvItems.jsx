const SearchedServiceItems = ({ data, selectSearchedSrv }) => {
  return (
    <>
      {data?.map((x, index) => (
        <button
          key={index}
          className="btn btn-outline-secondary border-radius btn-sm w-100 mb-1 right-text"
          onClick={() =>
            selectSearchedSrv(
              x.Name,
              x.Code,
              x.EngName,
              x.Price,
              x.SS,
              x.ST,
              x.SA
            )
          }
        >
          {x.Code}
          {" | "}
          {x.Name}
          {" | "}
          {x.EngName}
        </button>
      ))}
    </>
  );
};

export default SearchedServiceItems;
