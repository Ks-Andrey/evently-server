import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettierPlugin from 'eslint-plugin-prettier';
import importPlugin from 'eslint-plugin-import';

export default [
    {
        files: ['**/*.ts'],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaVersion: 2020,
                sourceType: 'module',
                project: './tsconfig.json',
            },
        },
        ignores: ['node_modules', 'dist', 'build', 'coverage', '.vscode', '.idea', '*.d.ts'],
        plugins: {
            '@typescript-eslint': tsPlugin,
            prettier: prettierPlugin,
            import: importPlugin,
        },
        settings: {
            'import/resolver': {
                typescript: {
                    alwaysTryTypes: true,
                    project: './tsconfig.json',
                },
            },
        },
        rules: {
            'prettier/prettier': 'error',
            '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
            '@typescript-eslint/explicit-function-return-type': 'off',
            'import/order': [
                'error',
                {
                    groups: [['builtin', 'external'], 'internal', ['parent', 'sibling', 'index'], 'type'],
                    pathGroups: [
                        {
                            pattern: '@**',
                            group: 'internal',
                            position: 'after',
                        },
                    ],
                    pathGroupsExcludedImportTypes: ['builtin', 'external'],
                    alphabetize: { order: 'asc', caseInsensitive: true },
                    'newlines-between': 'always-and-inside-groups',
                },
            ],
        },
    },
];
