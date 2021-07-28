module.exports = {
	globDirectory: 'build/deploy/',
	globPatterns: [
		"**/*.{js,css}"
	],
    globIgnores: ['**/remoteEntry.js'],
    swSrc: 'packages/asc-web-common/utils/sw-template.js',
	swDest: 'build/deploy/public/sw.js'
};