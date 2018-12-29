const respondWithError = (res, err, code, message) => {
  // TODO(js): Use a robust logger.
  // console.log(err); // eslint-disable-line no-console

  res.status(code);
  res.json({
    code, message,
  });
};

module.exports = {
  respondWithError,
};
