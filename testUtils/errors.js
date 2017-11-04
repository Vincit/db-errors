function logError(err) {
  if (typeof err.reason === 'function' && typeof err.isRejected === 'function') {
    if (!err.isRejected()) {
      return;
    } else {
      err = err.reason();
    }
  }

  if (err.nativeError) {
    const msg = err.nativeError.message;
    delete err.nativeError.message;
    err.nativeError.message = msg;
  } else {
    const msg = err.message;
    delete err.message;
    err.message = msg;
  }

  console.log(JSON.stringify(err, null, 2));
}

module.exports = {
  logError
};