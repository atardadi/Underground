describe('Party Create:', function() {
	describe('When clicking on create party', function() {
		var name;


		beforeEach(function() {
			browser.get('http://localhost:9000/#/parties');
			var party = element(by.buttonText('Create New')).click();	
			
			browser.waitForAngular();
		});	

		it('Should navigate to create party', function() {
			
			expect(browser.getCurrentUrl()).toMatch('create');
		});

	});
});