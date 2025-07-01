// WarcraftLogs API client for browser-side requests
const WARCRAFTLOGS_CLIENT_ID = '9f48ff54-5bd7-4e74-ac52-6d073f670e74';
const WARCRAFTLOGS_CLIENT_SECRET = '7hazpEdJ8pmuJdcyAn1mvUo0WX6Y1WTb86jI6yl3';

interface WarcraftLogsToken {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface WarcraftLogsResponse {
  data?: any;
  errors?: any[];
}

class WarcraftLogsClient {
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  async getAccessToken(): Promise<string> {
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    const response = await fetch('https://www.warcraftlogs.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: WARCRAFTLOGS_CLIENT_ID,
        client_secret: WARCRAFTLOGS_CLIENT_SECRET,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to get access token');
    }

    const tokenData: WarcraftLogsToken = await response.json();
    this.accessToken = tokenData.access_token;
    this.tokenExpiry = Date.now() + (tokenData.expires_in * 1000) - 60000; // 1 minute buffer

    return this.accessToken;
  }

  async query(query: string, variables: Record<string, any> = {}): Promise<WarcraftLogsResponse> {
    const token = await this.getAccessToken();

    const response = await fetch('https://www.warcraftlogs.com/api/v2/client', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    if (!response.ok) {
      throw new Error(`WarcraftLogs API error: ${response.statusText}`);
    }

    return response.json();
  }

  // Extract report ID from WarcraftLogs URL
  extractReportId(url: string): string | null {
    const match = url.match(/reports\/([a-zA-Z0-9]+)/);
    return match ? match[1] : null;
  }

  // Get basic report information
  async getReportInfo(reportId: string) {
    const query = `
      query GetReport($reportId: String!) {
        reportData {
          report(code: $reportId) {
            title
            owner {
              name
            }
            startTime
            endTime
            zone {
              name
            }
            fights {
              id
              name
              startTime
              endTime
              kill
              percentage
              difficulty
              size
            }
          }
        }
      }
    `;

    return this.query(query, { reportId });
  }

  // Get damage done data for a specific fight
  async getDamageData(reportId: string, fightId: number) {
    const query = `
      query GetDamage($reportId: String!, $fightIDs: [Int]!) {
        reportData {
          report(code: $reportId) {
            table(
              dataType: DamageDone
              fightIDs: $fightIDs
            )
          }
        }
      }
    `;

    return this.query(query, { reportId, fightIDs: [fightId] });
  }

  // Get healing data for a specific fight
  async getHealingData(reportId: string, fightId: number) {
    const query = `
      query GetHealing($reportId: String!, $fightIDs: [Int]!) {
        reportData {
          report(code: $reportId) {
            table(
              dataType: Healing
              fightIDs: $fightIDs
            )
          }
        }
      }
    `;

    return this.query(query, { reportId, fightIDs: [fightId] });
  }
}

export const warcraftLogsClient = new WarcraftLogsClient();
