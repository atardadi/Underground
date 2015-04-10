exports.config = {
	seleniunAddress: 'http://127.0.0.1:4444/wd/hub',
	specs: ['./**/*.spec.js'],

	suites: {
		smoke: './smoke/*.spec.js',
		full: './**/*.spec.js'
	},


	onPrepare: function() {
		browser.driver.manage().window().setPosition(0,0);
		browser.driver.manage().window().setSize(1280,720);
	}
};