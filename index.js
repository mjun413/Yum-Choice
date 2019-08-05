  'use strict';

const apiKey1 = "522bb96699a171f68a6a7c0c367ee445"
const apiKey2 = "8dd8ab2c050bc08546707d9910a0e444"
const searchURL1 = 'https://developers.zomato.com/api/v2.1';
const searchURL2 = 'https://www.food2fork.com/api/search';

function displayDineResults(myJson) {
  $('#results-list').empty();
  $('#result-number').empty();
  if (myJson.results_found === 0) {
      $('#results-list').append(`Sorry, no result is found. Please type in city and state name to get better search results`);
    } else {
      for (let i = 0; i < myJson.restaurants.length; i++) {
        let restaurantThumb = myJson.restaurants[i].restaurant.thumb != "" ? myJson.restaurants[i].restaurant.thumb : "http://kartfood.in/assets/images/default-food-image-large.png"; 
        $('#results-list').append(
          `<div id="restaurant-name-ratings"><h3 class="names">${myJson.restaurants[i].restaurant.name}</h3>
          <p id="rating">Rating: ${myJson.restaurants[i].restaurant.user_rating.aggregate_rating}/5</p></div>`);
        $('#results-list').append( 
          `<div class="results-flex-container"><div class="informations">
          <p class="info-item"><span class="bold">Cuisine:  </span>${myJson.restaurants[i].restaurant.cuisines}</p>
          <p class="info-item"><span class="bold">Phone: </span>${myJson.restaurants[i].restaurant.phone_numbers}</p>
          <p class="info-item"><span class="bold">Hours: </span>${myJson.restaurants[i].restaurant.timings}</p>
          <p class="info-item"><span class="bold">Address: </span>${myJson.restaurants[i].restaurant.location.address}</p>
          <p id="menu-link" class="links"><a href="${myJson.restaurants[i].restaurant.menu_url}" target="_blank">Menu</a></p></div>   
          <div id="image-container"><img class="image-dine" src="${restaurantThumb}" alt="restaurant-thumb-img"></div></div>`);
        $('#results-list').append(`<hr>`);
      }
    }
  $('#results').removeClass('hidden');
  $('#search-change').removeClass('hide');
  $(".spinner").hide();
  $(".magnifying-glass").show();
  $("#search-change").show();
  $("#back-top").show();

  $("#lower-section-container").ready(function(){
    $("html, body").animate({
        scrollTop: $('#lower-section-container').offset().top 
    }, 2000);
  });
};

function displayCookResults(myJson) {
  $('#results-list').empty();
  if (myJson.count === 0) {
      $('#results-list').append(`Sorry, no result is found. Please type in another key word to search`);
  } else {
  for (let i = 0; i < myJson.recipes.length; i++) {
    $('#results-list').append(`<div id="recipe-section" class="results-flex-container"><div class="informations"><h3 class="recipe-infos">${myJson.recipes[i].title}</h3>
    <p class="recipe-infos"><span class="bold">Publisher: </span>${myJson.recipes[i].publisher}</p>
    <p class="links recipe-infos"><a href="${myJson.recipes[i].f2f_url}" target="_blank">View recipe</a></div>
    <div class="image-container"><img class="image-cook" src="${myJson.recipes[i].image_url}" alt="recipes-thumb-img">
    </div><hr>`);
    }
  }
  $('#results-list').removeClass('hide');
  $('#search-change').removeClass('hide');
  $(".spinner").hide();
  $(".magnifying-glass").show();
  $("#search-change").show();
  $("#back-top").show();

  $("#lower-section-container").ready(function(){
    $("html, body").animate({
        scrollTop: $('#lower-section-container').offset().top 
    }, 2000);
  });
};  

function formatCookQueryParams (params) {
  const queryItems = `key=${params["apiKey"]}&q=${params["searchTerm"]}`;
  return queryItems;
}

function getGeoCode(searchLocation) {
  let url = searchURL1 + encodeURI(`/locations?query=${searchLocation}`);
  return fetch(url, {
    headers: {
      'user-key': apiKey1
    },
    mode:'cors'
  }).then(function(response) {
    return response.json();
  }).then(function(myJson) {
    return {
      'entity_type': myJson['location_suggestions'][0].entity_type,
      'entity_id': myJson['location_suggestions'][0].entity_id
    };
  });
}

function getDineResult(searchNameDine, geoData) {
  let url = searchURL1 + encodeURI(`/search?entity_id=${geoData['entity_id']}&entity_type=${geoData['entity_type']}&q=${searchNameDine}`);
  return fetch(url, {
    headers: {
      'user-key': apiKey1
    },
    mode:'cors'
  }).then(function(response) {
    return response.json();
  });
}

function formatCookQueryParams (params) {
  const queryItems = `key=${params["apiKey"]}&q=${params["searchTerm"]}`;
  return queryItems;
}

function getCookResults(searchTerm) {
  const params = {
    apiKey: apiKey2,
    searchTerm: searchTerm
  };
  const queryString = formatCookQueryParams(params)
  const url = searchURL2 + '?' + queryString;

  fetch(url)
    .then(function(response) {
      return response.json();
    })
    .then(function(myJson) {
      console.log(JSON.stringify(myJson));
      displayCookResults(myJson);
    })
}

function watchForm() {
  $('#cook').click(function(){
    $(this).parent("#choice-section").hide();
    $("#js-form-" + $(this).attr("id")).removeClass("hide");
    $("#intro").hide();
    $('#switch-cook').removeClass("hide");
  });

  $('#dine').click(function(){
    $(this).parent("#choice-section").hide();
    $("#js-form-" + $(this).attr("id")).removeClass("hide");
    $("#intro").hide();
    $('#switch-dine').removeClass("hide");
    });

  $("#switch-cook").click(function(){
    $('.js-form').toggleClass("hide");
    $("#switch-cook").hide();
    $("#switch-dine").show();
  });

  $("#switch-dine").click(function(){
    $('.js-form').toggleClass("hide");
    $("#switch-dine").hide();
    $("#switch-cook").show();
  });

 
  $("#backtop-button").click(function(){
    $("html, body").animate({
      scrollTop: $('#upper-section-container').offset().top 
    }, 2000);
  });

  $("#bottom-text").click(function(){
    $("html, body").animate({
      scrollTop: $('#upper-section-container').offset().top 
    }, 2000);
  });

  $('#magnifying-glass-dine').click(event => {
    $(".magnifying-glass").hide();
    $(".spinner").show();
    event.preventDefault();
    const searchNameDine = $('#js-search-name').val();
    const searchLocation = $('#js-search-location').val();

    let geoDataPromise = getGeoCode(searchLocation);
    geoDataPromise.then(function(geoData) {
      let resultPromise = getDineResult(searchNameDine, geoData);
      resultPromise.then(function(resultData) {
        displayDineResults(resultData);
      });
    });
  });

  $('#magnifying-glass-cook').click(event => {
    $(".magnifying-glass").hide();
    $(".spinner").show();
    event.preventDefault();
    const searchTerm = $('#js-search-cook').val();
    getCookResults(searchTerm);
  });
}

$(watchForm);
