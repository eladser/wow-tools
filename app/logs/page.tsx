"use client"

import { useState } from 'react'
import { Search, ExternalLink, TrendingUp, AlertCircle, BarChart3, Users, Target, Clock, Trophy, Shield, Heart, Swords, Star, Activity, Zap } from 'lucide-react'
import { warcraftLogsClient } from '@/lib/warcraftlogs'

interface Fight {
  id: number
  name: string
  startTime: number
  endTime: number
  kill: boolean
  percentage: number
  difficulty: number
  size: number
}

interface ReportData {
  title: string
  owner: { name: string }
  startTime: number
  endTime: number
  zone: { name: string }
  fights: Fight[]
}

interface DamageEntry {
  name: string
  total: number
  dps: number
  class: string
  spec: string
  icon: string
}

interface AnalysisResult {
  report: ReportData
  selectedFight: Fight
  damageData: DamageEntry[]
  healingData: DamageEntry[]
}

export default function LogsPage() {
  const [logUrl, setLogUrl] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [selectedFight, setSelectedFight] = useState<Fight | null>(null)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)

  const extractReportId = (url: string): string | null => {
    const match = url.match(/reports\/([a-zA-Z0-9]+)/)
    return match ? match[1] : null
  }

  const handleAnalyze = async () => {
    if (!logUrl.trim()) {
      setError('Please enter a WarcraftLogs URL')
      return
    }

    const reportId = extractReportId(logUrl)
    if (!reportId) {
      setError('Invalid WarcraftLogs URL format')
      return
    }
    
    setIsAnalyzing(true)
    setError(null)
    
    try {
      const reportResponse = await warcraftLogsClient.getReportInfo(reportId)
      
      if (reportResponse.errors) {
        throw new Error(reportResponse.errors[0].message)
      }
      
      const report = reportResponse.data.reportData.report
      if (!report) {
        throw new Error('Report not found')
      }
      
      setReportData(report)
      
      // Auto-select the first boss fight
      const bossFights = report.fights.filter((fight: Fight) => fight.name !== 'Trash')
      if (bossFights.length > 0) {
        setSelectedFight(bossFights[0])
        await analyzeFight(reportId, bossFights[0], report)
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze log')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const analyzeFight = async (reportId: string, fight: Fight, report: ReportData) => {
    try {
      const [damageResponse, healingResponse] = await Promise.all([
        warcraftLogsClient.getDamageData(reportId, fight.id),
        warcraftLogsClient.getHealingData(reportId, fight.id)
      ])

      const damageData = damageResponse.data?.reportData?.report?.table?.data?.entries || []
      const healingData = healingResponse.data?.reportData?.report?.table?.data?.entries || []

      setAnalysisResult({
        report,
        selectedFight: fight,
        damageData: damageData.map((entry: any) => ({
          name: entry.name,
          total: entry.total,
          dps: entry.total / ((fight.endTime - fight.startTime) / 1000),
          class: entry.class,
          spec: entry.spec,
          icon: entry.icon
        })),
        healingData: healingData.map((entry: any) => ({
          name: entry.name,
          total: entry.total,
          dps: entry.total / ((fight.endTime - fight.startTime) / 1000),
          class: entry.class,
          spec: entry.spec,
          icon: entry.icon
        }))
      })
    } catch (err) {
      console.error('Error analyzing fight:', err)
    }
  }

  const handleFightSelection = async (fight: Fight) => {
    if (!reportData) return
    
    setSelectedFight(fight)
    setAnalysisResult(null)
    
    const reportId = extractReportId(logUrl)
    if (reportId) {
      await analyzeFight(reportId, fight, reportData)
    }
  }

  const formatDuration = (startTime: number, endTime: number): string => {
    const durationMs = endTime - startTime
    const seconds = Math.floor(durationMs / 1000)
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const getDifficultyText = (difficulty: number): string => {
    switch (difficulty) {
      case 3: return 'Normal'
      case 4: return 'Heroic'
      case 5: return 'Mythic'
      default: return 'Unknown'
    }
  }

  const getDifficultyColor = (difficulty: number): string => {
    switch (difficulty) {
      case 3: return 'text-green-400'
      case 4: return 'text-blue-400'
      case 5: return 'text-orange-400'
      default: return 'text-gray-400'
    }
  }

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-wow-gold">
          WarcraftLogs Analyzer
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Paste a WarcraftLogs URL to get detailed analysis of your raid performance with damage, healing, and mechanic breakdowns
        </p>
      </div>

      {/* URL Input */}
      <div className="tool-card max-w-2xl mx-auto">
        <div className="space-y-4">
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="https://www.warcraftlogs.com/reports/..."
              value={logUrl}
              onChange={(e) => setLogUrl(e.target.value)}
              className="flex-1 wow-input"
              onKeyPress={(e) => e.key === 'Enter' && handleAnalyze()}
            />
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !logUrl.trim()}
              className="wow-button flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAnalyzing ? (
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              <span>{isAnalyzing ? 'Analyzing...' : 'Analyze'}</span>
            </button>
          </div>
          
          {error && (
            <div className="flex items-center space-x-2 text-red-400 bg-red-900/20 p-3 rounded-lg">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          
          <p className="text-sm text-gray-400">
            Enter a valid WarcraftLogs report URL to begin detailed performance analysis
          </p>
        </div>
      </div>

      {/* Report Overview */}
      {reportData && (
        <div className="tool-card">
          <div className="flex items-center space-x-4 mb-6">
            <BarChart3 className="w-8 h-8 text-wow-gold" />
            <div>
              <h2 className="text-2xl font-bold text-wow-gold">{reportData.title}</h2>
              <p className="text-gray-300">
                {reportData.zone.name} • Uploaded by {reportData.owner.name}
              </p>
            </div>
          </div>

          {/* Fight Selection */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center space-x-2">
              <Target className="w-5 h-5 text-wow-blue" />
              <span>Select Fight to Analyze</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {reportData.fights
                .filter(fight => fight.name !== 'Trash')
                .map((fight) => (
                  <button
                    key={fight.id}
                    onClick={() => handleFightSelection(fight)}
                    className={`p-3 rounded-lg border-2 transition-all text-left ${
                      selectedFight?.id === fight.id
                        ? 'border-wow-gold bg-wow-gold/10'
                        : 'border-gray-700 hover:border-gray-600 bg-gray-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">{fight.name}</span>
                      <span className={`text-xs px-2 py-1 rounded ${getDifficultyColor(fight.difficulty)}`}>
                        {getDifficultyText(fight.difficulty)}
                      </span>
                    </div>
                    <div className="text-sm text-gray-400 flex items-center justify-between">
                      <span>{formatDuration(fight.startTime, fight.endTime)}</span>
                      <span className={fight.kill ? 'text-green-400' : 'text-red-400'}>
                        {fight.kill ? '✓ Kill' : `${fight.percentage}% Wipe`}
                      </span>
                    </div>
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Analysis Results */}
      {analysisResult && (
        <div className="space-y-6">
          {/* Fight Summary */}
          <div className="tool-card">
            <div className="flex items-center space-x-4 mb-4">
              <Trophy className="w-6 h-6 text-wow-gold" />
              <h3 className="text-xl font-semibold">Fight Summary: {analysisResult.selectedFight.name}</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="w-4 h-4 text-wow-blue" />
                  <span className="text-sm text-gray-400">Duration</span>
                </div>
                <div className="text-lg font-bold">
                  {formatDuration(analysisResult.selectedFight.startTime, analysisResult.selectedFight.endTime)}
                </div>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Users className="w-4 h-4 text-wow-purple" />
                  <span className="text-sm text-gray-400">Raid Size</span>
                </div>
                <div className="text-lg font-bold">{analysisResult.selectedFight.size} players</div>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Shield className="w-4 h-4 text-wow-orange" />
                  <span className="text-sm text-gray-400">Difficulty</span>
                </div>
                <div className={`text-lg font-bold ${getDifficultyColor(analysisResult.selectedFight.difficulty)}`}>
                  {getDifficultyText(analysisResult.selectedFight.difficulty)}
                </div>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Activity className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-gray-400">Result</span>
                </div>
                <div className={`text-lg font-bold ${analysisResult.selectedFight.kill ? 'text-green-400' : 'text-red-400'}`}>
                  {analysisResult.selectedFight.kill ? 'Kill' : `${analysisResult.selectedFight.percentage}% Wipe`}
                </div>
              </div>
            </div>
          </div>

          {/* Damage Analysis */}
          {analysisResult.damageData.length > 0 && (
            <div className="tool-card">
              <div className="flex items-center space-x-4 mb-4">
                <Swords className="w-6 h-6 text-wow-orange" />
                <h3 className="text-xl font-semibold">Damage Analysis</h3>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-2 px-4">Rank</th>
                      <th className="text-left py-2 px-4">Player</th>
                      <th className="text-left py-2 px-4">Class/Spec</th>
                      <th className="text-left py-2 px-4">Total Damage</th>
                      <th className="text-left py-2 px-4">DPS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analysisResult.damageData
                      .sort((a, b) => b.total - a.total)
                      .map((entry, index) => (
                        <tr key={entry.name} className="border-b border-gray-800 hover:bg-gray-800/50">
                          <td className="py-2 px-4">
                            <div className="flex items-center space-x-2">
                              <span className="font-bold text-wow-gold">#{index + 1}</span>
                              {index < 3 && <Star className="w-4 h-4 text-yellow-400" />}
                            </div>
                          </td>
                          <td className="py-2 px-4 font-medium">{entry.name}</td>
                          <td className="py-2 px-4 text-sm text-gray-400">{entry.spec} {entry.class}</td>
                          <td className="py-2 px-4 font-mono">{formatNumber(entry.total)}</td>
                          <td className="py-2 px-4 font-mono text-wow-orange">{formatNumber(Math.round(entry.dps))}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Healing Analysis */}
          {analysisResult.healingData.length > 0 && (
            <div className="tool-card">
              <div className="flex items-center space-x-4 mb-4">
                <Heart className="w-6 h-6 text-green-400" />
                <h3 className="text-xl font-semibold">Healing Analysis</h3>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-2 px-4">Rank</th>
                      <th className="text-left py-2 px-4">Player</th>
                      <th className="text-left py-2 px-4">Class/Spec</th>
                      <th className="text-left py-2 px-4">Total Healing</th>
                      <th className="text-left py-2 px-4">HPS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analysisResult.healingData
                      .sort((a, b) => b.total - a.total)
                      .map((entry, index) => (
                        <tr key={entry.name} className="border-b border-gray-800 hover:bg-gray-800/50">
                          <td className="py-2 px-4">
                            <div className="flex items-center space-x-2">
                              <span className="font-bold text-wow-gold">#{index + 1}</span>
                              {index < 3 && <Star className="w-4 h-4 text-yellow-400" />}
                            </div>
                          </td>
                          <td className="py-2 px-4 font-medium">{entry.name}</td>
                          <td className="py-2 px-4 text-sm text-gray-400">{entry.spec} {entry.class}</td>
                          <td className="py-2 px-4 font-mono">{formatNumber(entry.total)}</td>
                          <td className="py-2 px-4 font-mono text-green-400">{formatNumber(Math.round(entry.dps))}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* External Links */}
          <div className="tool-card">
            <div className="flex items-center space-x-4 mb-4">
              <ExternalLink className="w-6 h-6 text-wow-blue" />
              <h3 className="text-xl font-semibold">External Analysis</h3>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <a
                href={logUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 bg-wow-gold hover:bg-yellow-500 text-black px-4 py-2 rounded-lg transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span>View on WarcraftLogs</span>
              </a>
              
              <a
                href={`${logUrl}#fight=${selectedFight?.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 bg-wow-purple hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Target className="w-4 h-4" />
                <span>View This Fight</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Feature Overview - Only show if no analysis */}
      {!reportData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="tool-card text-center">
            <TrendingUp className="w-12 h-12 text-wow-blue mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Performance Metrics</h3>
            <p className="text-gray-300 text-sm">
              DPS, HPS, and damage taken analysis with detailed rankings and comparisons
            </p>
          </div>
          
          <div className="tool-card text-center">
            <Target className="w-12 h-12 text-wow-purple mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Fight-by-Fight Analysis</h3>
            <p className="text-gray-300 text-sm">
              Detailed breakdown of each encounter with kill/wipe analysis and timers
            </p>
          </div>
          
          <div className="tool-card text-center">
            <Users className="w-12 h-12 text-wow-orange mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Raid Performance</h3>
            <p className="text-gray-300 text-sm">
              Complete raid roster analysis with role-specific performance metrics
            </p>
          </div>
          
          <div className="tool-card text-center">
            <ExternalLink className="w-12 h-12 text-wow-gold mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Deep Dive Links</h3>
            <p className="text-gray-300 text-sm">
              Direct links to WarcraftLogs for advanced analysis and detailed mechanics
            </p>
          </div>
        </div>
      )}

      {/* Tips Section */}
      <div className="tool-card max-w-4xl mx-auto">
        <h3 className="text-lg font-semibold mb-3">Using the WarcraftLogs Analyzer</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
          <div>
            <h4 className="font-medium text-white mb-2">📊 Getting Started</h4>
            <ul className="space-y-1">
              <li>• Paste any WarcraftLogs report URL</li>
              <li>• Analysis begins automatically</li>
              <li>• Select different fights for comparison</li>
              <li>• View detailed performance metrics</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-white mb-2">🎯 Performance Analysis</h4>
            <ul className="space-y-1">
              <li>• DPS and HPS rankings with totals</li>
              <li>• Fight duration and difficulty indicators</li>
              <li>• Kill vs. wipe analysis</li>
              <li>• Cross-fight performance comparison</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-white mb-2">🔗 External Integration</h4>
            <ul className="space-y-1">
              <li>• Direct links to original WarcraftLogs</li>
              <li>• Fight-specific deep dive links</li>
              <li>• Easy sharing and collaboration</li>
              <li>• Full WarcraftLogs feature access</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-white mb-2">⚡ Pro Tips</h4>
            <ul className="space-y-1">
              <li>• Compare multiple fights for trends</li>
              <li>• Focus on consistent performers</li>
              <li>• Use for raid improvement discussions</li>
              <li>• Bookmark analysis results</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
