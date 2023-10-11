import { useContext, useState } from 'react';
import styled from 'styled-components';
import { MetamaskActions, MetaMaskContext } from '../hooks';
import {
  connectSnap,
  getDidEthr,
  getDidKey,
  getSnap,
  getVp,
  isLocalSnap,
  issueVc,
  shouldDisplayReconnectButton,
} from '../utils';
import {
  ConnectButton,
  InstallFlaskButton,
  ReconnectButton,
  SendHelloButton,
  Card,
} from '../components';
import { defaultSnapOrigin } from '../config';
import EmbeddedVideo from '../components/EmbeddedVideo';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  margin-top: 7.6rem;
  margin-bottom: 7.6rem;
  ${({ theme }) => theme.mediaQueries.small} {
    padding-left: 2.4rem;
    padding-right: 2.4rem;
    margin-top: 2rem;
    margin-bottom: 2rem;
    width: auto;
  }
`;

const Heading = styled.h1`
  margin-top: 0;
  margin-bottom: 2.4rem;
  text-align: center;
`;

const Span = styled.span`
  color: ${(props) => props.theme.colors.primary.default};
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.large};
  font-weight: 500;
  margin-top: 0;
  margin-bottom: 0;
  ${({ theme }) => theme.mediaQueries.small} {
    font-size: ${({ theme }) => theme.fontSizes.text};
  }
`;

const ResponseTitle = styled.div`
  background-color: white;
  border: 1px solid ${({ theme }) => theme.colors.error.default};
  color: green;
  border-radius: ${({ theme }) => theme.radii.default};
  padding: 2.4rem;
  margin-bottom: 2.4rem;
  margin-top: 2.4rem;
  max-width: 60rem;
  width: 100%;
  overflow-wrap: break-word;
  word-wrap: break-word;
  hyphens: auto;
  ${({ theme }) => theme.mediaQueries.small} {
    padding: 1.6rem;
    margin-bottom: 1.2rem;
    margin-top: 1.2rem;
    max-width: 100%;
  }
`;

const CardContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  max-width: 64.8rem;
  width: 100%;
  height: 100%;
  margin-top: 1.5rem;
`;

const Notice = styled.div`
  background-color: ${({ theme }) => theme.colors.background.alternative};
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  color: ${({ theme }) => theme.colors.text.alternative};
  border-radius: ${({ theme }) => theme.radii.default};
  padding: 2.4rem;
  margin-top: 2.4rem;
  max-width: 60rem;
  width: 100%;

  & > * {
    margin: 0;
  }
  ${({ theme }) => theme.mediaQueries.small} {
    margin-top: 1.2rem;
    padding: 1.6rem;
  }
`;

const ErrorMessage = styled.div`
  background-color: ${({ theme }) => theme.colors.error.muted};
  border: 1px solid ${({ theme }) => theme.colors.error.default};
  color: ${({ theme }) => theme.colors.error.alternative};
  border-radius: ${({ theme }) => theme.radii.default};
  padding: 2.4rem;
  margin-bottom: 2.4rem;
  margin-top: 2.4rem;
  max-width: 60rem;
  width: 100%;
  ${({ theme }) => theme.mediaQueries.small} {
    padding: 1.6rem;
    margin-bottom: 1.2rem;
    margin-top: 1.2rem;
    max-width: 100%;
  }
`;

