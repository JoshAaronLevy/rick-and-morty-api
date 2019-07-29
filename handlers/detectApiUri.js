const helpers = require('../utils/helpers.js')
/**
 * Adds current API url to `res.locals.apiBaseUri`
 *
 */
module.exports = function detectApiUri(req, res, next) {
  res.locals.apiBaseUri = helpers.config.apiBaseUri
  next()
  // ** Unreliable (in vhost envs) method to detect requesting path **
  // const port = process.env.PORT || '8080';
  // const portInUrl = (port === 80 || port === 443 ? '' : ':' + port)
  // res.locals.apiBaseUri = req.protocol + '://' + req.host + portInUrl + '/api'
}
