# API routes removed for GitHub Pages static export

Since GitHub Pages only supports static files, we've removed the server-side API routes and moved to client-side API calls.

## WarcraftLogs Integration
- Client-side OAuth2 authentication
- GraphQL queries handled in the browser
- See `lib/warcraftlogs.ts` for implementation

## Raider.IO Integration  
- Direct API calls from the browser
- No authentication required for basic endpoints
- See `lib/raiderio.ts` for implementation

This approach allows the site to work on GitHub Pages while still providing full API functionality.
