// js/kana_converter.js

const KanaConverter = {
  hiraganaMap: {
    "あ": "a", "い": "i", "う": "u", "え": "e", "お": "o",
    "か": "ka", "き": "ki", "く": "ku", "け": "ke", "こ": "ko",
    "さ": "sa", "し": "shi", "す": "su", "せ": "se", "そ": "so",
    "た": "ta", "ち": "chi", "つ": "tsu", "て": "te", "と": "to",
    "な": "na", "に": "ni", "ぬ": "nu", "ね": "ne", "の": "no",
    "は": "ha", "ひ": "hi", "ふ": "fu", "へ": "he", "ほ": "ho",
    "ま": "ma", "み": "mi", "む": "mu", "め": "me", "も": "mo",
    "や": "ya", "ゆ": "yu", "よ": "yo",
    "ら": "ra", "り": "ri", "る": "ru", "れ": "re", "ろ": "ro",
    "わ": "wa", "を": "wo", "ん": "n",
    // Add more combinations if desired
  },

  // Function to get a random hiragana character from hiraganaMap
  getRandomHiragana() {
    const hiraganaChars = Object.keys(this.hiraganaMap);
    if (hiraganaChars.length === 0) {
      console.error("No hiragana characters available in hiraganaMap.");
      return null;
    }
    return hiraganaChars[Math.floor(Math.random() * hiraganaChars.length)];
  },

  // Function to convert a hiragana character to romaji
  toRomaji(hiraganaChar) {
    const romaji = this.hiraganaMap[hiraganaChar];
    if (!romaji) {
      console.error(`Hiragana character '${hiraganaChar}' not found in hiraganaMap.`);
      return null;  // Fallback to prevent returning undefined
    }
    return romaji;
  },

  // Function to get a random romaji value from hiraganaMap
  getRandomRomaji() {
    const romajiChars = Object.values(this.hiraganaMap);
    if (romajiChars.length === 0) {
      console.error("No romaji characters available in hiraganaMap.");
      return null;
    }
    let randomRomaji = romajiChars[Math.floor(Math.random() * romajiChars.length)];

    // Ensure that the random romaji is valid (not undefined or null)
    if (!randomRomaji) {
      console.warn("Generated random romaji was invalid, retrying.");
      randomRomaji = romajiChars[Math.floor(Math.random() * romajiChars.length)];
    }
    return randomRomaji;
  }
};

export default KanaConverter;
