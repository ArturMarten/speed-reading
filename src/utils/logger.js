const logger = (store) => (next) => (action) => {
  console.log('[Middleware] Dispatching', action);
  const result = next(action);
  console.log('[Middleware] Next state', store.getState());
  return result;
};

export default logger;
