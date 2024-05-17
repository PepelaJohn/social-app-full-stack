export default (loading = false, action) => {
  switch (action) {
    case "LOADING":
      return true;
    case "STOP_LOADING":
      return false;
    default:
      return loading;
  }
};
