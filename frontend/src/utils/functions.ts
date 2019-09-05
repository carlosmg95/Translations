/**
 * Changes the values of the queries of the state in the URL.
 * @param {string} state. Complete current query.
 * @param {string} key. Query to change.
 * @param {string | number} newValue. New value to the query.
 * @return {string} New complete query.
 */
export const changeQueryValues = (
  state: string,
  key: string,
  newValue: string | number,
): string => {
  let newState: string;
  if (!state) {
    // If there wasn't a state
    newState = `?${key}=${newValue}`; // Create a new state
  } else if (state && state.match(new RegExp(`${key}=\\w*`))) {
    // If there was a state and it has this query key
    newState = state.replace(
      // Replace the value
      new RegExp(`${key}=\\w*`),
      `${key}=${newValue}`,
    );
  } else {
    // If there was a state but it don't have this query key
    newState = `${state}&${key}=${newValue}`; // Add the value
  }
  return newState;
};
