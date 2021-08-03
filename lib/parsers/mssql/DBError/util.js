function getCode(error) {
  error = error.originalError || error;

  return {
    errorCode: error.number,
    severity: error.class,
  };
}

function getMessage(error) {
  error = error.originalError || error;

  return error.message;
}

function isCode(error, severity, errorCode) {
  const code = getCode(error);

  if (code) {
    return code.errorCode === errorCode && code.severity === severity;
  }

  return false;
}

module.exports = {
  getCode,
  getMessage,
  isCode,
};
