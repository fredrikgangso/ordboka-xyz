import axios from "axios";

// Configuration
const SHEET_ID = "1BlGCwl__B38EJasz-95jmpRjuMdeVz6Cf_zAzOW_DQg"; // Replace with your Google Sheets ID
const SHEET_NAME = "Ordforklaringer"; // Replace with your sheet name if different
const API_KEY = ""; // Optional: Add your Google Sheets API key for better rate limits

class GoogleSheetsService {
  constructor() {
    this.baseUrl = "https://docs.google.com/spreadsheets/d";
    this.demoData = [
      {
        word: "Agn",
        wordClass: "Substantiv",
        definition:
          "Spiss som signer for vidden. Agner er lettere enn kjernen på kornet, og blåser bort med vinden, mens kornet faller ned.",
        example: "Tynt skall rundt kjernen på korn",
      },
      {
        word: "Akk",
        wordClass: "Interjeksjon",
        definition: "Uttrykk for sorg, fortvilelse eller hjelpesløshet",
        example: "",
      },
      {
        word: "Akte",
        wordClass: "Verb",
        inflections: "aktet, atselse",
        definition: "Regne seg selv som. Være oppmerksom på",
        definition2: "Ta hensyn til. Bli fullt voksen",
      },
      {
        word: "Almisse",
        wordClass: "Substantiv",
        definition:
          "Gave til vanskeligstilte. Bekymrefrielse så at det skal gå bra",
        definition2: "Helhjertet godjømmelse",
      },
    ];
  }

  isConfigured() {
    return SHEET_ID !== "YOUR_GOOGLE_SHEET_ID";
  }

  async fetchData() {
    // If not configured, return demo data
    if (!this.isConfigured()) {
      return new Promise((resolve) => {
        setTimeout(() => resolve(this.demoData), 1000); // Simulate loading
      });
    }

    try {
      // Method 1: Using CSV export (recommended for public sheets)
      const csvUrl = `${this.baseUrl}/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${SHEET_NAME}`;

      const response = await axios.get(csvUrl);
      const data = this.parseCSV(response.data);

      return data;
    } catch (error) {
      console.error("Error fetching from Google Sheets:", error);

      // Fallback: try JSON format
      try {
        const jsonUrl = `${this.baseUrl}/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${SHEET_NAME}`;
        const response = await axios.get(jsonUrl);
        const data = this.parseGoogleSheetsJSON(response.data);
        return data;
      } catch (jsonError) {
        console.error("JSON fallback also failed:", jsonError);
        throw new Error(
          "Failed to fetch data from Google Sheets. Please check your sheet ID and permissions."
        );
      }
    }
  }

  parseCSV(csvText) {
    const lines = csvText.split("\n");
    const data = [];

    // Debug: Log the first few lines to understand structure
    console.log("CSV Debug - First 3 lines:", lines.slice(0, 3));

    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim()) {
        const values = this.parseCSVLine(lines[i]);

        // Debug: Log the first few entries
        if (i <= 3) {
          console.log(`Row ${i} values:`, values);
        }

        // Skip if we don't have enough columns or the word is empty
        if (
          values.length < 7 ||
          !values[2] ||
          values[2].replace(/"/g, "").trim() === "" ||
          values[2].replace(/"/g, "").trim() === "TRUE" ||
          values[2].replace(/"/g, "").trim() === "Tittel på ord"
        ) {
          continue;
        }

        const entry = {
          word: values[2] ? values[2].replace(/"/g, "").trim() : "", // Column C - Word
          wordClass: values[3] ? values[3].replace(/"/g, "").trim() : "", // Column D - Ordklasse
          inflections: values[4] ? values[4].replace(/"/g, "").trim() : "", // Column E - Bøyninger
          additionalInfo: values[5] ? values[5].replace(/"/g, "").trim() : "", // Column F - Tilleggsinformasjon
          definition: values[6] ? values[6].replace(/"/g, "").trim() : "", // Column G - Definisjon 1
          definition2: values[7] ? values[7].replace(/"/g, "").trim() : "", // Column H - Definisjon 2
          definition3: values[8] ? values[8].replace(/"/g, "").trim() : "", // Column I - Definisjon 3
          definition4: values[9] ? values[9].replace(/"/g, "").trim() : "", // Column J - Definisjon 4
          definition5: values[10] ? values[10].replace(/"/g, "").trim() : "", // Column K - Definisjon 5
        };

        // Only add entries that have at least a word and one definition
        if (
          entry.word &&
          entry.definition &&
          entry.word !== "TRUE" &&
          entry.word !== "Tittel på ord"
        ) {
          data.push(entry);
        }
      }
    }

    console.log("Parsed entries:", data.slice(0, 3));
    return data;
  }

  parseCSVLine(line) {
    const result = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === "," && !inQuotes) {
        result.push(current);
        current = "";
      } else {
        current += char;
      }
    }

    result.push(current);
    return result;
  }

  parseGoogleSheetsJSON(jsonText) {
    // Remove the Google Sheets JSON prefix
    const cleanJson = jsonText
      .replace(/.*?google\.visualization\.Query\.setResponse\(/, "")
      .replace(/\);*$/, "");
    const parsed = JSON.parse(cleanJson);

    const rows = parsed.table.rows;
    const data = [];

    rows.forEach((row) => {
      const cells = row.c;
      if (cells && cells.length >= 7) {
        const entry = {
          word: cells[2] ? cells[2].v : "", // Column C
          wordClass: cells[3] ? cells[3].v : "", // Column D
          inflections: cells[4] ? cells[4].v : "", // Column E
          additionalInfo: cells[5] ? cells[5].v : "", // Column F
          definition: cells[6] ? cells[6].v : "", // Column G
          definition2: cells[7] ? cells[7].v : "", // Column H
          definition3: cells[8] ? cells[8].v : "", // Column I
          definition4: cells[9] ? cells[9].v : "", // Column J
          definition5: cells[10] ? cells[10].v : "", // Column K
        };

        if (
          entry.word &&
          entry.definition &&
          entry.word !== "TRUE" &&
          entry.word !== "Tittel på ord"
        ) {
          data.push(entry);
        }
      }
    });

    return data;
  }

  // Alternative method using Google Sheets API (requires API key)
  async fetchWithAPI() {
    if (!API_KEY) {
      throw new Error("Google Sheets API key not configured");
    }

    const range = `${SHEET_NAME}!C:K`; // Columns C-K for Norwegian dictionary
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}?key=${API_KEY}`;

    const response = await axios.get(url);
    const rows = response.data.values;

    if (!rows || rows.length < 2) {
      return [];
    }

    const data = [];

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (row && row.length >= 2 && row[0]) {
        const entry = {
          word: row[0] || "", // Column C (first in range)
          wordClass: row[1] || "", // Column D
          inflections: row[2] || "", // Column E
          additionalInfo: row[3] || "", // Column F
          definition: row[4] || "", // Column G
          definition2: row[5] || "", // Column H
          definition3: row[6] || "", // Column I
          definition4: row[7] || "", // Column J
          definition5: row[8] || "", // Column K
        };

        if (
          entry.word &&
          entry.definition &&
          entry.word !== "TRUE" &&
          entry.word !== "Tittel på ord"
        ) {
          data.push(entry);
        }
      }
    }

    return data;
  }
}

export const googleSheetsService = new GoogleSheetsService();
export default googleSheetsService;
