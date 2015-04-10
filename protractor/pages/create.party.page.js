module.exports = function() {
  this.createButton = element(by.buttonText('Create New'));

  this.getButtonClasses = function() {
  	return this.createButton.getAttribute('class');
  }
};