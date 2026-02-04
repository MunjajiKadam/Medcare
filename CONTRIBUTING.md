# Contributing to MedCare

Thank you for your interest in contributing to MedCare! This document provides guidelines and instructions for contributing to the project.

## Table of Contents
1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Workflow](#development-workflow)
4. [Coding Standards](#coding-standards)
5. [Commit Guidelines](#commit-guidelines)
6. [Pull Request Process](#pull-request-process)
7. [Bug Reports](#bug-reports)
8. [Feature Requests](#feature-requests)

---

## Code of Conduct

### Our Pledge
We are committed to providing a welcoming and inclusive environment for all contributors.

### Expected Behavior
- Be respectful and considerate
- Use welcoming and inclusive language
- Accept constructive criticism gracefully
- Focus on what's best for the community
- Show empathy towards others

### Unacceptable Behavior
- Harassment or discriminatory language
- Trolling or insulting comments
- Public or private harassment
- Publishing others' private information
- Other unprofessional conduct

---

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MySQL (v8 or higher)
- Git
- Basic knowledge of React and Node.js

### Setup Development Environment

1. **Fork the Repository**
   ```bash
   # Fork on GitHub, then clone your fork
   git clone https://github.com/your-username/MedCare.git
   cd MedCare
   ```

2. **Add Upstream Remote**
   ```bash
   git remote add upstream https://github.com/original-owner/MedCare.git
   ```

3. **Install Dependencies**
   ```bash
   # Backend
   cd backend
   npm install

   # Frontend
   cd ../vite-project
   npm install
   ```

4. **Set Up Database**
   ```bash
   mysql -u root -p < backend/database.sql
   mysql -u root -p medcare_db < backend/final-data.sql
   ```

5. **Configure Environment**
   - Copy `.env.example` to `.env` in both backend and frontend
   - Update with your local configuration

---

## Development Workflow

### Branch Naming Convention

- `feature/feature-name` - New features
- `bugfix/bug-description` - Bug fixes
- `hotfix/critical-issue` - Critical fixes
- `docs/documentation-update` - Documentation
- `refactor/code-improvement` - Code refactoring

### Workflow Steps

1. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**
   - Write clean, documented code
   - Follow coding standards
   - Test your changes

3. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat: add new feature description"
   ```

4. **Keep Updated**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

5. **Push Changes**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create Pull Request**
   - Go to GitHub
   - Create PR from your fork to main repository
   - Fill in PR template

---

## Coding Standards

### JavaScript/React Style Guide

**General Rules:**
- Use ES6+ features (arrow functions, destructuring, etc.)
- Use 2 spaces for indentation
- Use single quotes for strings
- Add semicolons at end of statements
- Use meaningful variable names
- Keep functions small and focused

**React Specific:**
```javascript
// Component naming: PascalCase
const MyComponent = () => {
  // Hooks at the top
  const [state, setState] = useState(null);
  
  // Event handlers: handleXxx
  const handleClick = () => {
    // Implementation
  };
  
  // JSX with proper formatting
  return (
    <div className="container">
      <button onClick={handleClick}>
        Click Me
      </button>
    </div>
  );
};

export default MyComponent;
```

**Node.js/Express:**
```javascript
// Controller functions
export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Use async/await over promises
// Add proper error handling
// Validate input data
```

### CSS/Tailwind Standards

```jsx
// Use Tailwind utility classes
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
  <h2 className="text-xl font-semibold text-gray-800">Title</h2>
</div>

// For complex/repeated styles, create components
// Keep classes organized: layout → spacing → colors → typography
```

### SQL Standards

```sql
-- Use uppercase for SQL keywords
-- Lowercase for table/column names
-- Proper indentation
SELECT u.name, d.specialization
FROM users u
INNER JOIN doctors d ON u.id = d.user_id
WHERE u.role = 'doctor'
  AND u.status = 'active'
ORDER BY u.name;
```

### File Organization

```
components/
  ├── ComponentName.jsx      # Component file
  ├── ComponentName.test.jsx # Test file (if applicable)
  └── ComponentName.css      # Styles (if not using Tailwind)

controllers/
  ├── userController.js      # Clear, descriptive names
  └── authController.js      # Group related functionality
```

---

## Commit Guidelines

### Commit Message Format

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```bash
feat(auth): add password reset functionality

Implement password reset via email with token verification.
Users can request reset link and set new password.

Closes #123

---

fix(appointments): resolve double booking issue

Fixed race condition allowing multiple bookings at same time slot.
Added database-level constraint and validation.

Fixes #456

---

docs(api): update authentication endpoint documentation

Add examples for all auth endpoints and clarify token usage.
```

### Good Commit Practices

- ✅ Clear, descriptive messages
- ✅ Present tense ("add" not "added")
- ✅ Imperative mood ("move" not "moves")
- ✅ Reference issues/PRs when applicable
- ❌ Avoid vague messages like "fix bug" or "update"
- ❌ Don't commit commented-out code
- ❌ Avoid committing unrelated changes together

---

## Pull Request Process

### Before Creating PR

- [ ] Code follows project style guidelines
- [ ] All tests pass
- [ ] No console.log() or debugging code
- [ ] Documentation updated if needed
- [ ] Commits follow commit guidelines
- [ ] Branch is up to date with main

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How has this been tested?

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
```

### Review Process

1. **Automated Checks**
   - Linting passes
   - Tests pass
   - Build succeeds

2. **Code Review**
   - At least one approval required
   - Address all review comments
   - Make requested changes

3. **Merge**
   - Squash and merge (preferred)
   - Delete branch after merge

---

## Bug Reports

### Before Reporting

1. Check existing issues
2. Verify it's reproducible
3. Test on latest version

### Bug Report Template

```markdown
**Description**
Clear description of the bug

**To Reproduce**
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior**
What should happen

**Screenshots**
If applicable

**Environment**
- OS: [e.g., Windows 10]
- Browser: [e.g., Chrome 120]
- Node version: [e.g., 18.17.0]

**Additional Context**
Any other relevant information
```

---

## Feature Requests

### Feature Request Template

```markdown
**Feature Description**
Clear description of the proposed feature

**Problem It Solves**
What problem does this address?

**Proposed Solution**
How should it work?

**Alternatives Considered**
Other approaches you've thought about

**Additional Context**
Mockups, examples, etc.
```

---

## Development Tips

### Local Testing

```bash
# Run backend tests
cd backend
npm test

# Run frontend tests
cd vite-project
npm test

# Lint code
npm run lint
```

### Database Changes

- Always create migration files
- Test migrations up and down
- Update `database.sql` for new installs
- Document schema changes

### API Changes

- Update API documentation
- Maintain backward compatibility when possible
- Version breaking changes
- Update Postman/Thunder Client collections

---

## Questions?

If you have questions:
- Check existing documentation
- Search closed issues
- Ask in discussions
- Email: dev@medcare.com

---

## Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Acknowledged in release notes
- Appreciated greatly! 🎉

Thank you for contributing to MedCare!
