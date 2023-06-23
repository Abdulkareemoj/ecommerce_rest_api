const __404_err_page = (req, res, next) => {
  res.status(404).send("Error Page: Resource cannot be found!");
};

export default __404_err_page;
