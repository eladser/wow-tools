import { NextRequest, NextResponse } from 'next/server';

const RAIDERIO_BASE_URL = 'https://raider.io/api/v1';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  // Extract parameters
  const region = searchParams.get('region') || 'us';
  const realm = searchParams.get('realm');
  const name = searchParams.get('name');
  const fields = searchParams.get('fields') || 'mythic_plus_scores_by_season:current,mythic_plus_recent_runs,mythic_plus_best_runs,mythic_plus_alternate_runs,mythic_plus_highest_level_runs';

  // Validate required parameters
  if (!realm || !name) {
    return NextResponse.json(
      { error: 'Missing required parameters: realm and name' },
      { status: 400 }
    );
  }

  try {
    // Build the Raider.IO API URL
    const raiderIOUrl = `${RAIDERIO_BASE_URL}/characters/profile?region=${encodeURIComponent(region)}&realm=${encodeURIComponent(realm)}&name=${encodeURIComponent(name)}&fields=${encodeURIComponent(fields)}`;
    
    // Fetch data from Raider.IO
    const response = await fetch(raiderIOUrl, {
      headers: {
        'User-Agent': 'WoW-Tools/1.0 (https://eladser.github.io/wow-tools)',
      },
      // Cache for 5 minutes
      next: { revalidate: 300 }
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'Character not found' },
          { status: 404 }
        );
      }
      
      const errorText = await response.text();
      console.error('Raider.IO API Error:', response.status, errorText);
      
      return NextResponse.json(
        { error: `Raider.IO API error: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // Add CORS headers and return the data
    return NextResponse.json(data, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60'
      }
    });

  } catch (error) {
    console.error('Error fetching character data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch character data' },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
}
