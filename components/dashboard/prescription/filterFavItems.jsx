const FilterFavItems = ({ favSearchInput, setFavSearchInput }) => {
  return (
    <div className="box relative mt-3 w-100 d-flex justify-end">
      <div className="search m-0 w-50">
        <input
          dir="rtl"
          onChange={(e) => setFavSearchInput(e.target.value)}
          value={favSearchInput}
          autoComplete="off"
          className="form-control rounded-sm font-12 articleSearchInput"
          placeholder="جستجو ..."
          type="text"
        />
        <i className="fe fe-search articleSearchIcon"></i>
      </div>
    </div>
  );
};

export default FilterFavItems;
