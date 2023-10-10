import { panel, text, heading, spinner, divider } from '@metamask/snaps-ui';

export const showMessage = async (title: string, message: string[]) => {
  return await snap.request({
    method: 'snap_dialog',
    params: {
      type: 'alert',
      content: panel([
        heading(title),
        ...message.flatMap((msg) => {
          return [text(msg), divider()];
        }),
      ]),
    },
  });
};

export const getConfirmation = async (title: string, message: string[]) => {
  return await snap.request({
    method: 'snap_dialog',
    params: {
      type: 'confirmation',
      content: panel([
        heading(title),
        ...message.flatMap((msg) => {
          return [text(msg), divider()];
        }),
      ]),
    },
  });
};

export const getInput = async (
  title: string,
  message: string,
  placeholderText: string,
) => {
  return await snap.request({
    method: 'snap_dialog',
    params: {
      type: 'prompt',
      content: panel([heading(title), text(message)]),
      placeholder: placeholderText,
    },
  });
};

export const showSpinner = async (message: string) => {
  return await snap.request({
    method: 'snap_dialog',
    params: {
      type: 'alert',
      content: panel([heading(message), spinner()]),
    },
  });
};
