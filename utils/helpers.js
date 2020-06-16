
let apiBaseUri = 'https://rick-and-morty-free-api.herokuapp.com/api/'
if (process.env.API_BASE_URI || process.env.API_BASE_URL) {
  apiBaseUri = process.env.API_BASE_URI || process.env.API_BASE_URL
}

function updateToCurrentApiUrl(url) {
  return url.replace(exports.config.sourceApiBaseUri, exports.config.apiBaseUri);
}

exports.config = {
  sourceApiBaseUri: `https://rick-and-morty-free-api.herokuapp.com/api/`,
  apiBaseUri
}
exports.message = {
  noPage: 'There is nothing here',
  noCharacter: 'Character not found',
  noLocation: 'Location not found',
  noEpisode: 'Episode not found',
  badParam: 'Hey! that parameter is not allowed, try with a number instead ;)',
  badArray: 'Bad... bad array :/'
}

exports.collection = {
  updateToCurrentApiUrl,
  exclude: '-_id -author -__v -edited',
  limit: 20,
  queries: {
    character: ['name', 'status', 'species', 'type', 'gender'],
    episode: ['name', 'episode'],
    location: ['name', 'dimension', 'type']
  }
}
