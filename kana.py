# kana_converter.py

class KanaConverter:
    """Class to convert between romaji and kana (hiragana and katakana)."""

    # Define katakana mappings first
    katakana_mappings = {
        # Vowels
        "a": "ア", "i": "イ", "u": "ウ", "e": "エ", "o": "オ",
        "ka": "カ", "ki": "キ", "ku": "ク", "ke": "ケ", "ko": "コ",
        "sa": "サ", "shi": "シ", "su": "ス", "se": "セ", "so": "ソ",
        "ta": "タ", "chi": "チ", "tsu": "ツ", "te": "テ", "to": "ト",
        "na": "ナ", "ni": "ニ", "nu": "ヌ", "ne": "ネ", "no": "ノ",
        "ha": "ハ", "hi": "ヒ", "fu": "フ", "he": "ヘ", "ho": "ホ",
        "ma": "マ", "mi": "ミ", "mu": "ム", "me": "メ", "mo": "モ",
        "ya": "ヤ", "yu": "ユ", "yo": "ヨ",
        "ra": "ラ", "ri": "リ", "ru": "ル", "re": "レ", "ro": "ロ",
        "wa": "ワ", "wo": "ヲ", "n": "ン",
        "kya": "キャ", "kyu": "キュ", "kyo": "キョ", "sha": "シャ",
        "shu": "シュ", "sho": "ショ", "cha": "チャ", "chu": "チュ",
        "cho": "チョ", "nya": "ニャ", "nyu": "ニュ", "nyo": "ニョ",
        "hya": "ヒャ", "hyu": "ヒュ", "hyo": "ヒョ", "mya": "ミャ",
        "myu": "ミュ", "myo": "ミョ", "rya": "リャ", "ryu": "リュ",
        "ryo": "リョ", "gya": "ギャ", "gyu": "ギュ", "gyo": "ギョ",
        "ja": "ジャ", "ju": "ジュ", "jo": "ジョ", "bya": "ビャ",
        "byu": "ビュ", "byo": "ビョ", "pya": "ピャ", "pyu": "ピュ",
        "pyo": "ピョ", "ga": "ガ", "gi": "ギ", "gu": "グ", "ge": "ゲ",
        "go": "ゴ", "za": "ザ", "ji": "ジ", "zu": "ズ", "ze": "ゼ",
        "zo": "ゾ", "da": "ダ", "di": "ヂ", "du": "ヅ", "de": "デ",
        "do": "ド", "ba": "バ", "bi": "ビ", "bu": "ブ", "be": "ベ",
        "bo": "ボ", "pa": "パ", "pi": "ピ", "pu": "プ", "pe": "ペ",
        "po": "ポ"
    }

    # Define both katakana and hiragana mappings together
    kana_mappings = {
        "katakana": katakana_mappings,
        "hiragana": {
            key: value.replace("ア", "あ").replace("イ", "い").replace("ウ", "う").replace("エ", "え").replace("オ", "お")
            .replace("カ", "か").replace("キ", "き").replace("ク", "く").replace("ケ", "け").replace("コ", "こ")
            .replace("サ", "さ").replace("シ", "し").replace("ス", "す").replace("セ", "せ").replace("ソ", "そ")
            .replace("タ", "た").replace("チ", "ち").replace("ツ", "つ").replace("テ", "て").replace("ト", "と")
            .replace("ナ", "な").replace("ニ", "に").replace("ヌ", "ぬ").replace("ネ", "ね").replace("ノ", "の")
            .replace("ハ", "は").replace("ヒ", "ひ").replace("フ", "ふ").replace("ヘ", "へ").replace("ホ", "ほ")
            .replace("マ", "ま").replace("ミ", "み").replace("ム", "む").replace("メ", "め").replace("モ", "も")
            .replace("ヤ", "や").replace("ユ", "ゆ").replace("ヨ", "よ").replace("ラ", "ら").replace("リ", "り")
            .replace("ル", "る").replace("レ", "れ").replace("ロ", "ろ").replace("ワ", "わ").replace("ヲ", "を")
            .replace("ン", "ん")
            for key, value in katakana_mappings.items()
        }
    }

    @classmethod
    def romaji_to_kana(cls, romaji, kana_type="katakana"):
        """Convert romaji to katakana or hiragana."""
        kana_map = cls.kana_mappings[kana_type]
        kana = ""
        i = 0
        while i < len(romaji):
            for length in (3, 2, 1):
                if i + length <= len(romaji) and romaji[i:i+length] in kana_map:
                    kana += kana_map[romaji[i:i+length]]
                    i += length
                    break
            else:
                kana += romaji[i]
                i += 1
        return kana

    @classmethod
    def kana_to_romaji(cls, kana, kana_type="katakana"):
        """Convert kana (katakana or hiragana) to romaji."""
        kana_map = {v: k for k, v in cls.kana_mappings[kana_type].items()}
        romaji = ""
        i = 0
        while i < len(kana):
            for length in (2, 1):
                if i + length <= len(kana) and kana[i:i+length] in kana_map:
                    romaji += kana_map[kana[i:i+length]]
                    i += length
                    break
            else:
                romaji += kana[i]
                i += 1
        return romaji

    @classmethod
    def get_by_index(cls, index, kana_type="katakana"):
        """Retrieve a kana symbol by index."""
        kana_symbols = list(cls.kana_mappings[kana_type].values())
        return kana_symbols[index] if index < len(kana_symbols) else None

    @classmethod
    def get_by_romaji(cls, romaji, kana_type="katakana"):
        """Retrieve a kana symbol by romaji."""
        return cls.kana_mappings[kana_type].get(romaji, None)

# Example usage:
print("Romaji to Katakana for 'konpyuta':", KanaConverter.romaji_to_kana("konpyuta", "katakana"))  # コンピュータ
print("Katakana to Romaji for 'コンピュータ':", KanaConverter.kana_to_romaji("コンピュータ", "katakana"))  # konpyuta
print("Get katakana by index (10):", KanaConverter.get_by_index(10, "katakana"))  # サ
print("Get katakana by romaji 'ka':", KanaConverter.get_by_romaji("ka", "katakana"))  # カ
print("Romaji to Hiragana for 'konnichiwa':", KanaConverter.romaji_to_kana("konnichiwa", "hiragana"))  # こんにちは
print("Hiragana to Romaji for 'こんにちは':", KanaConverter.kana_to_romaji("こんにちは", "hiragana"))  # konnichiwa