/**
 * Visit a given path as an authorized user
 */
// Cypress.Commands.add('authorizedVisit', (path?: string) => {
// 	cy.intercept('', '', {
// 		fixture: ''
// 	});

// 	cy.visit(path || '/');
// });

/**
 * Select a `data-testid` element by its exact key
 */
Cypress.Commands.add('getByTestId', (selector: string) => {
	return cy.get(`[data-testid=${selector}]`);
});

/**
 * Select a `data-testid` element by its approximate key
 */
Cypress.Commands.add('getByTestIdLike', (selector: string) => {
	return cy.get(`[data-testid*=${selector}]`);
});

/**
 * Assert element contains a given class
 */
Cypress.Commands.add(
	'containsClass',
	(selector: string, expectedClass: string) => {
		return cy.get(selector).should('satisfy', ($el) => {
			const classList = Array.from($el[0].classList);

			return classList.includes(expectedClass);
		});
	}
);

/**
 * Assert element does not contain a given class
 */
Cypress.Commands.add(
	'omitsClass',
	(selector: string, expectedClass: string) => {
		return cy.get(selector).should('satisfy', ($el) => {
			const classList = Array.from($el[0].classList);

			return !classList.includes(expectedClass);
		});
	}
);