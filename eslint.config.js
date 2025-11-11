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
        plugins: { '@typescript-eslint': tsPlugin, prettier: prettierPlugin, import: importPlugin },
        rules: {
            'prettier/prettier': 'error',
            '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
            '@typescript-eslint/explicit-function-return-type': 'off',
            'import/order': [
                'error',
                {
                    groups: ['external', 'builtin', 'index', 'sibling', 'parent', 'internal', 'type'],
                    alphabetize: { order: 'asc', caseInsensitive: true },
                    'newlines-between': 'always-and-inside-groups',
                },
            ],
        },
    },
];
