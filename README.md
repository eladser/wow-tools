# WoW Tools 🏰

A comprehensive collection of tools for World of Warcraft players, including log analysis, mythic+ utilities, and raid management tools.

**🌐 Live Demo**: [https://eladser.github.io/wow-tools](https://eladser.github.io/wow-tools)

## 🚀 Features

- **WarcraftLogs Analyzer**: Detailed analysis of raid performance with damage, healing, and mechanic breakdowns
- **Mythic+ Tools**: Track seasonal progress, analyze routes, and compare performance
- **Raid Utilities**: Tools for raid leaders including roster management and strategy planning  
- **Raider.IO Integration**: View previous season scores and character progression

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router (Static Export)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with WoW-themed colors
- **Charts**: Chart.js with React Chart.js 2
- **Icons**: Lucide React
- **APIs**: WarcraftLogs API v2, Raider.IO API
- **Deployment**: GitHub Pages with GitHub Actions

## 🏃‍♂️ Getting Started

### Local Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/eladser/wow-tools.git
   cd wow-tools
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your API keys (optional for development)
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

### GitHub Pages Deployment

This project is configured for automatic deployment to GitHub Pages:

1. **Enable GitHub Pages** in your repository settings:
   - Go to Settings → Pages
   - Source: "GitHub Actions"

2. **Set up Repository Secrets**:
   - Go to Settings → Secrets and variables → Actions
   - Add the following secrets:
     - `WARCRAFTLOGS_CLIENT_ID`: Your WarcraftLogs client ID
     - `WARCRAFTLOGS_CLIENT_SECRET`: Your WarcraftLogs client secret

3. **Deploy**: Push to the `main` branch to trigger automatic deployment

The site will be available at: `https://yourusername.github.io/wow-tools`

## 📁 Project Structure

```
wow-tools/
├── app/                    # Next.js App Router pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── logs/              # WarcraftLogs analyzer
│   └── mythic-plus/       # M+ tools
├── lib/                   # API clients and utilities
│   ├── warcraftlogs.ts    # WarcraftLogs API client
│   └── raiderio.ts        # Raider.IO API client
├── .github/workflows/     # GitHub Actions
├── public/               # Static assets
└── out/                  # Build output (generated)
```

## 🔧 API Integration

### WarcraftLogs API
- **Authentication**: OAuth2 Client Credentials
- **GraphQL**: v2 API with comprehensive raid data
- **Features**: Report analysis, damage/healing metrics, fight breakdowns

### Raider.IO API
- **Authentication**: None required for basic endpoints
- **REST API**: Character profiles, M+ scores, guild data
- **Features**: Character lookup, seasonal scores, dungeon runs

## 🎨 Styling

The project uses a WoW-themed color palette:

- **WoW Blue**: `#00b4ff` - Primary actions and links
- **WoW Gold**: `#f4c430` - Titles and highlights  
- **WoW Purple**: `#a335ee` - Epic items and special features
- **WoW Orange**: `#ff8000` - Legendary items and warnings
- **WoW Green**: `#1eff00` - Success states and uncommon items

## 🚧 Development Status

- ✅ Project setup and GitHub Pages deployment
- ✅ WoW-themed UI with responsive design
- ✅ API clients for WarcraftLogs and Raider.IO
- ✅ Home page with tool overview
- 🚧 WarcraftLogs analyzer (API integration ready)
- 🚧 Mythic+ tools (API integration ready)
- 📋 Raid utilities (Planned)
- 📋 Advanced data visualization (Planned)

## 🔒 Environment Variables

```bash
# WarcraftLogs API (required for log analysis)
WARCRAFTLOGS_CLIENT_ID=your_client_id
WARCRAFTLOGS_CLIENT_SECRET=your_client_secret

# Raider.IO API (no auth required)
NEXT_PUBLIC_RAIDERIO_API_URL=https://raider.io/api/v1
```

## 🚀 Deployment

### Automatic Deployment (Recommended)
- Push to `main` branch triggers GitHub Actions
- Builds and deploys to GitHub Pages automatically
- Environment variables injected from repository secrets

### Manual Deployment
```bash
npm run build
npm run deploy
```

## 🤝 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [WarcraftLogs](https://www.warcraftlogs.com/) for providing combat log analysis
- [Raider.IO](https://raider.io/) for mythic+ and raid progression data
- [Blizzard Entertainment](https://www.blizzard.com/) for creating World of Warcraft

## 🔗 Links

- **Live Site**: [https://eladser.github.io/wow-tools](https://eladser.github.io/wow-tools)
- **Repository**: [https://github.com/eladser/wow-tools](https://github.com/eladser/wow-tools)
- **Issues**: [https://github.com/eladser/wow-tools/issues](https://github.com/eladser/wow-tools/issues)

---

**Note**: This project is not affiliated with or endorsed by Blizzard Entertainment. World of Warcraft is a trademark of Blizzard Entertainment, Inc.
