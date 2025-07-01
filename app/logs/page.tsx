"use client"

import { useState } from 'react'
import { Search, ExternalLink, TrendingUp } from 'lucide-react'

export default function LogsPage() {
  const [logUrl, setLogUrl] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleAnalyze = async () => {
    if (!logUrl.trim()) return
    
    setIsAnalyzing(true)
    // TODO: Implement actual log analysis
    setTimeout(() => {
      setIsAnalyzing(false)
      alert('Log analysis feature coming soon!')
    }, 2000)
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-wow-gold">
          WarcraftLogs Analyzer
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Paste a WarcraftLogs URL to get detailed analysis of your raid performance
        </p>
      </div>

      <div className="tool-card max-w-2xl mx-auto">
        <div className="space-y-4">
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="https://www.warcraftlogs.com/reports/..."
              value={logUrl}
              onChange={(e) => setLogUrl(e.target.value)}
              className="flex-1 wow-input"
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
          <p className="text-sm text-gray-400">
            Enter a valid WarcraftLogs report URL to begin analysis
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="tool-card text-center">
          <TrendingUp className="w-12 h-12 text-wow-blue mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Performance Metrics</h3>
          <p className="text-gray-300 text-sm">
            DPS, HPS, and damage taken analysis with percentile rankings
          </p>
        </div>
        
        <div className="tool-card text-center">
          <ExternalLink className="w-12 h-12 text-wow-purple mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Mechanic Breakdown</h3>
          <p className="text-gray-300 text-sm">
            Detailed analysis of boss mechanics and player performance
          </p>
        </div>
        
        <div className="tool-card text-center">
          <Search className="w-12 h-12 text-wow-orange mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Improvement Tips</h3>
          <p className="text-gray-300 text-sm">
            Actionable insights to help improve your raid performance
          </p>
        </div>
      </div>
    </div>
  )
}
