var PartyCreate = require('../pages/create.party.page.js');

describe('Party Create:', function() {
	describe('When clicking on create party', function() {
		var name,
			partyCreate = new PartyCreate();

		beforeEach(function() {
			browser.get('http://localhost:9000/#/parties');
			var party = partyCreate.createButton.click();	
			
			browser.waitForAngular();
		});	

		it('Should navigate to create party', function() {
			
			expect(browser.getCurrentUrl()).toMatch('create');
		});

	});
});