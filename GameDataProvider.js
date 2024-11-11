// gameDataProvider.js
// Enhanced dictionary sets for gameDataProvider.js
// gameDataProvider.js
export const CHARACTER_GROUPS = {
    hiragana: {
        vowels: { あ: 'a', い: 'i', う: 'u', え: 'e', お: 'o' },
        k: { か: 'ka', き: 'ki', く: 'ku', け: 'ke', こ: 'ko' },
        s: { さ: 'sa', し: 'shi', す: 'su', せ: 'se', そ: 'so' },
        t: { た: 'ta', ち: 'chi', つ: 'tsu', て: 'te', と: 'to' },
        n: { な: 'na', に: 'ni', ぬ: 'nu', ね: 'ne', の: 'no' },
        h: { は: 'ha', ひ: 'hi', ふ: 'fu', へ: 'he', ほ: 'ho' },
        m: { ま: 'ma', み: 'mi', む: 'mu', め: 'me', も: 'mo' },
        y: { や: 'ya', ゆ: 'yu', よ: 'yo' },
        r: { ら: 'ra', り: 'ri', る: 'ru', れ: 're', ろ: 'ro' },
        w: { わ: 'wa', を: 'wo', ん: 'n' },
        g: { が: 'ga', ぎ: 'gi', ぐ: 'gu', げ: 'ge', ご: 'go' },
        z: { ざ: 'za', じ: 'ji', ず: 'zu', ぜ: 'ze', ぞ: 'zo' },
        d: { だ: 'da', ぢ: 'ji', づ: 'zu', で: 'de', ど: 'do' },
        b: { ば: 'ba', び: 'bi', ぶ: 'bu', べ: 'be', ぼ: 'bo' },
        p: { ぱ: 'pa', ぴ: 'pi', ぷ: 'pu', ぺ: 'pe', ぽ: 'po' }
    },
    katakana: {
        vowels: { ア: 'a', イ: 'i', ウ: 'u', エ: 'e', オ: 'o' },
        k: { カ: 'ka', キ: 'ki', ク: 'ku', ケ: 'ke', コ: 'ko' },
        s: { サ: 'sa', シ: 'shi', ス: 'su', セ: 'se', ソ: 'so' },
        t: { タ: 'ta', チ: 'chi', ツ: 'tsu', テ: 'te', ト: 'to' },
        n: { ナ: 'na', ニ: 'ni', ヌ: 'nu', ネ: 'ne', ノ: 'no' },
        h: { ハ: 'ha', ヒ: 'hi', フ: 'fu', ヘ: 'he', ホ: 'ho' },
        m: { マ: 'ma', ミ: 'mi', ム: 'mu', メ: 'me', モ: 'mo' },
        y: { ヤ: 'ya', ユ: 'yu', ヨ: 'yo' },
        r: { ラ: 'ra', リ: 'ri', ル: 'ru', レ: 're', ロ: 'ro' },
        w: { ワ: 'wa', ヲ: 'wo', ン: 'n' },
        g: { ガ: 'ga', ギ: 'gi', グ: 'gu', ゲ: 'ge', ゴ: 'go' },
        z: { ザ: 'za', ジ: 'ji', ズ: 'zu', ゼ: 'ze', ゾ: 'zo' },
        d: { ダ: 'da', ヂ: 'ji', ヅ: 'zu', デ: 'de', ド: 'do' },
        b: { バ: 'ba', ビ: 'bi', ブ: 'bu', ベ: 'be', ボ: 'bo' },
        p: { パ: 'pa', ピ: 'pi', プ: 'pu', ペ: 'pe', ポ: 'po' }
    }
};


