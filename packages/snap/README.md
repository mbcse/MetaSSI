
Project Title: Meta SSI: Decentralized Identity Plugin for MetaMask

Description:
Meta SSI is a MetaMask plugin extension designed to enhance the user experience in managing and interacting with Decentralized Identifiers (DIDs) in a transparent and seamless manner. In an era of increasing decentralization, where self-sovereign identities play a pivotal role for both users and organizations, this plugin serves as a bridge to simplify and streamline DID interactions. The primary goal is to eliminate the need for users to install additional extensions or visit new websites, as everything can be handled within the MetaMask ecosystem.

The Meta SSI plugin leverages the MetaMask snap feature to extend MetaMask's functionality, providing users with the tools they need to work with DIDs, credentials, and identity-related tasks. This project has introduced RPC endpoints that enable various operations within the MetaMask environment, allowing users to hold, manage, and share their DIDs and credentials effortlessly.

RPC Endpoints:

RPC Endpoint: get DID ether

Description: This endpoint is used to request an Ethereum-based DID from the user. When invoked by a website or organization, it triggers a pop-up in the user's MetaMask wallet, asking for their permission to share their DID. If approved, the DID is returned as a response to the RPC request.
Usage: wallet_invoke_snap(method: "get DID ether")
RPC Endpoint: issue VC (Verify Credential)

Description: This endpoint enables websites or organizations to issue verifiable credentials directly to the user's MetaMask wallet. The issued credential is securely stored within the MetaMask state, eliminating the need for users to manage it externally.
Usage: wallet_invoke_snap(method: "issue VC")
RPC Endpoint: get VP (Verify Presentation)

Description: Websites or organizations can use this endpoint to request a verifiable presentation of a specific credential from the user. The verifiable presentation is retrieved from the user's MetaMask wallet, allowing seamless verification of the credential.
Usage: wallet_invoke_snap(method: "get VP", VC_ID: "unique_credential_id")
Meta SSI aims to provide users with a unified and intuitive experience for managing their DIDs and credentials, enhancing security and eliminating the need for additional extensions or third-party websites. The project is built on top of the Onix SDK and ensures the secure storage of private keys within the MetaMask environment. With Meta SSI, the world of self-sovereign identity becomes more accessible and user-friendly, paving the way for decentralized identity adoption.