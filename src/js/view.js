// view functionality for the restaurant review app
restaurantView = function() {

    // initialise variables
    var cuisineSearchControl = $("#cboCuisineSearch");
    var locationSearchControl = $("#cboLocationSearch");
    var ratingSearchControl = $("#cboRatingSearch");
    var searchResultsButton = $("#btnSearch");
    var clearResultsButton = $("#btnClear");
    var searchResultsDiv = $("#searchResults");
    var searchResultsLabel = $("#lblSearchResults");
    var modalFirstTab = $('#restaurantTabs a:first');
    var modalDescriptionTab = $("#description.tab-pane");
    var modalImageTab = $("#images.tab-pane");
    var modalReviewsTab = $("#reviews.tab-pane");
    var modalTitle = $("#myModalLabel");
    var modalAddReviewTitle = $("#lblAddReviewDescription");
    var modalWindow = $("#myModal");
    var modalSubmitReview = $("#btnSubmitReview");
    var modalAddReviewForm = $('#formAddReview');
    var modalReviewAlertMessage = $("#formAddReview > .alert");    

    // function to initialise the cuisine types dropdown
    var initialiseCuisineTypes = function() {
        var cuisineTypes = restaurantController.getCuisineTypes();

        $.each(cuisineTypes, function(index, cuisine) {
            cuisineSearchControl.append('<option value="' + cuisine.code + '">' + cuisine.name + '</option>');
        });
    };

    // function to initialise the locations dropdown
    var initialiseLocations = function() {
        var locations = restaurantController.getLocations();

        $.each(locations, function(index, location) {
            locationSearchControl.append('<option value="' + location.code + '">' + location.name + '</option>');
        });
    };

    // function to process the search results on the UI
    var processSearchResultsView = function(searchResults) {
        // initialise empty html
        var html = '';

        // clear existing search results
        searchResultsDiv.html('');

        // form html
        $.each(searchResults, function(index, searchResult) {
            html += '<div class="col-sm-6 col-md-4 restaurant-view"><div class="thumbnail">';
            html += '<img src="' + searchResult.photoUrl + '" alt="' + searchResult.name + '">';
            html += '<div class="caption text-center"><hr />';
            // global replace answered by @nick-craver at http://stackoverflow.com/questions/3214886/javascript-replace-only-replaces-first-match
            html += '<h3>' + searchResult.name.toUpperCase().replace(/ /g, '.') + '</h3>';
            html += '<hr /><p>';
            html += '<span class="glyphicon glyphicon-home" aria-hidden="true" style="padding-right: 10px;"></span><b>LOCATION</b><br />' + searchResult.streetAddress + ', ' + searchResult.city + '<br/>';
            html += '<span class="glyphicon glyphicon-star" aria-hidden="true" style="padding-right: 10px;"></span><b>RATING</b><br />' + searchResult.starRating + ' Stars<br/>';
            html += '<span class="glyphicon glyphicon-list" aria-hidden="true" style="padding-right: 10px;"></span><b>CUISINE TYPES</b><br />' + searchResult.cuisineTypes + '<br/>';
            html += '<span class="glyphicon glyphicon-time" aria-hidden="true" style="padding-right: 10px;"></span><b>TRADING HOURS</b><br />' + searchResult.timesOpen;
            html += '</p><hr /><p>';
            html += '<button type="button" class="btn btn-default view-info" value="View" data-restaurantcode="' + searchResult.code + '">VIEW</button>';
            html += '</p></div></div></div>';
        });

        // append formed html to page
        searchResultsDiv.append(html);

        // display search results
        searchResultsLabel.text(searchResults.length + ' restaurants found!');
        $(".alert").show();

        // hook events for view button on restaurant search results
        $(".view-info").on('click', function() {
            processModalView($(this).data('restaurantcode'));
        });
    };

    // function to process modal window 
    var processModalView = function(resaurantCode) {
        // retrieve selected restaurant as well as the relevant reviews for that restaurant
        var selectedRestaurant = restaurantController.getRestaurantByCode(resaurantCode);
        var reviewsForRestaurant = restaurantController.getRestaurantReviewsByCode(resaurantCode);

        // initialise html
        var html = '<br/>';

        // clear existing html
        modalDescriptionTab.html('');
        modalImageTab.html('');
        modalReviewsTab.html('');

        // set restaurant title (// global replace answered by @nick-craver at http://stackoverflow.com/questions/3214886/javascript-replace-only-replaces-first-match)
        modalTitle.text(selectedRestaurant.name.toUpperCase().replace(/ /g, '.'));

        // form html for modal
        $.each(reviewsForRestaurant, function(index, review) {
            html += '<p>"' + review.comments + '" - ' + review.starRating + ' Stars';
            html += '<br/>by ' + review.reviewerName + ' on ' + review.reviewerDate + ' </p>';
        });

        modalDescriptionTab.append('<br /><p>' + selectedRestaurant.description + '</p>');
        modalImageTab.append('<br /><img style="width: 100%;" alt="' + selectedRestaurant.name + '" src="' + selectedRestaurant.photoUrl + '" />');
        modalAddReviewTitle.text('Please complete the following fields in order to submit a review for the "' + selectedRestaurant.name + '" restaurant.');
        modalReviewsTab.append(html);

        // initialise modal window properties
        modalWindow.modal({
            show: true,
            keyboard: true,
            backdrop: 'static'
        });        

        // show modal window
        modalWindow.modal('show');

        // set focus to first tab
        modalFirstTab.tab('show');

        // hide modal review success message
        modalReviewAlertMessage.hide();
    };

    // function to process the restaurant search
    var processRestaurantSearch = function() {
        // get search criteria
        var cuisineValue = cuisineSearchControl.find('option:selected').text();
        var locationValue = locationSearchControl.find('option:selected').text();
        var ratingValue = ratingSearchControl.find('option:selected').val();

        // parse search criteria
        cuisineValue = cuisineValue === 'Choose a cuisine type' ? '' : cuisineValue;
        locationValue = locationValue === 'Choose a location' ? '' : locationValue;

        // retrieve search results for the given criteria
        var searchResults = restaurantController.getSearchResults(cuisineValue, locationValue, ratingValue);

        // display search results
        processSearchResultsView(searchResults);
    };

    // function to clear restaurant critera selections
    var clearRestaurantSearch = function() {
        // clear search criteria
        cuisineSearchControl.val('');
        locationSearchControl.val('');
        ratingSearchControl.val('');

        // hide search results alert message
        $(".alert").hide();

        // remove search results
        searchResultsDiv.html('');
    };

    // function to hook view events
    var hookEvents = function() {
        // hook event when the search button is clicked
        searchResultsButton.on('click', processRestaurantSearch);

        // hook event when the clear button is clicked
        clearResultsButton.on('click', clearRestaurantSearch);        

        // hook event to revert focus to the button which invoked the modal
        modalWindow.on('hidden.bs.modal', function(e) {            
            var restaurantName = $(this).find('.modal-title').text();            
            $("#searchResults h3:contains('" + restaurantName + "')").parent().find('.view-info').focus();
        });        

        // hook event to check validation and display validation, if necessary
        modalSubmitReview.on('click', function() {
            modalAddReviewForm.validator('validate');

            // hide / show add review success message
            if ($("#formAddReview > .has-error").length === 0) {
                modalReviewAlertMessage.show();
            }
            else {
                modalReviewAlertMessage.hide();
            }
        });
    };

    // function to initialise the view on the page
    var initialiseView = function() {
        // initialise cuisine types and locations
        initialiseCuisineTypes();
        initialiseLocations();

        // hook events
        hookEvents();

        // hide search results alert on load
        $(".alert").hide();
    };

    // expose public methods
    return {
        initialiseView: initialiseView
    };
}();
