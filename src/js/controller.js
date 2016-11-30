// controller functionality for the restaurant review app
restaurantController = function() {

    // function to retrieve the cuisine types
    var getCuisineTypes = function() {
        // initialise variables
        var cuisineTypes = [];
        var uniqueCuisineTypes = [];
        var allCuisineTypes = [];

        // get all cuisine types
        $.each(restaurantModel.restaurantList, function (index, restaurantValue) {
            var cuisines = restaurantValue.cuisineTypes.split(',');
            allCuisineTypes = allCuisineTypes.concat(cuisines);            
        });

        // sort list
        allCuisineTypes.sort();

        // remove duplicates
        $.each(allCuisineTypes, function(index, cuisine){
            if ($.inArray(cuisine.trim(), uniqueCuisineTypes) === -1) {
                uniqueCuisineTypes.push(cuisine.trim());
                cuisineTypes.push({ code: cuisine.toUpperCase().trim(), name: cuisine.trim() });
            }
        });

        // return list of cuisines
        return cuisineTypes;
    };

    var getLocations = function() {
        // initialise variables
        var locations = [];
        var allLocations = [];

        // get all cuisine types
        $.each(restaurantModel.restaurantList, function (index, restaurantValue) {
            var location = restaurantValue.city;

            if ($.inArray(location.trim(), allLocations) === -1) {
                locations.push({ code: location.toUpperCase().replace(' ','').trim(), name: location.trim() });
            }

            allLocations.push(location.trim());
        });

        // sort list
        return locations.sort();
    };

    var getRestaurantCodesForRatings = function(rating) {
        var restaurantCodes = [];
        var allRestaurantCodes = [];

        $.each(restaurantModel.restaurantList, function (index, restaurant) {
            if (parseInt(restaurant.starRating) >= parseInt(rating))
                allRestaurantCodes.push(restaurant.code);
        });

        // remove duplicates
        $.each(allRestaurantCodes, function(index, restaurantCode){
            if ($.inArray(restaurantCode, restaurantCodes) === -1) 
                restaurantCodes.push(restaurantCode);
        });

        return restaurantCodes;
    }; 

    var getSearchResults = function(cuisineType, location, rating) {

        var searchResults = [];
        var allRestaurants = restaurantModel.restaurantList;

        $.each(allRestaurants, function (index, restaurantValue) {
            
            if (
                    (cuisineType === '' || restaurantValue.cuisineTypes.toUpperCase().indexOf(cuisineType.toUpperCase()) !== -1) &&
                    (location === '' || restaurantValue.city.toUpperCase().indexOf(location.toUpperCase()) !== -1) &&
                    (rating === '' || $.inArray(restaurantValue.code, getRestaurantCodesForRatings(rating)) !== -1)
                ) 
            {
                searchResults.push(restaurantValue);
            }

        });

        return searchResults;

    };

    var getRestaurantByCode = function (restaurantCode) {
        var allRestaurants = restaurantModel.restaurantList;  
        var restaurantToReturn = {};      

        $.each(allRestaurants, function (index, restaurantValue) {
            if (restaurantValue.code === restaurantCode)
                restaurantToReturn = restaurantValue;
        });

        return restaurantToReturn;
    };

    var getRestaurantReviewsByCode = function (restaurantCode) {
        var restaurantReviews = [];
        var allRestaurantReviews = restaurantModel.restaurantReviewList;

        $.each(allRestaurantReviews, function (index, restaurantReview) {
            if (restaurantReview.code === restaurantCode)
                restaurantReviews.push(restaurantReview);
        });

        return restaurantReviews; 
    };

    // expose public methods
    return { 
        getCuisineTypes: getCuisineTypes,
        getLocations: getLocations,
        getSearchResults: getSearchResults,
        getRestaurantByCode: getRestaurantByCode,
        getRestaurantReviewsByCode: getRestaurantReviewsByCode
    };

}();