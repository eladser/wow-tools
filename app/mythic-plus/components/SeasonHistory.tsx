import { RaiderIOCharacter, getScoreColor, getSeasonName, sortSeasons } from '@/lib/raiderio';
import { Calendar, TrendingUp, Trophy, BarChart3 } from 'lucide-react';

interface SeasonHistoryProps {
  character: RaiderIOCharacter;
}

export default function SeasonHistory({ character }: SeasonHistoryProps) {
  if (!character.mythic_plus_scores_by_season || character.mythic_plus_scores_by_season.length === 0) {
    return (
      <div className="tool-card">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <Calendar className="w-5 h-5 mr-2" />
          Season History
        </h3>
        <p className="text-gray-400 text-center py-8">
          No season data available for this character.
        </p>
      </div>
    );
  }

  const sortedSeasons = sortSeasons(character.mythic_plus_scores_by_season);
  
  // Find highest score across all seasons
  const highestScore = Math.max(...sortedSeasons.map(s => s.scores.all));
  const highestScoreSeason = sortedSeasons.find(s => s.scores.all === highestScore);

  // Calculate trend (current vs previous season)
  const currentScore = sortedSeasons[0]?.scores.all || 0;
  const previousScore = sortedSeasons[1]?.scores.all || 0;
  const scoreTrend = currentScore - previousScore;

  return (
    <div className="tool-card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold flex items-center">
          <Calendar className="w-5 h-5 mr-2" />
          Season History
        </h3>
        <div className="flex items-center space-x-4 text-sm">
          <div className="text-center">
            <div className="text-gray-400">Peak Score</div>
            <div className={`font-bold ${getScoreColor(highestScore)}`}>
              {highestScore.toFixed(0)}
            </div>
          </div>
          {scoreTrend !== 0 && (
            <div className="text-center">
              <div className="text-gray-400">Trend</div>
              <div className={`font-bold flex items-center ${scoreTrend > 0 ? 'text-green-400' : 'text-red-400'}`}>
                <TrendingUp className={`w-4 h-4 mr-1 ${scoreTrend < 0 ? 'rotate-180' : ''}`} />
                {scoreTrend > 0 ? '+' : ''}{scoreTrend.toFixed(0)}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {sortedSeasons.map((season, index) => {
          const isCurrentSeason = index === 0;
          const isPeakSeason = season.scores.all === highestScore;
          
          return (
            <div 
              key={season.season} 
              className={`p-4 rounded-lg border-2 transition-all ${
                isCurrentSeason 
                  ? 'border-wow-purple bg-wow-purple/10' 
                  : isPeakSeason
                  ? 'border-wow-gold bg-wow-gold/10'
                  : 'border-gray-700 bg-gray-800/50'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <h4 className="font-semibold text-lg">
                    {getSeasonName(season.season)}
                  </h4>
                  <div className="flex space-x-2">
                    {isCurrentSeason && (
                      <span className="text-xs bg-wow-purple px-2 py-1 rounded">
                        Current
                      </span>
                    )}
                    {isPeakSeason && (
                      <span className="text-xs bg-wow-gold text-black px-2 py-1 rounded flex items-center">
                        <Trophy className="w-3 h-3 mr-1" />
                        Peak
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-bold ${getScoreColor(season.scores.all)}`}>
                    {season.scores.all.toFixed(0)}
                  </div>
                  <div className="text-sm text-gray-400">Overall Score</div>
                </div>
              </div>

              {/* Role Breakdown */}
              <div className="grid grid-cols-3 gap-4">
                {Object.entries(season.scores)
                  .filter(([role]) => ['dps', 'healer', 'tank'].includes(role))
                  .map(([role, score]) => (
                    <div key={role} className="text-center">
                      <div className="text-sm text-gray-400 capitalize mb-1">
                        {role === 'dps' ? 'DPS' : role}
                      </div>
                      <div className={`font-bold ${getScoreColor(score)}`}>
                        {score.toFixed(0)}
                      </div>
                    </div>
                  ))}
              </div>

              {/* Score Comparison Bar */}
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                  <span>Score Progress</span>
                  <span>{((season.scores.all / highestScore) * 100).toFixed(0)}% of peak</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      isPeakSeason ? 'bg-wow-gold' : 'bg-wow-purple'
                    }`}
                    style={{ width: `${(season.scores.all / highestScore) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Season Statistics */}
      <div className="mt-6 p-4 bg-gray-800/30 rounded-lg">
        <h4 className="font-semibold mb-3 flex items-center">
          <BarChart3 className="w-4 h-4 mr-2" />
          Season Statistics
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-center">
            <div className="text-gray-400">Seasons Played</div>
            <div className="font-bold text-wow-blue">{sortedSeasons.length}</div>
          </div>
          <div className="text-center">
            <div className="text-gray-400">Average Score</div>
            <div className="font-bold text-wow-green">
              {(sortedSeasons.reduce((sum, s) => sum + s.scores.all, 0) / sortedSeasons.length).toFixed(0)}
            </div>
          </div>
          <div className="text-center">
            <div className="text-gray-400">Peak Season</div>
            <div className="font-bold text-wow-gold">
              {highestScoreSeason ? getSeasonName(highestScoreSeason.season).split(' ').slice(-2).join(' ') : 'N/A'}
            </div>
          </div>
          <div className="text-center">
            <div className="text-gray-400">Score Range</div>
            <div className="font-bold text-wow-purple">
              {Math.min(...sortedSeasons.map(s => s.scores.all)).toFixed(0)} - {highestScore.toFixed(0)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
