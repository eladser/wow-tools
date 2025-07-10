import React from 'react';
import { Users, Trophy, Star, ExternalLink, Calendar, Clock, Target } from 'lucide-react';
import { WarbandAnalysis, WarbandCharacter, getSeasonName, getScoreColor, getRoleIcon, formatTime, getKeystoneUpgradeColor, searchWarcraftLogsForRun } from '@/lib/raiderio';

interface WarbandAnalysisProps {
  warbandData: WarbandAnalysis;
  region: string;
}

const WarbandAnalysisComponent: React.FC<WarbandAnalysisProps> = ({ warbandData, region }) => {
  const { characters, highestScoresBySeasonAcrossWarband, totalCharacters, mainCharacter } = warbandData;
  
  // Sort seasons for display
  const sortedSeasons = Object.entries(highestScoresBySeasonAcrossWarband).sort(([a], [b]) => {
    // Put current season first (TWW), then by season number
    if (a.includes('tww') && !b.includes('tww')) return -1;
    if (!a.includes('tww') && b.includes('tww')) return 1;
    
    const aNum = parseInt(a.split('-').pop() || '0');
    const bNum = parseInt(b.split('-').pop() || '0');
    return bNum - aNum;
  });

  const handleWarcraftLogsSearch = async (character: WarbandCharacter, run: any) => {
    const searchUrl = await searchWarcraftLogsForRun(
      character.character.name,
      character.character.realm,
      character.character.region,
      run.completed_at,
      run.dungeon
    );
    
    if (searchUrl) {
      window.open(searchUrl, '_blank');
    }
  };

  return (
    <div className="space-y-8">
      {/* Warband Overview */}
      <div className="tool-card">
        <div className="flex items-center space-x-3 mb-6">
          <Users className="w-8 h-8 text-wow-purple" />
          <div>
            <h2 className="text-2xl font-bold text-wow-purple">Warband Analysis</h2>
            <p className="text-gray-300">
              {totalCharacters} character{totalCharacters > 1 ? 's' : ''} found
              {mainCharacter && ` - Main: ${mainCharacter.character.name}`}
            </p>
          </div>
        </div>

        {/* Highest Scores by Season */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-wow-gold" />
            <span>Highest Scores by Season (Across All Characters)</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedSeasons.map(([seasonId, data]) => (
              <div key={seasonId} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-wow-blue">{getSeasonName(seasonId)}</h4>
                  {seasonId.includes('tww-1') && (
                    <span className="bg-wow-purple text-xs px-2 py-1 rounded">Current</span>
                  )}
                </div>
                <div className={`text-2xl font-bold ${getScoreColor(data.score)}`}>
                  {data.score.toLocaleString()}
                </div>
                <div className="text-sm text-gray-400">
                  <div>{data.character} ({data.characterClass})</div>
                  <div>{getRoleIcon(data.characterSpec)} {data.characterSpec}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Character List */}
        <div>
          <h3 className="text-xl font-semibold mb-4 flex items-center space-x-2">
            <Users className="w-5 h-5 text-wow-blue" />
            <span>Characters in Warband</span>
          </h3>
          <div className="space-y-4">
            {characters.map((warbandChar, index) => (
              <CharacterCard key={index} warbandChar={warbandChar} region={region} onWarcraftLogsSearch={handleWarcraftLogsSearch} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

interface CharacterCardProps {
  warbandChar: WarbandCharacter;
  region: string;
  onWarcraftLogsSearch: (character: WarbandCharacter, run: any) => void;
}

const CharacterCard: React.FC<CharacterCardProps> = ({ warbandChar, region, onWarcraftLogsSearch }) => {
  const { character, isMain, highestSeasonScore, currentSeasonScore } = warbandChar;
  
  return (
    <div className={`bg-gray-800 rounded-lg p-6 border-2 ${isMain ? 'border-wow-gold' : 'border-gray-700'}`}>
      <div className="flex items-start space-x-4">
        {/* Character Avatar */}
        <div className="flex-shrink-0">
          <img 
            src={character.thumbnail_url} 
            alt={character.name}
            className="w-16 h-16 rounded-lg border-2 border-gray-600"
          />
        </div>
        
        {/* Character Info */}
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h4 className="text-xl font-bold text-white">{character.name}</h4>
            {isMain && (
              <span className="bg-wow-gold text-black text-xs px-2 py-1 rounded font-medium">
                Main
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-4 mb-3 text-sm text-gray-300">
            <span>{character.race} {character.class}</span>
            <span>{getRoleIcon(character.active_spec_role)} {character.active_spec_name}</span>
            <span>{character.realm}</span>
          </div>
          
          {/* Scores */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-700 rounded p-3">
              <div className="text-sm text-gray-400">Current Season</div>
              <div className={`text-xl font-bold ${getScoreColor(currentSeasonScore)}`}>
                {currentSeasonScore.toLocaleString()}
              </div>
            </div>
            <div className="bg-gray-700 rounded p-3">
              <div className="text-sm text-gray-400">All-Time High</div>
              <div className={`text-xl font-bold ${getScoreColor(highestSeasonScore)}`}>
                {highestSeasonScore.toLocaleString()}
              </div>
            </div>
          </div>
          
          {/* Current Season Best Runs with WarcraftLogs Integration */}
          {character.mythic_plus_best_runs && character.mythic_plus_best_runs.length > 0 && (
            <div>
              <h5 className="text-sm font-medium text-gray-300 mb-2">Current Season Best Runs</h5>
              <div className="space-y-2">
                {character.mythic_plus_best_runs.slice(0, 3).map((run, runIndex) => (
                  <div key={runIndex} className="bg-gray-700 rounded p-3 text-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-wow-blue">{run.short_name}</span>
                        <span className="text-wow-orange">+{run.mythic_level}</span>
                        <span className={`${getKeystoneUpgradeColor(run.num_keystone_upgrades)}`}>
                          {run.num_keystone_upgrades === 3 ? '★★★' : 
                           run.num_keystone_upgrades === 2 ? '★★' : 
                           run.num_keystone_upgrades === 1 ? '★' : ''}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-400">{formatTime(run.clear_time_ms)}</span>
                        <button
                          onClick={() => onWarcraftLogsSearch(warbandChar, run)}
                          className="text-wow-purple hover:text-wow-blue transition-colors"
                          title="Search WarcraftLogs"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(run.completed_at).toLocaleDateString()} • Score: {run.score.toFixed(1)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* External Links */}
          <div className="flex space-x-2 mt-4">
            <a
              href={character.profile_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm bg-wow-blue hover:bg-blue-600 text-white px-3 py-1 rounded transition-colors"
            >
              Raider.IO
            </a>
            <a
              href={`https://www.warcraftlogs.com/character/${region.toUpperCase()}/${character.realm}/${character.name}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm bg-wow-purple hover:bg-purple-600 text-white px-3 py-1 rounded transition-colors"
            >
              WarcraftLogs
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WarbandAnalysisComponent;
