"use client"

import { useState } from 'react'
import { Clock, Trophy, Users, MapPin, Search, AlertCircle, History, Link, Zap } from 'lucide-react'
import { RaiderIOCharacter, getCharacterProfileWithAllSeasons, searchWarbandCharacters, parseRaiderIOUrl, WarbandAnalysis } from '@/lib/raiderio'
import CharacterProfile from './components/CharacterProfile'
import CurrentAffixes from './components/CurrentAffixes'
import SeasonHistory from './components/SeasonHistory'
import ExternalLinks from './components/ExternalLinks'
import WarbandAnalysisComponent from './components/WarbandAnalysis'

export default function MythicPlusPage() {
  const [input, setInput] = useState('')
  const [realm, setRealm] = useState('')
  const [region, setRegion] = useState('us')
  const [character, setCharacter] = useState<RaiderIOCharacter | null>(null)
  const [warbandData, setWarbandData] = useState<WarbandAnalysis | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showFullHistory, setShowFullHistory] = useState(false)
  const [searchMode, setSearchMode] = useState<'character' | 'warband'>('character')
  const [isUrlInput, setIsUrlInput] = useState(false)

  const handleInputChange = (value: string) => {
    setInput(value)
    // Check if input looks like a Raider.IO URL
    const isUrl = value.includes('raider.io') || value.includes('http')
    setIsUrlInput(isUrl)
    
    if (isUrl) {
      const parsed = parseRaiderIOUrl(value)
      if (parsed) {
        setRealm(parsed.realm)
        setRegion(parsed.region)
      }
    }
  }

  const handleLookup = async () => {
    let characterName = input.trim()
    let realmName = realm.trim()
    let regionName = region

    // Handle URL input
    if (isUrlInput) {
      const parsed = parseRaiderIOUrl(input)
      if (!parsed) {
        setError('Invalid Raider.IO URL format')
        return
      }
      characterName = parsed.name
      realmName = parsed.realm
      regionName = parsed.region
    }

    if (!characterName || !realmName) {
      setError('Please enter both character name and realm, or paste a Raider.IO URL')
      return
    }

    setLoading(true)
    setError(null)
    setCharacter(null)
    setWarbandData(null)
    setShowFullHistory(false)

    try {
      if (searchMode === 'warband') {
        // Search for warband characters
        const warbandResult = await searchWarbandCharacters(regionName, realmName, characterName)
        setWarbandData(warbandResult)
      } else {
        // Get single character with ALL season history
        const characterData = await getCharacterProfileWithAllSeasons(regionName, realmName, characterName)
        setCharacter(characterData)
      }
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

  const getInputPlaceholder = () => {
    if (searchMode === 'warband') {
      return 'Character name or Raider.IO URL'
    }
    return 'Character name or Raider.IO URL'
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-wow-purple">
          Mythic+ Tools
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Track your mythic+ progress, analyze warband performance, and explore historical data with comprehensive Raider.IO integration and WarcraftLogs linking
        </p>
      </div>

      {/* Current Affixes - Always visible */}
      <CurrentAffixes region={region} />

      {/* Character/Warband Lookup Form */}
      <div className="tool-card max-w-3xl mx-auto">
        <div className="flex items-center space-x-4 mb-4">
          <h2 className="text-xl font-semibold">Character & Warband Lookup</h2>
          
          {/* Search Mode Toggle */}
          <div className="flex bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setSearchMode('character')}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                searchMode === 'character' 
                  ? 'bg-wow-blue text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Single Character
            </button>
            <button
              onClick={() => setSearchMode('warband')}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                searchMode === 'warband' 
                  ? 'bg-wow-purple text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4 inline mr-1" />
              Warband Analysis
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">
                {isUrlInput ? 'Raider.IO URL' : 'Character Name'}
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder={getInputPlaceholder()}
                  value={input}
                  onChange={(e) => handleInputChange(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full wow-input pr-8"
                  disabled={loading}
                />
                {isUrlInput && (
                  <Link className="absolute right-2 top-1/2 transform -translate-y-1/2 w-5 h-5 text-wow-blue" />
                )}
              </div>
            </div>
            
            {!isUrlInput && (
              <>
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
              </>
            )}
            
            {isUrlInput && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Auto-detected</label>
                <div className="text-sm text-gray-400 bg-gray-800 px-3 py-2 rounded">
                  {parseRaiderIOUrl(input) ? 
                    `${parseRaiderIOUrl(input)?.name} - ${parseRaiderIOUrl(input)?.realm} (${parseRaiderIOUrl(input)?.region.toUpperCase()})` : 
                    'Enter a valid Raider.IO URL'}
                </div>
              </div>
            )}
          </div>
          
          {error && (
            <div className="flex items-center space-x-2 text-red-400 bg-red-900/20 p-3 rounded-lg">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Search Mode Description */}
          {searchMode === 'warband' && (
            <div className="bg-wow-purple/10 border border-wow-purple/20 rounded-lg p-3">
              <div className="flex items-center space-x-2 text-wow-purple mb-2">
                <Zap className="w-4 h-4" />
                <span className="font-medium">Warband Analysis Mode</span>
              </div>
              <p className="text-sm text-gray-300">
                This will search for alternative characters with similar names and analyze the highest M+ scores across your entire warband for each season. 
                WarcraftLogs integration is included for current season best runs.
              </p>
            </div>
          )}

          <button
            onClick={handleLookup}
            disabled={(!input.trim() || (!isUrlInput && !realm.trim())) || loading}
            className="w-full wow-button disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>
                  {searchMode === 'warband' ? 'Searching Warband...' : 'Loading Complete History...'}
                </span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>
                  {searchMode === 'warband' ? 'Analyze Warband' : 'Look Up Character'}
                </span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Warband Analysis Results */}
      {warbandData && (
        <WarbandAnalysisComponent warbandData={warbandData} region={region} />
      )}

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

      {/* Feature Overview - Only show if no character/warband is loaded */}
      {!character && !warbandData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="tool-card text-center">
            <Users className="w-12 h-12 text-wow-purple mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Warband Analysis</h3>
            <p className="text-gray-300 text-sm">
              Analyze highest M+ scores across all characters in your warband with season-by-season breakdowns
            </p>
          </div>
          
          <div className="tool-card text-center">
            <Trophy className="w-12 h-12 text-wow-gold mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">WarcraftLogs Integration</h3>
            <p className="text-gray-300 text-sm">
              Direct links to WarcraftLogs for M+ runs with searchable log integration
            </p>
          </div>
          
          <div className="tool-card text-center">
            <History className="w-12 h-12 text-wow-blue mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Complete Season History</h3>
            <p className="text-gray-300 text-sm">
              Historical data across all M+ seasons with peak performance tracking
            </p>
          </div>
          
          <div className="tool-card text-center">
            <Link className="w-12 h-12 text-wow-orange mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">URL Support</h3>
            <p className="text-gray-300 text-sm">
              Paste Raider.IO URLs directly for instant character lookup and analysis
            </p>
          </div>
        </div>
      )}

      {/* Enhanced Tips Section */}
      <div className="tool-card max-w-4xl mx-auto">
        <h3 className="text-lg font-semibold mb-3">Enhanced Features Guide</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
          <div>
            <h4 className="font-medium text-white mb-2">🏰 Warband Analysis</h4>
            <ul className="space-y-1">
              <li>• Searches for alt characters automatically</li>
              <li>• Shows highest scores across all characters by season</li>
              <li>• Identifies main character and alt progression</li>
              <li>• WarcraftLogs integration for current season runs</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-white mb-2">🔗 URL Integration</h4>
            <ul className="space-y-1">
              <li>• Paste Raider.IO URLs directly in search</li>
              <li>• Auto-detects character, realm, and region</li>
              <li>• Works with all Raider.IO character profile URLs</li>
              <li>• Seamless integration with existing workflows</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-white mb-2">🎯 WarcraftLogs Linking</h4>
            <ul className="space-y-1">
              <li>• Search for M+ logs matching run dates</li>
              <li>• Direct links to character's WarcraftLogs profile</li>
              <li>• Integrated with best run analysis</li>
              <li>• Helps find detailed performance data</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-white mb-2">📊 Advanced Analysis</h4>
            <ul className="space-y-1">
              <li>• Complete season-by-season progression</li>
              <li>• Peak performance identification</li>
              <li>• Cross-character score comparisons</li>
              <li>• Historical trend analysis</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
