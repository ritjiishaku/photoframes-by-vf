import { google } from 'googleapis';
import { JWT } from 'google-auth-library';

function getKey(): string {
  const raw = process.env.GOOGLE_PRIVATE_KEY ?? '';
  if (!raw) return '';
  // Handle both formats: actual newlines and escaped \n
  if (raw.includes('-----BEGIN')) return raw.replace(/\\n/g, '\n');
  // If somehow neither, return as-is
  return raw;
}

function getAuth(): JWT | null {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const key = getKey();
  if (!email || !key) return null;

  return new JWT({
    email,
    key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });
}

export async function getSheetRows(
  sheetName: string,
): Promise<string[][]> {
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;

  if (!spreadsheetId) {
    console.error('[getSheetRows] GOOGLE_SHEET_ID is not set');
    return [];
  }

  const auth = getAuth();
  if (!auth) {
    console.error('[getSheetRows] GOOGLE_SERVICE_ACCOUNT_EMAIL or GOOGLE_PRIVATE_KEY is not set');
    return [];
  }

  const sheets = google.sheets({ version: 'v4', auth });

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${sheetName}!A:Z`,
  });

  const rows = response.data.values ?? [];
  return rows.slice(1).filter(row => row.length > 0);
}
