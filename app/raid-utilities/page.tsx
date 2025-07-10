"use client"

import { useState } from 'react'
import { Users, Plus, Edit3, Trash2, Save, UserPlus, Settings, Calendar, Target, Shield, Heart, Swords, AlertCircle, CheckCircle, Clock, Star } from 'lucide-react'

interface RaidMember {
  id: string
  name: string
  class: string
  spec: string
  role: 'tank' | 'healer' | 'dps'
  realm: string
  status: 'confirmed' | 'tentative' | 'declined' | 'no-response'
  notes: string
  mainRaider: boolean
  attendance: number
}

interface RaidRoster {
  id: string
  name: string
  date: string
  difficulty: 'normal' | 'heroic' | 'mythic'
  maxSize: number
  members: RaidMember[]
  notes: string
}

interface StrategyNote {
  id: string
  boss: string
  phase: string
  content: string
  priority: 'low' | 'medium' | 'high'
  assignedTo: string[]
}

export default function RaidUtilitiesPage() {
  const [activeTab, setActiveTab] = useState<'roster' | 'strategy' | 'calendar'>('roster')
  const [rosters, setRosters] = useState<RaidRoster[]>([])
  const [strategies, setStrategies] = useState<StrategyNote[]>([])
  const [selectedRoster, setSelectedRoster] = useState<RaidRoster | null>(null)
  const [showAddMember, setShowAddMember] = useState(false)
  const [showAddStrategy, setShowAddStrategy] = useState(false)

  // Sample data initialization
  const initializeSampleData = () => {
    const sampleRoster: RaidRoster = {
      id: '1',
      name: 'Nerub-ar Palace Heroic',
      date: '2025-07-15',
      difficulty: 'heroic',
      maxSize: 20,
      members: [
        {
          id: '1',
          name: 'Tankadin',
          class: 'Paladin',
          spec: 'Protection',
          role: 'tank',
          realm: 'Stormrage',
          status: 'confirmed',
          notes: 'Main tank, has all consumables',
          mainRaider: true,
          attendance: 95
        },
        {
          id: '2',
          name: 'Healpriest',
          class: 'Priest',
          spec: 'Holy',
          role: 'healer',
          realm: 'Stormrage',
          status: 'confirmed',
          notes: 'Reliable healer',
          mainRaider: true,
          attendance: 88
        },
        {
          id: '3',
          name: 'Firemage',
          class: 'Mage',
          spec: 'Fire',
          role: 'dps',
          realm: 'Stormrage',
          status: 'tentative',
          notes: 'Might be late due to work',
          mainRaider: true,
          attendance: 92
        }
      ],
      notes: 'Focus on Ulgrax and Sikran progression'
    }

    const sampleStrategy: StrategyNote = {
      id: '1',
      boss: 'Ulgrax the Devourer',
      phase: 'Phase 1',
      content: 'Tank faces boss away from raid. DPS focus on adds when they spawn. Healers watch for Digestive Acid damage.',
      priority: 'high',
      assignedTo: ['Tankadin', 'Healpriest']
    }

    setRosters([sampleRoster])
    setStrategies([sampleStrategy])
    setSelectedRoster(sampleRoster)
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'tank': return <Shield className="w-4 h-4 text-blue-400" />
      case 'healer': return <Heart className="w-4 h-4 text-green-400" />
      case 'dps': return <Swords className="w-4 h-4 text-red-400" />
      default: return <Users className="w-4 h-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'text-green-400 bg-green-900/20'
      case 'tentative': return 'text-yellow-400 bg-yellow-900/20'
      case 'declined': return 'text-red-400 bg-red-900/20'
      case 'no-response': return 'text-gray-400 bg-gray-900/20'
      default: return 'text-gray-400 bg-gray-900/20'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-900/20'
      case 'medium': return 'text-yellow-400 bg-yellow-900/20'
      case 'low': return 'text-green-400 bg-green-900/20'
      default: return 'text-gray-400 bg-gray-900/20'
    }
  }

  const RosterManagement = () => (
    <div className="space-y-6">
      {/* Roster Selection */}
      <div className="tool-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">Raid Rosters</h3>
          <button
            onClick={() => {
              const newRoster: RaidRoster = {
                id: Date.now().toString(),
                name: 'New Raid',
                date: new Date().toISOString().split('T')[0],
                difficulty: 'heroic',
                maxSize: 20,
                members: [],
                notes: ''
              }
              setRosters([...rosters, newRoster])
              setSelectedRoster(newRoster)
            }}
            className="wow-button flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Roster</span>
          </button>
        </div>

        {rosters.length === 0 ? (
          <div className="text-center py-8">
            <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 mb-4">No raid rosters created yet</p>
            <button
              onClick={initializeSampleData}
              className="wow-button"
            >
              Create Sample Roster
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rosters.map((roster) => (
              <div
                key={roster.id}
                onClick={() => setSelectedRoster(roster)}
                className={`cursor-pointer p-4 rounded-lg border-2 transition-all ${
                  selectedRoster?.id === roster.id
                    ? 'border-wow-gold bg-wow-gold/10'
                    : 'border-gray-700 hover:border-gray-600 bg-gray-800'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{roster.name}</h4>
                  <span className="text-xs px-2 py-1 rounded bg-wow-purple text-white">
                    {roster.difficulty}
                  </span>
                </div>
                <div className="text-sm text-gray-400 space-y-1">
                  <div>📅 {roster.date}</div>
                  <div>👥 {roster.members.length}/{roster.maxSize}</div>
                  <div className="flex space-x-2">
                    <span>🛡️ {roster.members.filter(m => m.role === 'tank').length}</span>
                    <span>❤️ {roster.members.filter(m => m.role === 'healer').length}</span>
                    <span>⚔️ {roster.members.filter(m => m.role === 'dps').length}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Selected Roster Details */}
      {selectedRoster && (
        <div className="tool-card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold">{selectedRoster.name}</h3>
              <p className="text-gray-300">
                {selectedRoster.date} • {selectedRoster.difficulty} • {selectedRoster.members.length}/{selectedRoster.maxSize} members
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowAddMember(true)}
                className="wow-button flex items-center space-x-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>Add Member</span>
              </button>
              <button className="wow-button-secondary flex items-center space-x-2">
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </button>
            </div>
          </div>

          {/* Role Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-900/20 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Shield className="w-5 h-5 text-blue-400" />
                <span className="font-medium">Tanks</span>
              </div>
              <div className="text-2xl font-bold text-blue-400">
                {selectedRoster.members.filter(m => m.role === 'tank').length}
              </div>
              <div className="text-sm text-gray-400">
                {selectedRoster.members.filter(m => m.role === 'tank' && m.status === 'confirmed').length} confirmed
              </div>
            </div>
            
            <div className="bg-green-900/20 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Heart className="w-5 h-5 text-green-400" />
                <span className="font-medium">Healers</span>
              </div>
              <div className="text-2xl font-bold text-green-400">
                {selectedRoster.members.filter(m => m.role === 'healer').length}
              </div>
              <div className="text-sm text-gray-400">
                {selectedRoster.members.filter(m => m.role === 'healer' && m.status === 'confirmed').length} confirmed
              </div>
            </div>
            
            <div className="bg-red-900/20 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Swords className="w-5 h-5 text-red-400" />
                <span className="font-medium">DPS</span>
              </div>
              <div className="text-2xl font-bold text-red-400">
                {selectedRoster.members.filter(m => m.role === 'dps').length}
              </div>
              <div className="text-sm text-gray-400">
                {selectedRoster.members.filter(m => m.role === 'dps' && m.status === 'confirmed').length} confirmed
              </div>
            </div>
          </div>

          {/* Members List */}
          <div className="space-y-3">
            <h4 className="font-medium flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Raid Members</span>
            </h4>
            
            {selectedRoster.members.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No members added yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {selectedRoster.members.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getRoleIcon(member.role)}
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{member.name}</span>
                          {member.mainRaider && <Star className="w-4 h-4 text-yellow-400" />}
                        </div>
                        <div className="text-sm text-gray-400">
                          {member.spec} {member.class} • {member.realm}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="text-sm text-gray-400">
                        {member.attendance}% attendance
                      </div>
                      <span className={`px-2 py-1 rounded text-xs ${getStatusColor(member.status)}`}>
                        {member.status}
                      </span>
                      <button className="text-gray-400 hover:text-white">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button className="text-gray-400 hover:text-red-400">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )

  const StrategyPlanner = () => (
    <div className="space-y-6">
      <div className="tool-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">Strategy Notes</h3>
          <button
            onClick={() => setShowAddStrategy(true)}
            className="wow-button flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Strategy</span>
          </button>
        </div>

        {strategies.length === 0 ? (
          <div className="text-center py-8">
            <Target className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 mb-4">No strategy notes created yet</p>
            <button
              onClick={initializeSampleData}
              className="wow-button"
            >
              Create Sample Strategy
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {strategies.map((strategy) => (
              <div key={strategy.id} className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <h4 className="font-medium text-wow-gold">{strategy.boss}</h4>
                    <span className="text-sm text-gray-400">• {strategy.phase}</span>
                    <span className={`px-2 py-1 rounded text-xs ${getPriorityColor(strategy.priority)}`}>
                      {strategy.priority} priority
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button className="text-gray-400 hover:text-white">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button className="text-gray-400 hover:text-red-400">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <p className="text-gray-300 mb-3">{strategy.content}</p>
                
                {strategy.assignedTo.length > 0 && (
                  <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <span>Assigned to:</span>
                    <div className="flex space-x-2">
                      {strategy.assignedTo.map((member, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-700 rounded">
                          {member}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Common Boss Strategies */}
      <div className="tool-card">
        <h3 className="text-xl font-semibold mb-4">Common Boss Strategies</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-800 rounded-lg p-4">
            <h4 className="font-medium text-wow-purple mb-2">Ulgrax the Devourer</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Tank faces away from raid</li>
              <li>• DPS priority on adds</li>
              <li>• Healers watch acid damage</li>
              <li>• Use movement abilities for positioning</li>
            </ul>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-4">
            <h4 className="font-medium text-wow-purple mb-2">The Bloodbound Horror</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Stack for shared damage</li>
              <li>• Interrupt fear effects</li>
              <li>• Save cooldowns for burn phases</li>
              <li>• Position for blood pools</li>
            </ul>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-4">
            <h4 className="font-medium text-wow-purple mb-2">Sikran</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Coordinate phase transitions</li>
              <li>• Handle web mechanics</li>
              <li>• Manage add priorities</li>
              <li>• Use defensive cooldowns</li>
            </ul>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-4">
            <h4 className="font-medium text-wow-purple mb-2">Rasha'nan</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Spread for web spray</li>
              <li>• Stack for spinnerets</li>
              <li>• Handle web bridges</li>
              <li>• Coordinate movement</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )

  const RaidCalendar = () => (
    <div className="space-y-6">
      <div className="tool-card">
        <h3 className="text-xl font-semibold mb-4">Raid Calendar</h3>
        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h4 className="text-lg font-medium mb-2">Calendar Feature Coming Soon</h4>
          <p className="text-gray-400 mb-4">
            Integrated calendar with raid scheduling, attendance tracking, and automated reminders
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
            <div>
              <h5 className="font-medium text-white mb-2">Planned Features:</h5>
              <ul className="space-y-1">
                <li>• Recurring raid schedules</li>
                <li>• Attendance tracking</li>
                <li>• RSVP system</li>
                <li>• Automated reminders</li>
              </ul>
            </div>
            <div>
              <h5 className="font-medium text-white mb-2">Integrations:</h5>
              <ul className="space-y-1">
                <li>• Discord bot notifications</li>
                <li>• Google Calendar sync</li>
                <li>• Guild calendar import</li>
                <li>• Mobile app support</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-wow-blue">
          Raid Utilities
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Comprehensive tools for raid leaders including roster management, strategy planning, and raid scheduling
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center">
        <div className="flex bg-gray-800 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('roster')}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
              activeTab === 'roster'
                ? 'bg-wow-blue text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Roster Management</span>
          </button>
          <button
            onClick={() => setActiveTab('strategy')}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
              activeTab === 'strategy'
                ? 'bg-wow-blue text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Target className="w-4 h-4" />
            <span>Strategy Planner</span>
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
              activeTab === 'calendar'
                ? 'bg-wow-blue text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Raid Calendar</span>
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'roster' && <RosterManagement />}
      {activeTab === 'strategy' && <StrategyPlanner />}
      {activeTab === 'calendar' && <RaidCalendar />}

      {/* Feature Overview */}
      <div className="tool-card max-w-4xl mx-auto">
        <h3 className="text-lg font-semibold mb-3">Raid Utilities Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-300">
          <div>
            <h4 className="font-medium text-white mb-2">👥 Roster Management</h4>
            <ul className="space-y-1">
              <li>• Multi-roster support</li>
              <li>• Role-based organization</li>
              <li>• Attendance tracking</li>
              <li>• Status management (confirmed/tentative)</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-white mb-2">🎯 Strategy Planning</h4>
            <ul className="space-y-1">
              <li>• Boss-specific strategies</li>
              <li>• Phase-based notes</li>
              <li>• Priority assignments</li>
              <li>• Common strategy templates</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-white mb-2">📅 Calendar Integration</h4>
            <ul className="space-y-1">
              <li>• Recurring raid schedules</li>
              <li>• RSVP system</li>
              <li>• Automated reminders</li>
              <li>• External calendar sync</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
