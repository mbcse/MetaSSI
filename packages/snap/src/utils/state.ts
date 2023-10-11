/* eslint-disable jsdoc/require-description */
export type State = {
  VERIFIABLE_CREDENTIALS: any;
  EDDSA_PRIVATE_KEY: any;
  ES256K_PRIVATE_KEY: any;
  DID_ETHR: any;
  DID_KEY: any;
  VERIFIABLE_PRESENTATIONS: any;
};

const DEFAULT_STATE = {
  VERIFIABLE_CREDENTIALS: {},
  EDDSA_PRIVATE_KEY: null,
  ES256K_PRIVATE_KEY: null,
  DID_ETHR: null,
  DID_KEY: null,
  VERIFIABLE_PRESENTATIONS: {},
};

/**
 *
 */
export async function getState(): Promise<any> {
  const state = await snap.request({
    method: 'snap_manageState',

    // For this particular example, we use the `ManageStateOperation.GetState`
    // enum value, but you can also use the string value `'get'` instead.
    params: { operation: 'get' },
  });

  // If the snap does not have state, `state` will be `null`. Instead, we return
  // the default state.
  return state || DEFAULT_STATE;
}

/**
 *
 * @param newState
 */
export async function setState(newState: State) {
  await snap.request({
    method: 'snap_manageState',

    // For this particular example, we use the `ManageStateOperation.UpdateState`
    // enum value, but you can also use the string value `'update'` instead.
    params: { operation: 'update', newState },
  });
}

/**
 *
 */
export async function clearState() {
  await snap.request({
    method: 'snap_manageState',

    // For this particular example, we use the `ManageStateOperation.ClearState`
    // enum value, but you can also use the string value `'clear'` instead.
    params: { operation: 'clear' },
  });
}

/**
 *
 * @param key
 * @param value
 */
export async function setItem(key: string, value: any) {
  console.log('setItem', key, value);
  const state = await getState();
  console.log(state);
  state[key] = value;
  await setState(state);
}

/**
 *
 * @param key
 */
export async function getItem(key: string) {
  const state = await getState();
  console.log(state);
  return state[key];
}
