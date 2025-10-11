// Vercel Serverless Function - API Root
module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  res.status(200).json({
    status: 'ok',
    message: 'HydroLens API is running',
    endpoints: {
      '/api/query': 'POST - Process groundwater queries',
      '/api/metadata': 'GET - Retrieve groundwater metadata'
    }
  });
};
