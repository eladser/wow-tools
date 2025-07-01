"use client"

import { useState } from 'react'
import { Clock, Trophy, Users, MapPin } from 'lucide-react'

export default function MythicPlusPage() {
  const [characterName, setCharacterName] = useState('')
  const [realm, setRealm] = useState('')
  const [region, setRegion] = useState('us')

  const handleLookup = () => {
    if (!characterName.trim() || !realm.trim()) return
    alert('Mythic+ lookup feature coming soon!')
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
                className="w-full wow-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Realm</label>
              <input
                type="text"
                placeholder="Realm name"
                value={realm}
                onChange={(e) => setRealm(e.target.value)}
                className="w-full wow-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Region</label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full wow-input"
              >
                <option value="us">US</option>
                <option value="eu">EU</option>
                <option value="kr">KR</option>
                <option value="tw">TW</option>
              </select>
            </div>
          </div>
          <button
            onClick={handleLookup}
            disabled={!characterName.trim() || !realm.trim()}
            className="w-full wow-button disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Look Up Character
          </button>
        </div>
      </div>

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
    </div>
  )
}