const GAME_DATA = {
    'hiragana': {
        title: 'Basic Hiragana Practice',
        dictionary: {
            // Basic vowels
            'あ': 'a', 'い': 'i', 'う': 'u', 'え': 'e', 'お': 'o',
            // K-group
            'か': 'ka', 'き': 'ki', 'く': 'ku', 'け': 'ke', 'こ': 'ko',
            // S-group
            'さ': 'sa', 'し': 'shi', 'す': 'su', 'せ': 'se', 'そ': 'so',
            // T-group
            'た': 'ta', 'ち': 'chi', 'つ': 'tsu', 'て': 'te', 'と': 'to',
            // N-group
            'な': 'na', 'に': 'ni', 'ぬ': 'nu', 'ね': 'ne', 'の': 'no',
            // H-group
            'は': 'ha', 'ひ': 'hi', 'ふ': 'fu', 'へ': 'he', 'ほ': 'ho',
            // M-group
            'ま': 'ma', 'み': 'mi', 'む': 'mu', 'め': 'me', 'も': 'mo',
            // Y-group
            'や': 'ya', 'ゆ': 'yu', 'よ': 'yo',
            // R-group
            'ら': 'ra', 'り': 'ri', 'る': 'ru', 'れ': 're', 'ろ': 'ro',
            // W-group
            'わ': 'wa', 'を': 'wo',
            // N
            'ん': 'n',
            // G-group (voiced K)
            'が': 'ga', 'ぎ': 'gi', 'ぐ': 'gu', 'げ': 'ge', 'ご': 'go',
            // Z-group (voiced S)
            'ざ': 'za', 'じ': 'ji', 'ず': 'zu', 'ぜ': 'ze', 'ぞ': 'zo',
            // D-group (voiced T)
            'だ': 'da', 'ぢ': 'ji', 'づ': 'zu', 'で': 'de', 'ど': 'do',
            // B-group (voiced H)
            'ば': 'ba', 'び': 'bi', 'ぶ': 'bu', 'べ': 'be', 'ぼ': 'bo',
            // P-group (aspirated H)
            'ぱ': 'pa', 'ぴ': 'pi', 'ぷ': 'pu', 'ぺ': 'pe', 'ぽ': 'po'
        }
    },
    'katakana': {
        title: 'Basic Katakana Practice',
        dictionary: {
            // Basic vowels
            'ア': 'a', 'イ': 'i', 'ウ': 'u', 'エ': 'e', 'オ': 'o',
            // K-group
            'カ': 'ka', 'キ': 'ki', 'ク': 'ku', 'ケ': 'ke', 'コ': 'ko',
            // S-group
            'サ': 'sa', 'シ': 'shi', 'ス': 'su', 'セ': 'se', 'ソ': 'so',
            // T-group
            'タ': 'ta', 'チ': 'chi', 'ツ': 'tsu', 'テ': 'te', 'ト': 'to',
            // N-group
            'ナ': 'na', 'ニ': 'ni', 'ヌ': 'nu', 'ネ': 'ne', 'ノ': 'no',
            // H-group
            'ハ': 'ha', 'ヒ': 'hi', 'フ': 'fu', 'ヘ': 'he', 'ホ': 'ho',
            // M-group
            'マ': 'ma', 'ミ': 'mi', 'ム': 'mu', 'メ': 'me', 'モ': 'mo',
            // Y-group
            'ヤ': 'ya', 'ユ': 'yu', 'ヨ': 'yo',
            // R-group
            'ラ': 'ra', 'リ': 'ri', 'ル': 'ru', 'レ': 're', 'ロ': 'ro',
            // W-group
            'ワ': 'wa', 'ヲ': 'wo',
            // N
            'ン': 'n',
            // G-group (voiced K)
            'ガ': 'ga', 'ギ': 'gi', 'グ': 'gu', 'ゲ': 'ge', 'ゴ': 'go',
            // Z-group (voiced S)
            'ザ': 'za', 'ジ': 'ji', 'ズ': 'zu', 'ゼ': 'ze', 'ゾ': 'zo',
            // D-group (voiced T)
            'ダ': 'da', 'ヂ': 'ji', 'ヅ': 'zu', 'デ': 'de', 'ド': 'do',
            // B-group (voiced H)
            'バ': 'ba', 'ビ': 'bi', 'ブ': 'bu', 'ベ': 'be', 'ボ': 'bo',
            // P-group (aspirated H)
            'パ': 'pa', 'ピ': 'pi', 'プ': 'pu', 'ペ': 'pe', 'ポ': 'po'
        }
    },
    'mixed-basic': {
        title: 'Mixed Kana Practice',
        dictionary: {} // Will be populated programmatically
    }
};

// Add a function to generate mixed dictionary
const generateMixedDictionary = () => {
    const mixed = {};
    const hiragana = GAME_DATA['hiragana'].dictionary;
    const katakana = GAME_DATA['katakana'].dictionary;

    // Merge both dictionaries
    for (const [key, value] of Object.entries(hiragana)) {
        mixed[key] = value;
    }
    for (const [key, value] of Object.entries(katakana)) {
        mixed[key] = value;
    }

    return mixed;
};

// Populate mixed dictionary


export const GameDataProvider = {
    getData(queryString, selection = { script: 'hiragana', groups: [] }) {
        // Prepare the dictionary based on the script and selected groups
        console.log("queryString in getData: ", queryString);
        console.log("CHARACTER_GROUPS:", CHARACTER_GROUPS);

        const dictionary = {};
        const scriptGroups = CHARACTER_GROUPS[selection.script];

        if (!scriptGroups) {
            console.error(`GameDataProvider: Invalid script "${selection.script}"`);
            return { error: true, data: { title: 'Invalid Script', dictionary: {} } };
        }

        // Populate dictionary with selected groups or all groups if none are specified
        if (selection.groups.length > 0) {
            selection.groups.forEach(group => {
                const groupChars = scriptGroups[group];
                if (groupChars) {
                    Object.assign(dictionary, groupChars);
                } else {
                    console.error(`GameDataProvider: Group "${group}" is undefined in script "${selection.script}"`);
                }
            });
        }

        // If no groups were selected, include all characters from the script
        if (Object.keys(dictionary).length === 0) {
            Object.values(scriptGroups).forEach(chars => {
                Object.assign(dictionary, chars);
            });
        }

        // If mixed-basic is selected, load from combined dictionary
        if (selection.script === 'mixed-basic') {
            dictionary = generateMixedDictionary();
        }

        console.log("GameDataProvider: Final dictionary data:", dictionary);

        return {
            error: false,
            data: {
                title: `${selection.script.charAt(0).toUpperCase() + selection.script.slice(1)} Practice`,
                dictionary
            }
        };
    }
};