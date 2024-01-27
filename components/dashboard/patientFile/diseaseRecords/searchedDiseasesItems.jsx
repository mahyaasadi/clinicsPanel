const SearchedDiseasesItems = ({ data, selectSearchedDisease }) => {
  return data?.map((x, index) => {
    return (
      <button
        key={index}
        className="btn btn-outline-primary border-radius btn-sm w-100 mb-1 right-text bg-white searchSelectBtn"
        onClick={() =>
          selectSearchedDisease(
            x?.PersianName,
            x?.icd11Name,
            x?._id,
            x?.icd11Code
          )
        }
      >
        {x?.icd11Code}
        {" | "}
        {x?.icd11Name}
      </button>
    );
  });
};

export default SearchedDiseasesItems;
