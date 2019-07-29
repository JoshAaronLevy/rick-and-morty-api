const mongoose = require('mongoose')
const mongodbErrorHandler = require('mongoose-mongodb-errors')

const { collection } = require('../utils/helpers')

const characterSchema = new mongoose.Schema({
  id: {
    type: Number, unique: true
  },
  name: {
    type: String, trim: true, required: true
  },
  species: {
    type: String, trim: true, default: 'unknown'
  },
  type: {
    type: String, trim: true, default: 'unknown'
  },
  status: {
    type: String, trim: true, default: 'unknown'
  },
  location: {
    type: mongoose.Schema.ObjectId, ref: 'Location'
  },
  origin: {
    type: mongoose.Schema.ObjectId, ref: 'Location'
  },
  gender: {
    type: String, trim: true, default: 'unknown'
  },
  episode: Array,
  image: String,
  url: String,
  author: {
    type: mongoose.Schema.ObjectId, ref: 'User'
  },
  created: {
    type: Date, default: Date.now
  },
  edited: Date
})

function autopopulate(next) {
  this.populate({ path: 'location', select: 'name url -_id' })
  this.populate({ path: 'origin', select: 'name url -_id' })
  next()
}

characterSchema.pre('find', autopopulate)
characterSchema.pre('findOne', autopopulate)

characterSchema.statics.structure = ch => {
  const m = ({ id, name, status, species, type, gender, origin, location, image, episode, url, created }) => ({
    id,
    name,
    status,
    species,
    type,
    gender,
    origin,
    location,
    image,
    episode,
    url: collection.updateToCurrentApiUrl(url),
    created
  })

  return Array.isArray(ch) ? ch.map(ch => m(ch)) : m(ch)
}

characterSchema.statics.findAndCount = async function({ name, type, status, species, gender, skip }) {
  const q = key => new RegExp(key && ( /^male/i.test(key) ? `^${key}` : key.replace(/[^\w\s]/g, "\\$&") ), "i")

  const query = {
    name: q(name),
    status: q(status),
    species: q(species),
    type: q(type),
    gender: q(gender)
  }

  const [data, count] = await Promise.all([
    this.find(query).sort({ id: 1 }).select(collection.exclude).limit(collection.limit).skip(skip),
    this.find(query).countDocuments()
  ])

  const results = this.structure(data)

  return { results, count }
}

characterSchema.plugin(mongodbErrorHandler)

module.exports = mongoose.model('Character', characterSchema)
