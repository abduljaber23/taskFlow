describe("template spec", () => {
  it("User story", () => {
    const randomName = `project${Math.floor(Math.random() * 10000)}`;
    const randomEmail = `user${Math.floor(Math.random() * 10000)}@test.com`;
    // Register
    cy.visit("http://localhost:3000/");
    cy.url().should("include", "/login");
    cy.visit("http://localhost:3000/register");
    cy.get('input[name="username"]').type(randomEmail);
    cy.get('input[name="email"]').type(randomEmail);
    cy.get('input[name="password"]').type("test");
    cy.get('button[type="submit"]').click();

    cy.url().should("include", "/login");

    // Login
    cy.get('input[name="email"]').type("test@example.com");
    cy.get('input[name="password"]').type("test");
    cy.get('button[type="submit"]').click();
    cy.url().should("include", "/");
    // Create project
    cy.get('[data-cy="create-project-btn"]').click();
    cy.get('[data-cy="project-name"]').type(randomName);
    cy.get('[data-cy="project-description"]').type("Description du projet");
    cy.get('[data-cy="project-status"]').select("public");
    cy.get('[data-cy="project-save"]').click();

    // view project
    cy.get('[data-cy="view-project-btn"]').first().click();

    // Create column
    cy.get('[data-cy="column-name"]').type("Column 1");
    cy.get('[data-cy="column-save"]').click();

    // Create task
    cy.get('[data-cy="add-task-btn"]').first().click();
    cy.get('[data-cy="task-name"]').type("Task 1");
    cy.get('[data-cy="task-priority"]').select("medium");
    cy.get('[data-cy="task-save"]').click();

    cy.get('[data-cy="task-checkbox"]').first().check();
    cy.get('[data-cy="task-delete"]').first().click();
    cy.get('[data-cy="delete-column-btn"]').first().click();

    cy.visit("http://localhost:3000/");
    cy.get('[data-cy="delete-project-btn"]').first().click();

    // Logout
    cy.get('[data-cy="user-avatar-btn"]').click();
    cy.get('[data-cy="logout-btn"]').click();
    cy.url().should("include", "/login");
  });
});
