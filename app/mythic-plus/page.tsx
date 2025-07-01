"use client"

import { useState } from 'react'
import { Clock, Trophy, Users, MapPin, Search, AlertCircle } from 'lucide-react'
import { RaiderIOCharacter, getCharacterProfile } from '@/lib/raiderio'
import CharacterProfile from './components/CharacterProfile'
import CurrentAffixes from './components/CurrentAffixes'

export default function MythicPlusPage() {
  const [characterName, setCharacterName] = useState('')
  const [realm, setRealm] = useState('')
  const [region, setRegion] = useState('us')
  const [character, setCharacter] = useState<RaiderIOCharacter | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLookup = async () => {
    if (!characterName.trim() || !realm.trim()) {
      setError('Please enter both character name and realm')
      return
    }

    setLoading(true)
    setError(null)
    setCharacter(null)

    try {
      const characterData = await getCharacterProfile(region, realm.trim(), characterName.trim())
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
          Track your mythic+ progress, analyze seasonal performance, and find the best routes
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
                <span>Loading...</span>
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

      {/* Character Profile */}
      {character && <CharacterProfile character={character} />}

      {/* Feature Overview - Only show if no character is loaded */}
      {!character && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="tool-card text-center">
            <Trophy className="w-12 h-12 text-wow-gold mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Seasonal Score</h3>
            <p className="text-gray-300 text-sm">
              Current and previous season M+ ratings with detailed breakdown
            </p>
          </div>
          
          <div className="tool-card text-center">
            <Clock className="w-12 h-12 text-wow-blue mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Best Times</h3>
            <p className="text-gray-300 text-sm">
              Personal best completion times for each dungeon
            </p>
          </div>
          
          <div className="tool-card text-center">
            <Users className="w-12 h-12 text-wow-purple mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Team Analysis</h3>
            <p className="text-gray-300 text-sm">
              Performance with different team compositions
            </p>
          </div>
          
          <div className="tool-card text-center">
            <MapPin className="w-12 h-12 text-wow-orange mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Route Planning</h3>
            <p className="text-gray-300 text-sm">
              Optimal routes and strategies for each dungeon
            </p>
          </div>
        </div>
      )}

      {/* Tips Section */}
      <div className="tool-card max-w-4xl mx-auto">
        <h3 className="text-lg font-semibold mb-3">Tips for Using Mythic+ Tools</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
          <div>
            <h4 className="font-medium text-white mb-2">🎯 Character Lookup</h4>
            <ul className="space-y-1">
              <li>• Use exact character and realm names</li>
              <li>• Realm names should match in-game spelling</li>
              <li>• Data updates regularly from Raider.IO</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-white mb-2">📊 Score Interpretation</h4>
            <ul className="space-y-1">
              <li>• Higher scores indicate better M+ performance</li>
              <li>• Scores are calculated per dungeon and role</li>
              <li>• Colors represent different score tiers</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-white mb-2">⏱️ Timing & Upgrades</h4>
            <ul className="space-y-1">
              <li>• Gold: 3 upgrades (+3 chest timer)</li>
              <li>• Silver: 2 upgrades (+2 chest timer)</li>
              <li>• Bronze: 1 upgrade (+1 chest timer)</li>
              <li>• Red: No upgrades (over timer)</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-white mb-2">🔄 Affixes</h4>
            <ul className="space-y-1">
              <li>• Weekly affixes rotate on Tuesday/Wednesday</li>
              <li>• Different affixes activate at +2, +4, +7, +10</li>
              <li>• Plan your routes around current affixes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
