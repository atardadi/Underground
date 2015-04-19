describe('Party List:', function() {
	describe('When clicking on party', function() {
		var name;

		beforeEach(function() {
			browser.get('http://localhost:9000/#/parties');
			var party = element.all(by.binding('name')).first();	
			
			party.getText().then(function(text){
				name = text;
			});

			party.click();
			browser.waitForAngular();
		});	

		it('Should navigate to a single party', function() {
			
			var header = element.all(by.id('test')).first();
			expect(header.getText()).toMatch('This is party!');
		});

		it('Should update the URL properly', function() {
			expect(browser.getCurrentUrl()).toMatch('party');
		});
	});
});