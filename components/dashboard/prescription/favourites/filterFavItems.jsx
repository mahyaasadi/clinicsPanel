const FilterFavItems = ({
  favSearchInput,
  setFavSearchInput,
  filterSalamatMode,
}) => {
  return (
    <div
      className={`box relative w-100 d-flex ${
        filterSalamatMode ? "justify-end mt-3" : ""
      }`}
    >
      <label className="lblAbs font-12">جستجو</label>
      <div className={`${filterSalamatMode ? "w-50" : "w-100"} search m-0`}>
        <input
          dir="rtl"
          onChange={(e) => setFavSearchInput(e.target.value)}
          value={favSearchInput}
          autoComplete="off"
          className="form-control rounded-sm font-12 articleSearchInput"
          type="text"
        />
        <i className="fe fe-search articleSearchIcon"></i>
      </div>
    </div>
  );
};

export default FilterFavItems;
