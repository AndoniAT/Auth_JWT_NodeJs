import globals from 'globals';
import pluginJs from '@eslint/js';


/** @type {import('eslint').Linter.Config[]} */
export default [
    {files: ['**/*.js'], languageOptions: {sourceType: 'commonjs'}},
    {languageOptions: { globals: globals.browser }},
    pluginJs.configs.recommended,
    {
        rules : {
            'indent': [
                'error',
                4
            ],
            'linebreak-style': [
                'error',
                'unix'
            ],
            'quotes': [
                'error',
                'single'
            ],
            'semi': [
                'error',
                'always'
            ],
            'space-in-parens': [
                'error', 'always'
            ]

        }
    }
];