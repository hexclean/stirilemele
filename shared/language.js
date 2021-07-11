function getLanguageCode(language) {
  let languageCode;
  if (language == "ro") {
    languageCode = 1;
  } else {
    languageCode = 2;
  }
  return languageCode;
}

module.exports = { getLanguageCode };
