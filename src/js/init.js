// on load functionality
$(document).ready(function () {	
	// initialise model
	restaurantModel.initialise()
		.then(function (result) {
			// initialise page components
			restaurantView.initialiseView();
		})		
		.catch(function (error) {
			console.log(error);
		});
});