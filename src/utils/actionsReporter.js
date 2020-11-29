export const actionData = {
  actions: [],

  addAction: function addAction(action) {
    this.actions.push(action);
  },

  getActions: function getActions(length = this.actions.length) {
    return this.actions
      .filter((action) => action.type.indexOf('@@localize/ADD_TRANSLATION') === -1)
      .slice(Math.max(this.actions.length - length - 1, 0));
  },
};

const actionsReporter = () => (next) => (action) => {
  if (typeof action === 'object') {
    actionData.addAction(action);
  }
  return next(action);
};

export default actionsReporter;
