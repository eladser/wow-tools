import { RaiderIOCharacter, getWarcraftLogsUrl, getRaiderIOUrl, getWoWProgressUrl } from '@/lib/raiderio';
import { ExternalLink, BarChart3, Trophy, TrendingUp } from 'lucide-react';

interface ExternalLinksProps {
  character: RaiderIOCharacter;
}

export default function ExternalLinks({ character }: ExternalLinksProps) {
  const links = [
    {
      name: 'WarcraftLogs',
      description: 'View raid performance and detailed combat logs',
      url: getWarcraftLogsUrl(character.name, character.realm, character.region),
      icon: <BarChart3 className="w-5 h-5" />,
      color: 'bg-orange-600 hover:bg-orange-700',
      textColor: 'text-white'
    },
    {
      name: 'Raider.IO Profile',
      description: 'Full Raider.IO profile with detailed M+ statistics',
      url: getRaiderIOUrl(character.name, character.realm, character.region),
      icon: <Trophy className="w-5 h-5" />,
      color: 'bg-blue-600 hover:bg-blue-700',
      textColor: 'text-white'
    },
    {
      name: 'WoWProgress',
      description: 'Guild progress and raid achievements',
      url: getWoWProgressUrl(character.name, character.realm, character.region),
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'bg-green-600 hover:bg-green-700',
      textColor: 'text-white'
    },
    {
      name: 'Armory',
      description: 'Official Blizzard character armory',
      url: `https://worldofwarcraft.blizzard.com/en-us/character/${character.region}/${character.realm.toLowerCase().replace(/[^a-z0-9]/g, '')}/${character.name.toLowerCase()}`,
      icon: <ExternalLink className="w-5 h-5" />,
      color: 'bg-wow-blue hover:bg-blue-800',
      textColor: 'text-white'
    }
  ];

  return (
    <div className="tool-card">
      <h3 className="text-xl font-semibold mb-4 flex items-center">
        <ExternalLink className="w-5 h-5 mr-2" />
        External Resources
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {links.map((link, index) => (
          <a
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`${link.color} ${link.textColor} p-4 rounded-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg group`}
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                {link.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold mb-1 flex items-center">
                  {link.name}
                  <ExternalLink className="w-3 h-3 ml-2 opacity-60" />
                </div>
                <p className="text-sm opacity-80 leading-tight">
                  {link.description}
                </p>
              </div>
            </div>
          </a>
        ))}
      </div>

      <div className="mt-4 p-3 bg-gray-800/30 rounded-lg">
        <p className="text-sm text-gray-400">
          💡 <strong>Tip:</strong> These external links provide additional insights into {character.name}'s performance. 
          WarcraftLogs shows raid performance, while Raider.IO offers comprehensive M+ analysis.
        </p>
      </div>
    </div>
  );
}
