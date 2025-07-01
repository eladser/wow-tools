import { useState, useEffect } from 'react';
import { MythicPlusAffixes, getCurrentAffixes } from '@/lib/raiderio';
import { Shield, Skull, Zap, AlertTriangle } from 'lucide-react';

interface CurrentAffixesProps {
  region?: string;
}

export default function CurrentAffixes({ region = 'us' }: CurrentAffixesProps) {
  const [affixes, setAffixes] = useState<MythicPlusAffixes | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAffixes = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getCurrentAffixes(region);
        setAffixes(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch affixes');
      } finally {
        setLoading(false);
      }
    };

    fetchAffixes();
  }, [region]);

  const getAffixIcon = (affixName: string) => {
    const name = affixName.toLowerCase();
    if (name.includes('fortified') || name.includes('tyrannical')) {
      return <Shield className=\"w-6 h-6\" />;
    }
    if (name.includes('sanguine') || name.includes('necrotic') || name.includes('grievous')) {
      return <Skull className=\"w-6 h-6\" />;
    }
    if (name.includes('bolstering') || name.includes('raging') || name.includes('volcanic')) {
      return <Zap className=\"w-6 h-6\" />;
    }
    return <AlertTriangle className=\"w-6 h-6\" />;
  };

  const getAffixColor = (affixName: string) => {
    const name = affixName.toLowerCase();
    if (name.includes('fortified') || name.includes('tyrannical')) {
      return 'text-blue-400 bg-blue-900/30';
    }
    if (name.includes('sanguine') || name.includes('necrotic') || name.includes('grievous')) {
      return 'text-red-400 bg-red-900/30';
    }
    if (name.includes('bolstering') || name.includes('raging') || name.includes('volcanic')) {
      return 'text-yellow-400 bg-yellow-900/30';
    }
    return 'text-purple-400 bg-purple-900/30';
  };

  if (loading) {
    return (
      <div className=\"tool-card\">
        <h3 className=\"text-xl font-semibold mb-4\">Current Week Affixes</h3>
        <div className=\"flex justify-center items-center py-8\">
          <div className=\"animate-spin rounded-full h-8 w-8 border-b-2 border-wow-purple\"></div>
        </div>
      </div>
    );
  }

  if (error || !affixes) {
    return (
      <div className=\"tool-card\">
        <h3 className=\"text-xl font-semibold mb-4\">Current Week Affixes</h3>
        <div className=\"text-red-400 text-center py-4\">
          {error || 'Failed to load affixes'}
        </div>
      </div>
    );
  }

  return (
    <div className=\"tool-card\">
      <div className=\"flex items-center justify-between mb-4\">
        <h3 className=\"text-xl font-semibold\">Current Week Affixes</h3>
        <span className=\"text-sm text-gray-400 uppercase\">{region}</span>
      </div>
      
      <div className=\"space-y-4\">
        {affixes.affix_details.map((affix, index) => (
          <div 
            key={affix.id} 
            className={`p-4 rounded-lg border ${getAffixColor(affix.name)}`}
          >
            <div className=\"flex items-start space-x-4\">
              <div className={`flex-shrink-0 p-2 rounded-lg ${getAffixColor(affix.name)}`}>
                {getAffixIcon(affix.name)}
              </div>
              <div className=\"flex-1\">
                <div className=\"flex items-center space-x-2 mb-2\">
                  <h4 className=\"font-bold text-lg\">{affix.name}</h4>
                  <span className=\"text-sm text-gray-400\">
                    {index === 0 ? 'Level 2+' : index === 1 ? 'Level 4+' : index === 2 ? 'Level 7+' : 'Level 10+'}
                  </span>
                </div>
                <p className=\"text-gray-300 text-sm leading-relaxed\">
                  {affix.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {affixes.title && (
        <div className=\"mt-4 text-center\">
          <h4 className=\"text-lg font-semibold text-wow-gold\">{affixes.title}</h4>
        </div>
      )}

      {affixes.leaderboard_url && (
        <div className=\"mt-4 text-center\">
          <a 
            href={affixes.leaderboard_url} 
            target=\"_blank\" 
            rel=\"noopener noreferrer\"
            className=\"wow-button inline-block\"
          >
            View Leaderboard
          </a>
        </div>
      )}
    </div>
  );
}
