const errorHandler = (store) => (next) => (action) => {
  try {
    return next(action);
  } catch (error) {
    console.log(error);
    console.log('current state', store.getState());
    console.log('last action was', action);
    console.log(error);
    return error;
  }
};

export default errorHandler;
