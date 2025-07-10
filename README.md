# WoW Tools 🏰

A comprehensive collection of tools for World of Warcraft players, including warband analysis, log analysis, mythic+ utilities, and raid management tools.

**🌐 Live Demo**: [https://eladser.github.io/wow-tools](https://eladser.github.io/wow-tools)

## 🚀 Features

### 🏆 Enhanced Mythic+ Tools
- **Warband Analysis**: Automatically discover and analyze all characters in your warband
- **Highest Scores by Season**: Track the best M+ scores across all your characters for each season
- **WarcraftLogs Integration**: Direct links to M+ logs that match your best run dates
- **URL Support**: Paste Raider.IO URLs directly for instant character lookup
- **Complete Season History**: View progression across all M+ seasons from BFA to current

### 📊 WarcraftLogs Analyzer
- **Comprehensive Fight Analysis**: Detailed breakdown of each raid encounter
- **DPS/HPS Rankings**: Complete performance metrics with role-specific analysis
- **Fight-by-Fight Comparison**: Compare performance across multiple encounters
- **Deep Dive Integration**: Direct links to WarcraftLogs for advanced analysis
- **Kill vs. Wipe Analysis**: Track progression with detailed attempt breakdowns

### 👥 Raid Utilities
- **Multi-Roster Management**: Create and manage multiple raid rosters
- **Role-Based Organization**: Track tanks, healers, and DPS with attendance
- **Strategy Planning**: Boss-specific strategies with priority assignments
- **Attendance Tracking**: Monitor raid member participation
- **Status Management**: Track confirmed/tentative/declined responses

### 🔗 Advanced Integrations
- **Raider.IO API**: Complete integration with character profiles and M+ data
- **WarcraftLogs API v2**: Full GraphQL integration for raid analysis
- **URL Parsing**: Support for Raider.IO URLs with auto-detection
- **Cross-Platform Links**: Seamless integration with external tools

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
│   ├── mythic-plus/       # M+ tools with warband analysis
│   └── raid-utilities/    # Raid management tools
├── lib/                   # API clients and utilities
│   ├── warcraftlogs.ts    # WarcraftLogs API client
│   └── raiderio.ts        # Raider.IO API client with warband support
├── .github/workflows/     # GitHub Actions
├── public/               # Static assets
└── out/                  # Build output (generated)
```

## 🔧 API Integration

### WarcraftLogs API
- **Authentication**: OAuth2 Client Credentials
- **GraphQL**: v2 API with comprehensive raid data
- **Features**: Report analysis, damage/healing metrics, fight breakdowns
- **Integration**: Direct linking from M+ runs to potential logs

### Raider.IO API
- **Authentication**: None required for basic endpoints
- **REST API**: Character profiles, M+ scores, guild data
- **Features**: Character lookup, seasonal scores, dungeon runs, warband discovery
- **URL Support**: Parse and auto-fill from Raider.IO profile URLs

## 🎨 Styling

The project uses a WoW-themed color palette:

- **WoW Blue**: `#00b4ff` - Primary actions and links
- **WoW Gold**: `#f4c430` - Titles and highlights  
- **WoW Purple**: `#a335ee` - Epic items and special features
- **WoW Orange**: `#ff8000` - Legendary items and warnings
- **WoW Green**: `#1eff00` - Success states and uncommon items

## 🚧 Development Status

- ✅ **Enhanced M+ Tools**: Warband analysis, WarcraftLogs integration, URL support
- ✅ **WarcraftLogs Analyzer**: Comprehensive fight analysis with rankings
- ✅ **Raid Utilities**: Roster management, strategy planning, attendance tracking
- ✅ **Modern UI**: WoW-themed responsive design with enhanced UX
- 🚧 **Advanced Features**: Guild analytics, achievement tracking
- 📋 **Mobile App**: Native mobile application (Planned)

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

## 📋 Feature Highlights

### 🏰 Warband Analysis
- **Auto-Discovery**: Finds alternative characters using naming patterns
- **Cross-Character Analysis**: Highest M+ scores across all characters by season
- **Performance Tracking**: Identifies main vs. alt character progression
- **WarcraftLogs Integration**: Links to logs for current season best runs

### 📊 Comprehensive Analytics
- **Season-by-Season Breakdown**: Complete historical M+ progression
- **Role-Based Performance**: Tank, healer, and DPS specific metrics
- **Fight Analysis**: Detailed raid encounter breakdowns
- **External Integration**: Seamless links to WarcraftLogs and Raider.IO

### 👥 Raid Management
- **Multiple Rosters**: Support for different raid teams and difficulties
- **Strategy Planning**: Boss-specific notes with priority assignments
- **Attendance System**: Track member participation and reliability
- **Status Management**: Handle confirmations, tentatives, and declines

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
