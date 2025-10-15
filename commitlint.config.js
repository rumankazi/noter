export default {
    extends: ['@commitlint/config-conventional'],
    rules: {
        'type-enum': [
            2,
            'always',
            [
                'feat',
                'fix',
                'docs',
                'style',
                'refactor',
                'perf',
                'test',
                'build',
                'ci',
                'chore',
                'revert'
            ]
        ],
        'subject-case': [0],
        'subject-empty': [2, 'never'],
        'subject-full-stop': [0],
        'type-case': [2, 'always', 'lower-case'],
        'type-empty': [2, 'never']
    }
};
