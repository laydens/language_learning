export type StudyLevel = 'basic' | 'elementary' | 'intermediate' | 'pre-advanced' | 'advanced';

const LEVEL_MAPPINGS: Record<string, StudyLevel> = {
    'N5': 'basic',
    'N4': 'elementary',
    'N3': 'intermediate',
    'N2': 'pre-advanced',
    'N1': 'advanced'
};

export class PreferencesService {
    private static LEVEL_COOKIE_NAME = 'wizling_study_level';

    static convertJLPTToLevel(jlptLevel: string): StudyLevel {
        return LEVEL_MAPPINGS[jlptLevel.toUpperCase()] || 'basic';
    }

    static getStudyLevel(): StudyLevel | null {
        const cookie = document.cookie
            .split('; ')
            .find(row => row.startsWith(`${this.LEVEL_COOKIE_NAME}=`));

        return cookie ? cookie.split('=')[1] as StudyLevel : null;
    }

    static setStudyLevel(level: StudyLevel): void {
        // Set cookie to expire in 1 year
        const expiryDate = new Date();
        expiryDate.setFullYear(expiryDate.getFullYear() + 1);

        document.cookie = `${this.LEVEL_COOKIE_NAME}=${level};expires=${expiryDate.toUTCString()};path=/`;
    }
}
