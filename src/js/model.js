// restuarant data model
restaurantModel = function () {

	// initialise variables
	var restaurantList = [];
	var restaurantReviewList = [];

	// initialise a list of all restaurants from a remote json file
	var initialiseRestaurants = function() {
		// fetch list of restaurants from json file
		return fetch(appConfig.restaurantJsonUrl)
            .then(function (response) {
                // convert response to json
                return response.json();
            })
            .then(function (jsonResponse) {
                // create restaurant list
                for (var i = 0; i < jsonResponse.restaurants.length; i++) {
                    restaurantList.push(jsonResponse.restaurants[i]);
                }

                // return restaurant list
                Promise.resolve(restaurantList);
            })
            .catch(function (error) {
            	// log error to console
            	console.log(error);
            });
	};

	// initialise a list of all restaurant reviews from a remote json file
	var initialiseRestaurantReviews = function() {
		// fetch list of restaurants reviews from json file
		return fetch(appConfig.restaurantReviewsJsonUrl)
            .then(function (response) {
                // convert response to json
                return response.json();
            })
            .then(function (jsonResponse) {
                // create restaurant list
                for (var i = 0; i < jsonResponse.restaurantReviews.length; i++) {
                    restaurantReviewList.push(jsonResponse.restaurantReviews[i]);
                }

                // return restaurant list
                Promise.resolve(restaurantReviewList);
            })
            .catch(function (error) {
            	// log error to console
            	console.log(error);
            });
	};

	// initialises restaurant and restaurant review lists
    var initialise = function() {
    	// initialise promises
        var restaurantPromise = initialiseRestaurants();
        var restaurantReviewPromise = initialiseRestaurantReviews();

        // return promise
        return Promise.all([restaurantPromise, restaurantReviewPromise]);
    };

    // expose public methods
    return { 
    	initialise: initialise,
    	restaurantList: restaurantList,
    	restaurantReviewList: restaurantReviewList
    };
}();