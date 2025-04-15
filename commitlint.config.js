export default {
	extends: ['@commitlint/config-conventional'],
	rules: {
		'type-enum': [
			2,
			'always',
			['feat', 'fix', 'chore', 'docs', 'style', 'refactor', 'test', 'revert', 'added', 'fixed', 'removed'],
		],
		'scope-enum': [2, 'always', ['frontend', 'backend', 'config', 'docs', 'test', 'build']],
		'scope-case': [2, 'always', ['lower-case', 'camel-case']],
		'subject-case': [2, 'never', ['start-case', 'pascal-case', 'upper-case', 'sentence-case']],
		'subject-full-stop': [2, 'never'],
		'header-max-length': [2, 'always', 100],
	},
};
