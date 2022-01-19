const BareUserTransputType = `
	userImage: String
	username: String
	uuid: String
`;

export const typeDefs = `
	type User {
		${BareUserTransputType}
	}

	input UserInput {
		${BareUserTransputType}
	}

	type Message {
		message: String
		timestamp: String
		user: User
		uuid: ID
	}

	type Query {
		getAllMessages: [Message]
		getMessage(id: ID!): Message
	}

	type Subscription {
		messages: [Message]
	}

	type Mutation {
		addMessage(message: String, user: UserInput, timestamp: String): ID
		updateMessage(uuid: ID, message: String, timestamp: String): [ID]
	}
`;
