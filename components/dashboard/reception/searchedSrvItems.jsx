const SearchedServiceItems = ({ data }) => {
  console.log({ data });

  return (
    <>
      {data?.map((x, index) => (
        <button
          key={index}
          className="btn btn-outline-secondary border-radius btn-sm w-100 mb-1 right-text"
        // onClick={Select}
        >
          {x.Code}
          {" | "}
          {x.Name}
        </button>
      ))}
    </>
  );
};

export default SearchedServiceItems;
