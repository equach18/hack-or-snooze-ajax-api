"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $navLogin.hide();
  $navLogOut.show();
  $navUserLinks.show();
  $loginForm.hide();
  $signupForm.hide();
  $navUserProfile.text(`${currentUser.username}`).show();
}

// Show story submit on click on "submit"
function navStorySubmitClick(evt){
  console.debug("navStorySubmitClick", evt);
  hidePageComponents();
  $allStoriesList.show();
  $storySubmitForm.show();
}
$navStorySubmit.on("click", navStorySubmitClick)


// Show favorites upon click
function navFavoritesClick(evt){
  console.debug("navFavoritesClick", evt);
  hidePageComponents();
  putFavoritesOnPage();
}
$navFavorites.on("click", navFavoritesClick);

// Show my stories upon click
function navMyStoriesClick(evt){
  console.debug("navFavoritesClick", evt);
  hidePageComponents();
  putMyStoriesOnPage();
}
$navMyStories.on("click", navMyStoriesClick);

