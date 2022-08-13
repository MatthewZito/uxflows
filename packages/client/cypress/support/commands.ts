interface GQLResponse<T> {
	data: T;
	errors?: {
		message: string;
		extensions: {
			code: string;
		};
	}[];
}

/**
 * Select a `data-testid` element by its exact key
 */
Cypress.Commands.add('getByTestId', (selector: string) => cy.get(`[data-testid=${selector}]`));

/**
 * Select a `data-testid` element by its approximate key
 */
Cypress.Commands.add('getByTestIdLike', (selector: string) => cy.get(`[data-testid*=${selector}]`));

/**
 * Assert element contains a given class
 */
Cypress.Commands.add(
	'containsClass',
	(selector: string, expectedClass: string) => cy.get(selector).should('satisfy', ($el: Element[]) => {
			const classList = Array.from<string>($el[0].classList);

			return classList.includes(expectedClass);
		})
);

/**
 * Assert element does not contain a given class
 */
Cypress.Commands.add(
	'omitsClass',
	(selector: string, expectedClass: string) => cy.get(selector).should('satisfy', ($el: Element[]) => {
			const classList = Array.from<string>($el[0].classList);

			return !classList.includes(expectedClass);
		})
);

Cypress.Commands.add(
	'interceptGQL',
	<T>(
		url: string,
		operation: string,
		data: GQLResponse<T>,
		alias?: string
	): Cypress.cy => {
		const previous = Cypress.config('interceptions');
		const alreadyRegistered = url in previous;

		const next = {
			...(previous[url] || {}),
			[operation]: { alias, data }
		};

		Cypress.config('interceptions' as keyof Cypress.TestConfigOverrides, {
			...previous,
			[url]: next
		});

		if (alreadyRegistered) {
			return cy;
		}

		cy.intercept('POST', url, (req) => {
			const interceptions = Cypress.config('interceptions');

			// @see https://graphql.org/learn/serving-over-http/#post-request
			// "operationName is only required if multiple operations are present in the query."
			const match = req.body.operationName
				? interceptions[url][req.body.operationName]
				: interceptions[url][operation];

			if (match) {
				// req.alias = match.alias;
				req.reply({ body: match.data });
			}
		});

		return cy;
	}
);
