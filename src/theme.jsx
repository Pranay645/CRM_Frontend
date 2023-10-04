
const getDesignTokens = (mode) => ({
  palette: {
    mode,
    ...(mode === "light"
      ? {
          
      }
      : {
          // palette values for dark mode
        }),
  },
});

export default getDesignTokens;
