const mongoose = require('mongoose');

const mdFileSchema = new mongoose.Schema({
    fileName: { type: String, unique: true, required: true },
    text: { type: String, required: true },
    mdText: { type: String, required: true },
  }, {timestamps: true});

  const mdFile = mongoose.model("Markdown", mdFileSchema);

module.exports= { mdFile };