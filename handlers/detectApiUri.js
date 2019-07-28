
/**
 * Adds current API url to `res.locals.apiBaseUri`
 * 
 */
module.exports = function detectApiUri(req, res, next) {
  let apiBaseUri = 'https://rickandmortyapi.com/api'
  if (process.env.API_BASE_URI || process.env.API_BASE_URL) {
    apiBaseUri = process.env.API_BASE_URI || process.env.API_BASE_URL
  }
  res.locals.apiBaseUri = apiBaseUri
  next()
  // ** Unreliable (in vhost envs) method to detect requesting path **
  // const port = process.env.PORT || '8080';
  // const portInUrl = (port === 80 || port === 443 ? '' : ':' + port)
  // res.locals.apiBaseUri = req.protocol + '://' + req.host + portInUrl + '/api'
}
