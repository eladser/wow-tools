'use client'

import { Sword, BarChart3, Users, Trophy } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  const tools = [
    {
      icon: <BarChart3 className="w-8 h-8 text-wow-blue" />,
      title: "WarcraftLogs Analyzer",
      description: "Analyze your raid performance with detailed breakdowns of damage, healing, and mechanics.",
      href: "/logs",
      status: "Coming Soon"
    },
    {
      icon: <Sword className="w-8 h-8 text-wow-purple" />,
      title: "Mythic+ Tools",
      description: "Track your M+ progress, analyze routes, and compare seasonal performance.",
      href: "/mythic-plus",
      status: "Coming Soon"
    },
    {
      icon: <Users className="w-8 h-8 text-wow-orange" />,
      title: "Raid Utilities",
      description: "Tools for raid leaders including roster management and strategy planning.",
      href: "/raid",
      status: "Coming Soon"
    },
    {
      icon: <Trophy className="w-8 h-8 text-wow-gold" />,
      title: "Raider.IO Integration",
      description: "View previous season scores, character progression, and guild analytics.",
      href: "/raiderio",
      status: "Coming Soon"
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
          Enhance your WoW experience with powerful analysis and tracking tools.
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
                  {tool.status && (
                    <span className="text-sm bg-wow-gold/20 text-wow-gold px-2 py-1 rounded">
                      {tool.status}
                    </span>
                  )}
                </div>
                <p className="text-gray-300 mb-4">
                  {tool.description}
                </p>
                {tool.status === "Coming Soon" ? (
                  <button className="wow-button opacity-50 cursor-not-allowed" disabled>
                    Coming Soon
                  </button>
                ) : (
                  <Link href={tool.href} className="inline-block wow-button">
                    Launch Tool
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-black/20 backdrop-blur-sm border border-wow-purple/30 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-wow-purple mb-4">About WoW Tools</h2>
        <p className="text-gray-300 max-w-3xl mx-auto">
          This project aims to provide World of Warcraft players with essential tools to improve their gameplay. 
          From analyzing combat logs to tracking mythic+ progress, our suite of utilities helps players at all levels 
          optimize their performance and enjoy the game to its fullest.
        </p>
      </div>
    </div>
  )
}
