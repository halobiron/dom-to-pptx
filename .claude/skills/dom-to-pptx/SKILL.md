```markdown
# dom-to-pptx Development Patterns

> Auto-generated skill from repository analysis

## Overview
This skill teaches you the coding conventions, structure, and workflows used in the `dom-to-pptx` JavaScript repository. The project focuses on converting DOM elements to PowerPoint (PPTX) files. It is a JavaScript codebase without a detected framework, and it emphasizes clean code organization, consistent naming, and modular exports/imports.

## Coding Conventions

### File Naming
- Use **camelCase** for file names.
  - Example: `convertDomToPptx.js`

### Import Style
- Use **relative imports** for modules within the project.
  - Example:
    ```javascript
    import { convertElement } from './convertElement.js';
    ```

### Export Style
- Use **named exports** to expose functions or constants.
  - Example:
    ```javascript
    // In convertElement.js
    export function convertElement(domNode) {
      // implementation
    }
    ```

### Commit Patterns
- Commit messages are **freeform** and typically short (average 12 characters).
  - Example: `fix bug`, `add test`, `update logic`

## Workflows

### Code Contribution
**Trigger:** When adding new features or fixing bugs  
**Command:** `/contribute`

1. Create a new JavaScript file using camelCase naming.
2. Write your code using named exports.
3. Import dependencies using relative paths.
4. Write or update corresponding test files (`*.test.*`).
5. Commit your changes with a short, descriptive message.
6. Push and create a pull request.

### Testing
**Trigger:** When you want to verify code correctness  
**Command:** `/test`

1. Identify or create test files matching the `*.test.*` pattern.
2. Run the test suite using the project's preferred method (framework unknown; check project documentation or scripts).
3. Review test results and fix any failing tests.

## Testing Patterns

- Test files follow the `*.test.*` naming convention.
  - Example: `convertDomToPptx.test.js`
- The testing framework is **unknown**; check for scripts or documentation for running tests.
- Tests are likely colocated with the modules they test or in a dedicated test directory.

## Commands
| Command      | Purpose                                   |
|--------------|-------------------------------------------|
| /contribute  | Steps for contributing code changes       |
| /test        | Steps for running and writing tests       |
```
