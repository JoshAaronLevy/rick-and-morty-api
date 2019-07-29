require('dotenv').config();
const FP = require('functional-promises');
const mongoose = require('mongoose')
const db = process.env.MONGODB_URI || 'mongodb://localhost:27017/rickmorty-api'
const dbConfig = {
  useNewUrlParser: true,
  useCreateIndex: true
}

if (process.env.NODE_ENV !== 'production') {
  dbConfig.dbName = process.env.MONGO_DB_NAME || 'rickmorty-api'
}

mongoose.connect(db, dbConfig);
mongoose.Promise = FP;

const models = require('../models');
const { collection } = require('../utils/helpers');

const processing = [
  FP.resolve(models.character.find({}))
    .concurrency(1)
    .map(fixUrls),
  FP.resolve(models.episode.find({}))
    .concurrency(1)
    .map(fixUrls),
  FP.resolve(models.location.find({}))
    .concurrency(1)
    .map(fixUrls)
]

Promise.all(processing)
  .then(results => console.log('DONE! Updated Records:', results.length))
  .then(() => mongoose.connection.close())

function fixUrls(record) {
  const checkUrls = ['episode', 'residents', 'characters']
  checkUrls.map(field => {
    if (Array.isArray(record[field])) {
      record[field] = record[field].map(collection.updateToCurrentApiUrl)
    }
  })
  if (record.image) record.image = collection.updateToCurrentApiUrl(record.image);
  if (record.url) record.url = collection.updateToCurrentApiUrl(record.url);
  // // record.image = collection.updateToCurrentApiUrl(record.image);
  // console.log('fixUrls:', record);
  return record.save();
}
