import { NextRequest, NextResponse } from 'next/server';

const RAIDERIO_BASE_URL = 'https://raider.io/api/v1';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const region = searchParams.get('region') || 'us';

  try {
    // Build the Raider.IO API URL
    const raiderIOUrl = `${RAIDERIO_BASE_URL}/mythic-plus/affixes?region=${encodeURIComponent(region)}`;
    
    // Fetch data from Raider.IO
    const response = await fetch(raiderIOUrl, {
      headers: {
        'User-Agent': 'WoW-Tools/1.0 (https://eladser.github.io/wow-tools)',
      },
      // Cache for 1 hour since affixes change weekly
      next: { revalidate: 3600 }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Raider.IO Affixes API Error:', response.status, errorText);
      
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
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=300'
      }
    });

  } catch (error) {
    console.error('Error fetching affixes data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch affixes data' },
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
