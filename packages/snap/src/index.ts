import { OnRpcRequestHandler } from '@metamask/snaps-types';
import { panel, text } from '@metamask/snaps-ui';
import { getConfirmation, showMessage } from './snapHelpers';
import { getUserDid, getVP, issueVC } from './onyxssiHelpers';
/**
 * Handle incoming JSON-RPC requests, sent through `wallet_invokeSnap`.
 *
 * @param args - The request handler args as object.
 * @param args.origin - The origin of the request, e.g., the website that
 * invoked the snap.
 * @param args.request - A validated JSON-RPC request object.
 * @param args.data
 * @returns The result of `snap_dialog`.
 * @throws If the request method is not valid for this snap.
 */

/**
 *
 * @param request
 */

export const onRpcRequest: OnRpcRequestHandler = async ({
  origin,
  request,
}) => {
  switch (request.method) {
    case 'GET_DID_ETHR': {
      const confirmed = await getConfirmation(
        `${origin} is Requesting your DID`,
        ['DID Type Requested: did:ethr'],
      );

      if (!confirmed) {
        return await showMessage('Request Denied!', [`User Denied Request`]);
      }

      return await getUserDid('ethr');
    }

    case 'GET_DID_KEY': {
      const confirmed = await getConfirmation(
        `${origin} is Requesting your DID`,
        ['DID Type Requested: did:key'],
      );

      if (!confirmed) {
        return await showMessage('Request Denied!', [`User Denied Request`]);
      }

      return await getUserDid('key');
    }

    case 'ISSUE_VC': {
      return await issueVC(request?.params?.vcJwt, origin);
    }

    case 'GET_VP': {
      return await getVP(request?.params?.vcId, origin);
    }

    default:
      throw new Error('Method not found.');
  }
};
