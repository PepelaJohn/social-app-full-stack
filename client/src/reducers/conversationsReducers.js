import * as ACTIONS from "../constants";
export default (conversations = [], action) => {
  switch (action.type) {
    case ACTIONS.GET_CONVERSATIONS:
        return conversations.sort()
      break;

    default:
      return conversations;
  }
};
