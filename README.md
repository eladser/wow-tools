# WoW Tools 🏰

A comprehensive collection of tools for World of Warcraft players, including log analysis, mythic+ utilities, and raid management tools.

## 🚀 Features

- **WarcraftLogs Analyzer**: Detailed analysis of raid performance with damage, healing, and mechanic breakdowns
- **Mythic+ Tools**: Track seasonal progress, analyze routes, and compare performance
- **Raid Utilities**: Tools for raid leaders including roster management and strategy planning  
- **Raider.IO Integration**: View previous season scores and character progression

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with WoW-themed colors
- **Charts**: Chart.js with React Chart.js 2
- **Icons**: Lucide React
- **APIs**: WarcraftLogs API v2, Raider.IO API

## 🏃‍♂️ Getting Started

1. **Clone the repository**:
   ```bash
   git clone https://github.com/eladser/wow-tools.git
   cd wow-tools
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**:
   Create a `.env.local` file in the root directory:
   ```env
   WARCRAFTLOGS_CLIENT_ID=your_client_id
   WARCRAFTLOGS_CLIENT_SECRET=your_client_secret
   NEXT_PUBLIC_RAIDERIO_API_URL=https://raider.io/api/v1
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
wow-tools/
├── app/                    # Next.js App Router pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── logs/              # WarcraftLogs analyzer
│   └── mythic-plus/       # M+ tools
├── components/            # Reusable React components
├── lib/                   # Utility functions and API clients
├── public/               # Static assets
└── types/                # TypeScript type definitions
```

## 🔧 API Integration

### WarcraftLogs API

To use the WarcraftLogs integration:

1. Register at [WarcraftLogs](https://www.warcraftlogs.com/api/clients/)
2. Create a new client application
3. Add your credentials to `.env.local`

### Raider.IO API

The Raider.IO API is publicly available and doesn't require authentication for basic endpoints.

## 🎨 Styling

The project uses a WoW-themed color palette:

- **WoW Blue**: `#00b4ff` - Primary actions and links
- **WoW Gold**: `#f4c430` - Titles and highlights  
- **WoW Purple**: `#a335ee` - Epic items and special features
- **WoW Orange**: `#ff8000` - Legendary items and warnings
- **WoW Green**: `#1eff00` - Success states and uncommon items

## 🚧 Development Status

- ✅ Project setup and basic structure
- ✅ Home page with tool overview
- 🚧 WarcraftLogs analyzer (In Progress)
- 🚧 Mythic+ tools (In Progress)
- 📋 Raid utilities (Planned)
- 📋 Raider.IO integration (Planned)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

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

---

**Note**: This project is not affiliated with or endorsed by Blizzard Entertainment. World of Warcraft is a trademark of Blizzard Entertainment, Inc.
