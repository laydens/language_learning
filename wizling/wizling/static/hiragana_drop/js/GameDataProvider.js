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

const generateMixedDictionary = (groups = []) => {
    const mixed = {};

    // Helper function to add characters from a specific script and groups
    const addCharacters = (scriptGroups) => {
        if (groups.length > 0) {
            groups.forEach(group => {
                if (scriptGroups[group]) {
                    Object.assign(mixed, scriptGroups[group]);
                }
            });
        } else {
            // If no groups specified, add all characters
            Object.values(scriptGroups).forEach(chars => {
                Object.assign(mixed, chars);
            });
        }
    };

    // Add characters from both scripts
    addCharacters(CHARACTER_GROUPS.hiragana);
    addCharacters(CHARACTER_GROUPS.katakana);

    return mixed;
};

export const GameDataProvider = {
    getData(queryString, selection = { script: 'hiragana', groups: [] }) {
        // Default to hiragana if no query string is provided
        if (!queryString) {
            selection = { script: 'hiragana', groups: [] };
        }

        console.log("queryString in getData: ", queryString);
        console.log("CHARACTER_GROUPS:", CHARACTER_GROUPS);

        let dictionary = {};

        // Handle mixed script specially
        if (selection.script === 'mixed') {
            dictionary = generateMixedDictionary(selection.groups);
        } else {
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
            } else {
                // If no groups were selected, include all characters from the script
                Object.values(scriptGroups).forEach(chars => {
                    Object.assign(dictionary, chars);
                });
            }
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