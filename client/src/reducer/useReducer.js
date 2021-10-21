export const initialState = null;

export const reducer = (state, action) => {
  console.log(`Reducer state ${state}`);
  if (action.type === "USER") {
    console.log(`Action Payload ${action}`);
    return action.payload;
  }
  return state;
};
