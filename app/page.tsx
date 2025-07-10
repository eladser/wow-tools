'use client'

import { Sword, BarChart3, Users, Trophy, Shield, Calendar, Target } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  const tools = [
    {
      icon: <Sword className="w-8 h-8 text-wow-purple" />,
      title: "Mythic+ Tools",
      description: "Enhanced warband analysis with highest M+ scores across all characters by season. Includes WarcraftLogs integration and Raider.IO URL support.",
      href: "/mythic-plus",
      status: "Enhanced",
      features: ["Warband Analysis", "WarcraftLogs Integration", "URL Parsing", "Season History"]
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-wow-gold" />,
      title: "WarcraftLogs Analyzer",
      description: "Comprehensive raid performance analysis with damage/healing breakdowns, fight-by-fight analysis, and detailed performance metrics.",
      href: "/logs",
      status: "Available",
      features: ["Fight Analysis", "DPS/HPS Rankings", "Performance Metrics", "Deep Dive Links"]
    },
    {
      icon: <Users className="w-8 h-8 text-wow-blue" />,
      title: "Raid Utilities",
      description: "Complete raid management suite with roster management, strategy planning, and attendance tracking for raid leaders.",
      href: "/raid-utilities",
      status: "Available",
      features: ["Roster Management", "Strategy Planning", "Attendance Tracking", "Role Organization"]
    },
    {
      icon: <Trophy className="w-8 h-8 text-wow-orange" />,
      title: "Additional Tools",
      description: "More utilities including guild analytics, achievement tracking, and performance comparisons across different content types.",
      href: "/tools",
      status: "Planned",
      features: ["Guild Analytics", "Achievement Tracking", "Performance Comparisons", "Character Profiles"]
    }
  ]

  const features = [
    {
      icon: <Shield className="w-6 h-6 text-wow-purple" />,
      title: "Warband Analysis",
      description: "Automatically discover and analyze all characters in your warband with highest M+ scores by season"
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-wow-gold" />,
      title: "WarcraftLogs Integration",
      description: "Direct links to WarcraftLogs for M+ runs and comprehensive raid performance analysis"
    },
    {
      icon: <Target className="w-6 h-6 text-wow-blue" />,
      title: "Strategy Planning",
      description: "Boss-specific strategies with priority assignments and common encounter templates"
    },
    {
      icon: <Calendar className="w-6 h-6 text-wow-orange" />,
      title: "Roster Management",
      description: "Multi-roster support with role-based organization and attendance tracking"
    }
  ]

  return (
    <div className="space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-bold text-wow-gold mb-4">
          World of Warcraft Tools
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Essential utilities for raiders, mythic+ runners, and guild leaders. 
          Enhanced with warband analysis, WarcraftLogs integration, and comprehensive raid management.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {tools.map((tool, index) => (
          <div key={index} className="tool-card group">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                {tool.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-semibold text-white group-hover:text-wow-blue transition-colors">
                    {tool.title}
                  </h3>
                  <span className={`text-sm px-2 py-1 rounded ${
                    tool.status === "Available" 
                      ? "bg-green-600/20 text-green-400" 
                    : tool.status === "Enhanced"
                      ? "bg-wow-purple/20 text-wow-purple"
                    : tool.status === "Coming Soon"
                      ? "bg-wow-gold/20 text-wow-gold"
                      : "bg-gray-600/20 text-gray-400"
                  }`}>
                    {tool.status}
                  </span>
                </div>
                <p className="text-gray-300 mb-4">
                  {tool.description}
                </p>
                
                {/* Feature List */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {tool.features.map((feature, featureIndex) => (
                      <span key={featureIndex} className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
                
                {(tool.status === "Available" || tool.status === "Enhanced") ? (
                  <Link href={tool.href} className="inline-block wow-button">
                    Launch Tool
                  </Link>
                ) : tool.status === "Coming Soon" ? (
                  <button className="wow-button opacity-50 cursor-not-allowed" disabled>
                    Coming Soon
                  </button>
                ) : (
                  <button className="wow-button opacity-30 cursor-not-allowed" disabled>
                    Planned
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Key Features Highlight */}
      <div className="bg-black/20 backdrop-blur-sm border border-wow-purple/30 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-wow-purple mb-6 text-center">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                {feature.icon}
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
                <p className="text-gray-300 text-sm">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* About Section */}
      <div className="bg-black/20 backdrop-blur-sm border border-wow-gold/30 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-wow-gold mb-4">About WoW Tools</h2>
        <p className="text-gray-300 max-w-3xl mx-auto mb-6">
          This comprehensive suite of World of Warcraft tools provides players with essential utilities to improve their gameplay. 
          From warband-wide mythic+ analysis to detailed raid log breakdowns and complete raid management, our tools help players 
          at all levels optimize their performance and enjoy the game to its fullest.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div className="bg-gray-800/50 rounded-lg p-4">
            <h3 className="font-semibold text-wow-blue mb-2">🚀 Latest Updates</h3>
            <ul className="text-gray-300 space-y-1">
              <li>• Enhanced warband analysis</li>
              <li>• WarcraftLogs integration</li>
              <li>• Comprehensive raid utilities</li>
              <li>• Raider.IO URL support</li>
            </ul>
          </div>
          
          <div className="bg-gray-800/50 rounded-lg p-4">
            <h3 className="font-semibold text-wow-purple mb-2">🎯 For All Players</h3>
            <ul className="text-gray-300 space-y-1">
              <li>• Mythic+ runners</li>
              <li>• Raid leaders</li>
              <li>• Guild officers</li>
              <li>• Performance analysts</li>
            </ul>
          </div>
          
          <div className="bg-gray-800/50 rounded-lg p-4">
            <h3 className="font-semibold text-wow-gold mb-2">🔧 Tech Stack</h3>
            <ul className="text-gray-300 space-y-1">
              <li>• Next.js 14 + TypeScript</li>
              <li>• Raider.IO API integration</li>
              <li>• WarcraftLogs API v2</li>
              <li>• GitHub Pages deployment</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
