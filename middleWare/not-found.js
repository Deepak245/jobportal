const notFoundMiddleWare = (req, res) => {
  res.status(404).send("Route Does not Exist");
};

export default notFoundMiddleWare;
