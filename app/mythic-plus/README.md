# Mythic+ Tools

This directory contains the Mythic+ tools implementation for the WoW Tools project, featuring Raider.IO integration for character profiles and weekly affix tracking.

## Features

### ✨ Current Features
- **Character Profile Lookup**: Search any character by name, realm, and region
- **Seasonal Scores**: View current and historical Mythic+ ratings
- **Run History**: Display recent runs, best runs, and highest level completions
- **Weekly Affixes**: Automatically display current week's affixes for any region
- **Score Breakdown**: Per-role score analysis (Tank, Healer, DPS)
- **Time Analysis**: Completion times with keystone upgrade indicators
- **Responsive Design**: Mobile-friendly interface with WoW-themed styling

### 🔧 Technical Features
- **API Proxying**: Server-side API routes to handle CORS and caching
- **Caching**: Optimized caching for character data (5 minutes) and affixes (1 hour)
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Loading States**: Proper loading indicators and disabled states
- **TypeScript**: Full type safety throughout the application

## File Structure

```
app/mythic-plus/
├── page.tsx                          # Main mythic+ page
├── components/
│   ├── CharacterProfile.tsx          # Character profile display component
│   └── CurrentAffixes.tsx            # Weekly affixes display component
└── README.md                         # This file

app/api/
├── character/
│   └── route.ts                      # Character profile API proxy
└── affixes/
    └── route.ts                      # Weekly affixes API proxy

lib/
└── raiderio.ts                       # Raider.IO API integration library
```

## API Integration

### Character Profiles
- **Endpoint**: `/api/character`
- **Parameters**: `region`, `realm`, `name`, `fields`
- **Cache**: 5 minutes
- **Data**: Scores, runs, achievements, character info

### Weekly Affixes
- **Endpoint**: `/api/affixes`
- **Parameters**: `region`
- **Cache**: 1 hour
- **Data**: Affix details, descriptions, weekly rotation

## Usage Examples

### Character Lookup
```tsx
import { getCharacterProfile } from '@/lib/raiderio';

const character = await getCharacterProfile('us', 'stormrage', 'charactername');
```

### Get Current Affixes
```tsx
import { getCurrentAffixes } from '@/lib/raiderio';

const affixes = await getCurrentAffixes('us');
```

## Components

### CharacterProfile
Displays comprehensive character information including:
- Character thumbnail and basic info
- Current season mythic+ score
- Score breakdown by role
- Recent runs with times and upgrades
- Best runs for each dungeon
- Highest level completions

### CurrentAffixes
Shows the current week's mythic+ affixes with:
- Visual affix icons
- Detailed descriptions
- Keystone level requirements
- Color-coded difficulty indicators

## Styling

The components use Tailwind CSS with custom WoW-themed classes:
- `tool-card`: Standard card styling
- `wow-button`: WoW-themed button styling
- `wow-input`: WoW-themed input styling
- Color utilities for score tiers and keystone upgrades

## Score Color System

- **Orange (3000+)**: Cutting Edge
- **Pink (2500+)**: Elite
- **Purple (2000+)**: Duelist
- **Blue (1500+)**: Rival
- **Green (1000+)**: Challenger
- **Yellow (500+)**: Combatant
- **Gray (<500)**: Unranked

## Keystone Upgrade Colors

- **Gold**: 3 upgrades (++/+++)
- **Silver**: 2 upgrades (++)
- **Bronze**: 1 upgrade (+)
- **Red**: No upgrades (depleted)

## Error Handling

The system handles various error scenarios:
- Character not found (404)
- Invalid realm/region combinations
- API rate limiting
- Network connectivity issues
- Malformed API responses

## Future Enhancements

### Planned Features
- **Dungeon Leaderboards**: Top runs for each dungeon
- **Route Planning**: Interactive dungeon maps with optimal routes
- **Team Composition Analysis**: Success rates by group composition
- **Seasonal Comparisons**: Multi-season performance tracking
- **Push Notifications**: Weekly affix change notifications
- **Guild Integration**: Guild-wide mythic+ analytics

### Technical Improvements
- **Offline Support**: PWA capabilities with cached data
- **Real-time Updates**: WebSocket integration for live data
- **Advanced Caching**: Redis integration for better performance
- **Rate Limiting**: Client-side rate limiting for API calls
- **Bulk Operations**: Multi-character comparison tools

## Contributing

When adding new features to the Mythic+ tools:

1. **Follow the existing patterns**: Use the established component structure
2. **Type safety**: Ensure all new code is properly typed
3. **Error handling**: Add comprehensive error handling
4. **Responsive design**: Test on mobile devices
5. **Performance**: Consider caching and optimization
6. **User experience**: Add loading states and clear feedback

## API Limits

Raider.IO has rate limits:
- **300 requests per minute** for character profiles
- **100 requests per minute** for other endpoints

Our caching strategy helps minimize API calls while providing fresh data.
