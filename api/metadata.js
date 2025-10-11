// Vercel Serverless Function - Metadata Endpoint
const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  // Handle OPTIONS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Load data.json from CHAT folder
    const dataPath = path.join(process.cwd(), 'CHAT', 'data.json');
    const dataContent = fs.readFileSync(dataPath, 'utf8');
    const dataJson = JSON.parse(dataContent);

    // Process and convert to metadata format
    const metadataJson = {};

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

    res.status(200).json(metadataJson);
  } catch (error) {
    console.error('Error loading metadata:', error);
    res.status(500).json({
      error: error.message,
      message: 'Failed to load groundwater metadata'
    });
  }
};
