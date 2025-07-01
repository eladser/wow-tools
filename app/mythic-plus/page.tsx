"use client"

import { useState } from 'react'
import { Clock, Trophy, Users, MapPin, Search, AlertCircle, History } from 'lucide-react'
import { RaiderIOCharacter, getCharacterProfileWithAllSeasons } from '@/lib/raiderio'
import CharacterProfile from './components/CharacterProfile'
import CurrentAffixes from './components/CurrentAffixes'
import SeasonHistory from './components/SeasonHistory'
import ExternalLinks from './components/ExternalLinks'

export default function MythicPlusPage() {
  const [characterName, setCharacterName] = useState('')
  const [realm, setRealm] = useState('')
  const [region, setRegion] = useState('us')
  const [character, setCharacter] = useState<RaiderIOCharacter | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showFullHistory, setShowFullHistory] = useState(false)

  const handleLookup = async () => {
    if (!characterName.trim() || !realm.trim()) {
      setError('Please enter both character name and realm')
      return
    }

    setLoading(true)
    setError(null)
    setCharacter(null)
    setShowFullHistory(false)

    try {
      // Get character with ALL season history
      const characterData = await getCharacterProfileWithAllSeasons(region, realm.trim(), characterName.trim())
      setCharacter(characterData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch character data')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLookup()
    }
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-wow-purple">
          Mythic+ Tools
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Track your mythic+ progress, analyze seasonal performance, and explore historical data with comprehensive Raider.IO integration
        </p>
      </div>

      {/* Current Affixes - Always visible */}
      <CurrentAffixes region={region} />

      {/* Character Lookup Form */}
      <div className="tool-card max-w-2xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">Character Lookup</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Character Name</label>
              <input
                type="text"
                placeholder="Character name"
                value={characterName}
                onChange={(e) => setCharacterName(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full wow-input"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Realm</label>
              <input
                type="text"
                placeholder="Realm name"
                value={realm}
                onChange={(e) => setRealm(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full wow-input"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Region</label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full wow-input"
                disabled={loading}
              >
                <option value="us">US</option>
                <option value="eu">EU</option>
                <option value="kr">KR</option>
                <option value="tw">TW</option>
              </select>
            </div>
          </div>
          
          {error && (
            <div className="flex items-center space-x-2 text-red-400 bg-red-900/20 p-3 rounded-lg">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            onClick={handleLookup}
            disabled={!characterName.trim() || !realm.trim() || loading}
            className="w-full wow-button disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Loading Complete History...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Look Up Character</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Character Profile and Extended Features */}
      {character && (
        <div className="space-y-8">
          {/* Current Season Profile */}
          <CharacterProfile character={character} />
          
          {/* External Links */}
          <ExternalLinks character={character} />
          
          {/* Season History Toggle */}
          {character.mythic_plus_scores_by_season && character.mythic_plus_scores_by_season.length > 1 && (
            <div className="text-center">
              <button
                onClick={() => setShowFullHistory(!showFullHistory)}
                className="wow-button flex items-center space-x-2 mx-auto"
              >
                <History className="w-4 h-4" />
                <span>
                  {showFullHistory ? 'Hide' : 'View'} Complete Season History 
                  ({character.mythic_plus_scores_by_season.length} seasons)
                </span>
              </button>
            </div>
          )}
          
          {/* Season History */}
          {showFullHistory && (
            <SeasonHistory character={character} />
          )}
        </div>
      )}

      {/* Feature Overview - Only show if no character is loaded */}
      {!character && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="tool-card text-center">
            <Trophy className="w-12 h-12 text-wow-gold mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Current Season</h3>
            <p className="text-gray-300 text-sm">
              View current season M+ rating with detailed role breakdown and recent runs
            </p>
          </div>
          
          <div className="tool-card text-center">
            <History className="w-12 h-12 text-wow-purple mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Season History</h3>
            <p className="text-gray-300 text-sm">
              Complete historical data across all M+ seasons with peak performance tracking
            </p>
          </div>
          
          <div className="tool-card text-center">
            <Clock className="w-12 h-12 text-wow-blue mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Performance Analysis</h3>
            <p className="text-gray-300 text-sm">
              Best times, highest keys, and detailed run breakdowns with upgrade indicators
            </p>
          </div>
          
          <div className="tool-card text-center">
            <MapPin className="w-12 h-12 text-wow-orange mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">External Integration</h3>
            <p className="text-gray-300 text-sm">
              Direct links to WarcraftLogs, Raider.IO profile, and Blizzard Armory
            </p>
          </div>
        </div>
      )}

      {/* Enhanced Tips Section */}
      <div className="tool-card max-w-4xl mx-auto">
        <h3 className="text-lg font-semibold mb-3">Enhanced Features Guide</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
          <div>
            <h4 className="font-medium text-white mb-2">🔍 Character Lookup</h4>
            <ul className="space-y-1">
              <li>• Searches ALL season history automatically</li>
              <li>• Displays peak performance across expansions</li>
              <li>• Shows seasonal trends and comparisons</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-white mb-2">📊 Historical Analysis</h4>
            <ul className="space-y-1">
              <li>• Complete M+ history from BFA to current</li>
              <li>• Peak season identification and statistics</li>
              <li>• Score progression and trend analysis</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-white mb-2">🔗 External Resources</h4>
            <ul className="space-y-1">
              <li>• WarcraftLogs for detailed raid performance</li>
              <li>• Full Raider.IO profile with extended data</li>
              <li>• Official Blizzard Armory integration</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-white mb-2">⚡ Pro Tips</h4>
            <ul className="space-y-1">
              <li>• Use exact character names for best results</li>
              <li>• Data updates regularly from Raider.IO</li>
              <li>• Season history helps identify improvement patterns</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
