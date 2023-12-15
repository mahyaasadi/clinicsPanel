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
  }),
};

export default selectfieldColourStyles;
