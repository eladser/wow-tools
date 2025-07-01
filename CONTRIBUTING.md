# Contributing to WoW Tools

Thank you for your interest in contributing to WoW Tools! This document provides guidelines for contributing to the project.

## 🚀 Getting Started

1. **Fork the repository** and clone it locally
2. **Install dependencies**: `npm install`
3. **Set up environment variables**: Copy `.env.example` to `.env.local` and configure your API keys
4. **Run the development server**: `npm run dev`

## 🛠️ Development Workflow

1. **Create a new branch** for your feature: `git checkout -b feature/amazing-feature`
2. **Make your changes** following the coding standards below
3. **Test your changes** thoroughly
4. **Commit your changes**: `git commit -m 'Add amazing feature'`
5. **Push to your branch**: `git push origin feature/amazing-feature`
6. **Open a Pull Request** with a clear description of your changes

## 📝 Coding Standards

### TypeScript
- Use TypeScript for all new files
- Ensure proper type definitions
- Avoid `any` types when possible

### React/Next.js
- Use functional components with hooks
- Follow Next.js App Router conventions
- Use proper error boundaries

### Styling
- Use Tailwind CSS for styling
- Follow the WoW-themed color palette
- Use the predefined component classes (`.tool-card`, `.wow-button`, etc.)

### API Integration
- Use proper error handling
- Implement rate limiting considerations
- Follow REST API conventions

## 🎯 Areas for Contribution

### High Priority
- **WarcraftLogs Integration**: Implement OAuth2 and GraphQL queries
- **Raider.IO Integration**: Add character lookup and M+ analysis
- **Data Visualization**: Create charts for performance metrics
- **Mobile Responsiveness**: Improve mobile experience

### Medium Priority
- **Caching Layer**: Implement Redis or similar for API responses
- **User Authentication**: Add user accounts and saved configurations
- **Export Features**: Allow exporting reports to PDF/Excel
- **Dark/Light Theme**: Additional theme options

### Low Priority
- **Internationalization**: Add support for multiple languages
- **Progressive Web App**: Add PWA features
- **Performance Optimization**: Bundle size optimization
- **Accessibility**: Improve screen reader support

## 🔧 API Keys Setup

### WarcraftLogs
1. Go to [WarcraftLogs API Clients](https://www.warcraftlogs.com/api/clients/)
2. Create a new client application
3. Add the client ID and secret to your `.env.local`

### Raider.IO
The Raider.IO API doesn't require authentication for basic endpoints, but rate limiting applies.

## 🧪 Testing

- Write unit tests for utility functions
- Test API integrations with mock data
- Ensure responsive design across devices
- Test with real WoW data when possible

## 📋 Pull Request Guidelines

### Title Format
- Use descriptive titles: "Add WarcraftLogs OAuth integration"
- Reference issues: "Fix #123: Resolve M+ score calculation"

### Description Template
```markdown
## Description
Brief description of what this PR does.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tested locally
- [ ] Added unit tests
- [ ] Tested with real API data

## Screenshots (if applicable)
Add screenshots to help explain your changes.
```

## 🐛 Bug Reports

When reporting bugs, please include:
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots/logs if applicable
- Browser/device information

## 💡 Feature Requests

When requesting features, please include:
- Use case description
- Proposed solution
- Alternative solutions considered
- Additional context

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [WarcraftLogs API Documentation](https://www.warcraftlogs.com/api/docs)
- [Raider.IO API Documentation](https://raider.io/api)

## 🎮 WoW-Specific Guidelines

- Use proper WoW terminology (e.g., "Mythic+" not "M++" or "Mythic Plus")
- Follow Blizzard's naming conventions for spells, items, and mechanics
- Respect rate limits for game APIs
- Consider different regions (US, EU, KR, TW) in implementations

## 📞 Questions?

If you have questions about contributing, feel free to:
- Open an issue with the "question" label
- Start a discussion in the repository
- Contact the maintainers

Thank you for contributing to WoW Tools! 🏰
