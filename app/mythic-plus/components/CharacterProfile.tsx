import { RaiderIOCharacter, formatTime, getKeystoneUpgradeColor, getScoreColor, getRoleIcon } from '@/lib/raiderio';
import { Clock, Star, Award, TrendingUp } from 'lucide-react';

interface CharacterProfileProps {
  character: RaiderIOCharacter;
}

export default function CharacterProfile({ character }: CharacterProfileProps) {
  const currentSeasonScore = character.mythic_plus_scores_by_season?.[0]?.scores.all || 0;
  
  return (
    <div className="space-y-6">
      {/* Character Header */}
      <div className="tool-card">
        <div className="flex items-center space-x-6">
          <img
            src={character.thumbnail_url}
            alt={character.name}
            className="w-24 h-24 rounded-lg border-2 border-wow-gold"
          />
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h2 className="text-2xl font-bold">{character.name}</h2>
              <span className="text-lg text-gray-300">
                {getRoleIcon(character.active_spec_role)} {character.active_spec_name}
              </span>
              <span className={`text-sm px-2 py-1 rounded ${character.faction === 'alliance' ? 'bg-blue-600' : 'bg-red-600'}`}>
                {character.faction}
              </span>
            </div>
            <div className="text-gray-300 space-y-1">
              <p>{character.race} {character.class}</p>
              <p>{character.realm} - {character.region.toUpperCase()}</p>
              <p>Achievement Points: {character.achievement_points?.toLocaleString()}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-400 mb-1">Current Season</div>
            <div className={`text-3xl font-bold ${getScoreColor(currentSeasonScore)}`}>
              {currentSeasonScore.toFixed(0)}
            </div>
            <div className="text-sm text-gray-400">Mythic+ Score</div>
          </div>
        </div>
      </div>

      {/* Score Breakdown */}
      {character.mythic_plus_scores_by_season && character.mythic_plus_scores_by_season.length > 0 && (
        <div className="tool-card">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <Award className="w-5 h-5 mr-2" />
            Score Breakdown
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(character.mythic_plus_scores_by_season[0].scores).map(([role, score]) => {
              if (role.startsWith('spec_')) return null;
              return (
                <div key={role} className="text-center p-3 bg-gray-800 rounded-lg">
                  <div className="text-sm text-gray-400 capitalize mb-1">{role}</div>
                  <div className={`text-xl font-bold ${getScoreColor(score)}`}>
                    {score.toFixed(0)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent Runs */}
      {character.mythic_plus_recent_runs && character.mythic_plus_recent_runs.length > 0 && (
        <div className="tool-card">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            Recent Runs
          </h3>
          <div className="space-y-3">
            {character.mythic_plus_recent_runs.slice(0, 10).map((run, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <div className="text-xl font-bold text-wow-purple">+{run.mythic_level}</div>
                    <div className="text-xs text-gray-400">{run.short_name}</div>
                  </div>
                  <div>
                    <div className="font-medium">{run.dungeon}</div>
                    <div className="text-sm text-gray-400">
                      {new Date(run.completed_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className={`font-bold ${getKeystoneUpgradeColor(run.num_keystone_upgrades)}`}>
                      {formatTime(run.clear_time_ms)}
                    </span>
                    <span className="text-gray-400">
                      ({formatTime(run.par_time_ms)})
                    </span>
                  </div>
                  <div className={`text-sm ${getScoreColor(run.score)}`}>
                    {run.score.toFixed(1)} points
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Best Runs */}
      {character.mythic_plus_best_runs && character.mythic_plus_best_runs.length > 0 && (
        <div className="tool-card">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <Star className="w-5 h-5 mr-2" />
            Best Runs (Highest Score)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {character.mythic_plus_best_runs.map((run, index) => (
              <div key={index} className="p-4 bg-gray-800 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-bold text-lg">{run.dungeon}</div>
                    <div className="text-wow-purple font-bold">+{run.mythic_level}</div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${getScoreColor(run.score)}`}>
                      {run.score.toFixed(1)}
                    </div>
                    <div className="text-sm text-gray-400">points</div>
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className={`font-medium ${getKeystoneUpgradeColor(run.num_keystone_upgrades)}`}>
                    {formatTime(run.clear_time_ms)}
                  </span>
                  <span className="text-gray-400">
                    {new Date(run.completed_at).toLocaleDateString()}
                  </span>
                </div>
                {run.affixes && run.affixes.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {run.affixes.map((affix, affixIndex) => (
                      <span key={affixIndex} className="text-xs bg-gray-700 px-2 py-1 rounded">
                        {affix.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Highest Level Runs */}
      {character.mythic_plus_highest_level_runs && character.mythic_plus_highest_level_runs.length > 0 && (
        <div className="tool-card">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Highest Level Runs
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {character.mythic_plus_highest_level_runs.map((run, index) => (
              <div key={index} className="p-4 bg-gray-800 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-bold text-lg">{run.dungeon}</div>
                    <div className="text-wow-gold font-bold text-xl">+{run.mythic_level}</div>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold ${getKeystoneUpgradeColor(run.num_keystone_upgrades)}`}>
                      {formatTime(run.clear_time_ms)}
                    </div>
                    <div className="text-sm text-gray-400">
                      {run.num_keystone_upgrades} upgrades
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className={`${getScoreColor(run.score)}`}>
                    {run.score.toFixed(1)} points
                  </span>
                  <span className="text-gray-400">
                    {new Date(run.completed_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