const Index = () => {
  const [state, dispatch] = useContext(MetaMaskContext);
  const [response, setResponse] = useState('');
  const [vcJwt, setVcJwt] = useState(
    'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSJdLCJ0eXBlIjpbIlZlcmlmaWFibGVDcmVkZW50aWFsIiwiUFJPT0ZfT0ZfTkFNRSJdLCJjcmVkZW50aWFsU3ViamVjdCI6eyJuYW1lIjoiSmVzc2llIERvZSJ9fSwic3ViIjoiZGlkOmtleTp6Nk1ra2NCUVdLc1o3b2Vtb1FkWDZrbTFEdUhURGZtNVFyQnJ1ZFNhbjlxUVdxUUEiLCJqdGkiOiJkaWQ6a2V5Ono2TWttZ2lySmNYTHZjeUFRWUhWb3VnTTNKcEJjVnRSQW1DQ1RZV3BtcEMzSDFaUyIsIm5iZiI6MTY5Njk2ODA5NiwiaXNzIjoiZGlkOmtleTp6Nk1rd0RDcmpnNHJ5VTRpSlFjV3ZwR2VTVDN1Y0R2S1FDam12WWgzaXhaUTZ6WEcifQ._Aj_1QcA-8r43GS7Ev19bioc69EvGdRc5_ukIMQeclt3Xh6TFNbwrUgv-p0CTNi9K_dT_ChqhzZvp5DSq_uhAg',
  );

  const [vcId, setVcId] = useState(
    'did:key:z6MkmgirJcXLvcyAQYHVougM3JpBcVtRAmCCTYWpmpC3H1ZS',
  );

  const isMetaMaskReady = isLocalSnap(defaultSnapOrigin)
    ? state.isFlask
    : state.snapsDetected;

  const handleConnectClick = async () => {
    try {
      await connectSnap();
      const installedSnap = await getSnap();

      dispatch({
        type: MetamaskActions.SetInstalled,
        payload: installedSnap,
      });
    } catch (e) {
      console.error(e);
      dispatch({ type: MetamaskActions.SetError, payload: e });
    }
  };

  const handleGetDidEthrClick = async () => {
    try {
      const did = await getDidEthr();
      console.log(did);
      setResponse(did);
    } catch (e) {
      console.error(e);
      dispatch({ type: MetamaskActions.SetError, payload: e });
    }
  };

  const handleGetDidKeyClick = async () => {
    try {
      const did = await getDidKey();
      console.log(did);
      setResponse(did);
    } catch (e) {
      console.error(e);
      dispatch({ type: MetamaskActions.SetError, payload: e });
    }
  };

  const handleIssueVcClick = async () => {
    try {
      if (!vcJwt) {
        throw new Error('Please enter a VC JWT');
      }
      await issueVc(vcJwt);
      setResponse('VC Issued');
    } catch (e) {
      console.error(e);
      dispatch({ type: MetamaskActions.SetError, payload: e });
    }
  };

  const handleGetVpClick = async () => {
    try {
      if (!vcId) {
        throw new Error('Please enter a VC JWT');
      }
      const vp = await getVp(vcId);
      setResponse(`VP Is this: ${vp}`);
    } catch (e) {
      console.error(e);
      dispatch({ type: MetamaskActions.SetError, payload: e });
    }
  };

  return (
    <Container>
      <Heading>
        Welcome to <Span>MetaSSI</Span>
      </Heading>
      <EmbeddedVideo />
      <Subtitle>
        Get started by Installing <code>Meta SSI</code>
      </Subtitle>
      <CardContainer>
        {response && (
          <ResponseTitle>{`RPC Reponse: ${response}`}</ResponseTitle>
          // <ErrorMessage>{`RPC Reponse: ${response}`}</ErrorMessage>
        )}

        {state.error && (
          <ErrorMessage>
            <b>An error happened:</b> {state.error.message}
          </ErrorMessage>
        )}
        {!isMetaMaskReady && (
          <Card
            content={{
              title: 'Install',
              description:
                'Snaps is pre-release software only available in MetaMask Flask, a canary distribution for developers with access to upcoming features.',
              button: <InstallFlaskButton />,
            }}
            fullWidth
          />
        )}
        {!state.installedSnap && (
          <Card
            content={{
              title: 'Connect',
              description:
                'Get started by connecting to and installing the MetaSSI snap.',
              button: (
                <ConnectButton
                  onClick={handleConnectClick}
                  disabled={!isMetaMaskReady}
                />
              ),
            }}
            disabled={!isMetaMaskReady}
          />
        )}
        {shouldDisplayReconnectButton(state.installedSnap) && (
          <Card
            content={{
              title: 'Reconnect',
              description:
                'While connected to a local running snap this button will always be displayed in order to update the snap if a change is made.',
              button: (
                <ReconnectButton
                  onClick={handleConnectClick}
                  disabled={!state.installedSnap}
                />
              ),
            }}
            disabled={!state.installedSnap}
          />
        )}
        <Card
          content={{
            title: 'Request User DID(Type: ethr)',
            description: 'Ask user for his did:ethr',

            button: (
              <SendHelloButton
                onClick={handleGetDidEthrClick}
                disabled={!state.installedSnap}
              />
            ),
          }}
          disabled={!state.installedSnap}
          fullWidth={
            state.isFlask &&
            Boolean(state.installedSnap) &&
            !shouldDisplayReconnectButton(state.installedSnap)
          }
        />

        <Card
          content={{
            title: 'Request User DID(Type: key)',
            description: 'Ask user for his did:key',

            button: (
              <SendHelloButton
                onClick={handleGetDidKeyClick}
                disabled={!state.installedSnap}
              />
            ),
          }}
          disabled={!state.installedSnap}
          fullWidth={
            state.isFlask &&
            Boolean(state.installedSnap) &&
            !shouldDisplayReconnectButton(state.installedSnap)
          }
        />
        <Card
          content={{
            title: 'Issue a Verifiable Credential',
            description:
              'Send user a verifiable credential which gets stored in his metamask',
            button: (
              <SendHelloButton
                onClick={handleIssueVcClick}
                disabled={!state.installedSnap}
              />
            ),
          }}
          disabled={!state.installedSnap}
          fullWidth={
            state.isFlask &&
            Boolean(state.installedSnap) &&
            !shouldDisplayReconnectButton(state.installedSnap)
          }
        />

        <Card
          content={{
            title: 'Get Verifiable Presentation',
            description:
              'Get Verifiable Presentation from User for a Verifiable Credential',
            button: (
              <SendHelloButton
                onClick={handleGetVpClick}
                disabled={!state.installedSnap}
              />
            ),
          }}
          disabled={!state.installedSnap}
          fullWidth={
            state.isFlask &&
            Boolean(state.installedSnap) &&
            !shouldDisplayReconnectButton(state.installedSnap)
          }
        />
        <Notice>
          <p></p>
        </Notice>
      </CardContainer>
    </Container>
  );
};

export default Index;
