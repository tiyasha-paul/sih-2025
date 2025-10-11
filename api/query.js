// Vercel Serverless Function - Query Endpoint
const fs = require('fs');
const path = require('path');

// Load and process metadata
let metadataJson = null;

function loadMetadata() {
  if (metadataJson) return metadataJson;

  const dataPath = path.join(process.cwd(), 'CHAT', 'data.json');
  const dataContent = fs.readFileSync(dataPath, 'utf8');
  const dataJson = JSON.parse(dataContent);

  metadataJson = {};

  for (const [state, records] of Object.entries(dataJson)) {
    for (const record of records) {
      record.state = state.trim().toUpperCase();
      record.location = record.location.trim().toUpperCase();

      try {
        const extraction = record.ground_water_extraction_ham;
        const extractable = record.annual_extractable_ground_water_resources_ham;

        if (extraction == null || extractable == null || extractable === 0) {
          record.sgwd = null;
          record.approx_category = 'N/A';
        } else {
          record.sgwd = (parseFloat(extraction) / parseFloat(extractable)) * 100;

          if (record.sgwd <= 70) {
            record.approx_category = 'Safe';
          } else if (record.sgwd <= 90) {
            record.approx_category = 'Semi-Critical';
          } else if (record.sgwd < 100) {
            record.approx_category = 'Critical';
          } else {
            record.approx_category = 'Over-Exploited';
          }
        }
      } catch (e) {
        record.sgwd = null;
        record.approx_category = 'N/A';
      }

      const key = `${record.location}_${record.state}_${record.year.trim()}`;
      metadataJson[key] = record;
    }
  }

  return metadataJson;
}

function normalize(s) {
  if (!s) return '';
  return s.trim().toUpperCase().replace(/\s+/g, ' ');
}

function extractLocationAndYear(query) {
  const yearMatch = query.match(/\b(\d{4}(?:-\d{2,4})?)\b/);
  const year = yearMatch ? yearMatch[1] : null;

  let queryClean = year ? query.replace(year, '').trim() : query;

  const vizKeywords = /(?:plot|graph|chart|visuali[sz]e|visualization|trend|show|display|generate|bar)/i;
  const hasVizKeyword = vizKeywords.test(queryClean);

  let queryType = null;
  if (hasVizKeyword) {
    if (/category|bar/i.test(queryClean)) {
      queryType = 'category_bar';
    } else {
      queryType = 'trend';
    }
  }

  const keywordsToRemove = /(groundwater|gw|rainfall|rain|details|level|information|full|category|of|for|in|the|at|on|plot|graph|show|display|generate|visuali[sz]e|visualization|chart|trend|bar|extraction|from|to|about|\?|and)/gi;
  queryClean = queryClean.replace(keywordsToRemove, '').trim().replace(/\s+/g, ' ');

  const parts = queryClean.split(/\s+/).filter(p => p && !['the', 'at', 'on', 'of'].includes(p.toLowerCase()));
  const location = parts.length > 0 ? parts.join(' ') : null;

  let state = null;
  if (location) {
    const metadata = loadMetadata();
    const locationNorm = normalize(location);

    for (const record of Object.values(metadata)) {
      if (normalize(record.state) === locationNorm || normalize(record.state).startsWith(locationNorm)) {
        state = record.state;
        break;
      }
    }

    if (!state) {
      for (const record of Object.values(metadata)) {
        const recordLoc = normalize(record.location);
        if (recordLoc === locationNorm || recordLoc.startsWith(locationNorm) || locationNorm.includes(recordLoc)) {
          state = record.state;
          break;
        }
      }
    }
  }

  return { location, state, year, queryType };
}

function generateVisualizationResponse(queryType, state, location, year) {
  state = state || 'Delhi';
  year = year || '2024';

  if (queryType === 'category_bar') {
    return {
      query_type: 'category_bar',
      state,
      year,
      answer: `📊 Category Distribution for ${state} (${year})\n\nThis shows the distribution of groundwater categories:\n• Safe (≤70% SGWD)\n• Semi-Critical (70-90%)\n• Critical (>90% with decline)\n• Over-Exploited (>100%)\n\nNote: Live visualization generation is available when running the local Flask server.`,
      graph: null
    };
  } else if (queryType === 'trend') {
    const locationDisplay = location || 'All Locations';
    return {
      query_type: 'trend',
      state,
      location,
      answer: `📈 Groundwater Extraction Trend for ${state} - ${locationDisplay}\n\nThis displays groundwater extraction patterns over time.\n\nNote: Live visualization generation is available when running the local Flask server.`,
      graph: null
    };
  }
  return null;
}

function findRecord(location, state, year) {
  if (!location || !year) return null;

  const metadata = loadMetadata();
  const locNorm = normalize(location);
  const yearNorm = year.replace(/[\s-]/g, '').match(/(\d{4})/)?.[1];

  for (const record of Object.values(metadata)) {
    const recordLocNorm = normalize(record.location);
    const recordYearNorm = record.year.replace(/[\s-]/g, '').match(/(\d{4})/)?.[1];

    if ((locNorm === recordLocNorm || recordLocNorm.includes(locNorm) || recordLocNorm.startsWith(locNorm)) &&
        (!state || normalize(record.state) === normalize(state)) &&
        (recordYearNorm === yearNorm || recordYearNorm?.startsWith(yearNorm))) {
      return record;
    }
  }

  return null;
}

function formatGroundwaterResponse(record) {
  if (!record) return 'No data found for the specified location and year.';

  let response = `📍 ${record.location}, ${record.state} (${record.year})\n\n`;

  if (record.sgwd != null) {
    response += `🌊 Groundwater Status:\n`;
    response += `• SGWD: ${record.sgwd.toFixed(1)}%\n`;
    response += `• Category: ${record.approx_category || 'N/A'}\n`;
    response += `• Extraction: ${record.ground_water_extraction_ham.toFixed(1)} ha m\n`;
    response += `• Extractable: ${record.annual_extractable_ground_water_resources_ham.toFixed(1)} ha m\n`;
  }

  if (record.rainfall_mm != null) {
    response += `\n🌧️ Rainfall: ${record.rainfall_mm.toFixed(1)} mm\n`;
  }

  return response;
}

module.exports = (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  // Handle OPTIONS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { query: q, lang } = req.body || {};

    if (!q) {
      return res.status(400).json({
        error: 'Query parameter is required',
        answer: 'Please provide a query in the request body'
      });
    }

    // Parse query
    const { location, state, year, queryType } = extractLocationAndYear(q);

    const response = {
      query: q,
      location,
      state,
      year,
      query_type: queryType,
      graph: null,
      answer: null
    };

    // Handle visualization requests
    if (queryType === 'category_bar' || queryType === 'trend') {
      const vizResponse = generateVisualizationResponse(queryType, state, location, year);
      if (vizResponse) {
        Object.assign(response, vizResponse);
      }
    } else {
      // Handle data queries
      if (location && year) {
        const record = findRecord(location, state, year);
        if (record) {
          response.answer = formatGroundwaterResponse(record);
        } else {
          response.answer = `No data found for ${location} in ${year}. Please check the location name and year.`;
        }
      } else {
        response.answer = 'Please specify a location and year in your query. Example: "Show data for Delhi 2024"';
      }
    }

    res.status(200).json(response);
  } catch (error) {
    console.error('Error processing query:', error);
    res.status(500).json({
      error: error.message,
      answer: `Error processing query: ${error.message}`
    });
  }
};
