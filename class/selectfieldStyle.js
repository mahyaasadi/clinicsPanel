const selectfieldColourStyles = {
  menu: (provided) => ({ ...provided, zIndex: 9999 }),
  control: (styles) => ({
    ...styles,
    minHeight: 43,
    borderRadius: 14,
    border: "1px solid #E6E9F4",
    textAlign: "center",
    '&:hover': {
      borderColor: '#594b0d',
    },
    // option: (provided, state) => ({
    //   ...styles,
    //   borderBottom: '1px solid #E6E9F4',
    //   color: state.isSelected ? '#594b0d' : '#333',
    //   backgroundColor: state.isFocused ? '#E6E9F4' : 'white',
    //   '&:hover': {
    //     backgroundColor: '#594b0d',
    //   },
    // }),
    // singleValue: (provided) => ({
    //   ...styles,
    //   color: '#333',
    // }),
    // placeholder: (provided) => ({
    //   ...styles,
    //   color: '#999',
    // }),
    // indicatorSeparator: () => ({ display: 'none' }),
    // dropdownIndicator: (provided) => ({
    //   ...styles,
    //   color: '#594b0d',
    // }),
  }),
};

export default selectfieldColourStyles;
