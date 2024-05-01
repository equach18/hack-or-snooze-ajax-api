"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */
// div is added for star icon
function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);
  const hostName = story.getHostName();

  //creates solid star on start if already in favorites and bordered star if not in favorites 
  let star = `<i class='far fa-star fa-xs'></i>`;
  let starClass = "hidden";
  if(currentUser){
    starClass = "";
    let currentFavorites = currentUser.favorites.map(({storyId}) => storyId);
    if(currentFavorites.includes(story.storyId)){
      star = `<i class='fas fa-star fa-xs'></i>`;
    }
  }
  
  return $(`
      <li id="${story.storyId}">
        <div><span class="star-icon ${starClass}">${star}</span></div>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */
function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();
  hidePageComponents()
  
  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }
  
  $allStoriesList.show();
}

// adds new submission to page
async function generateNewSubmission(evt){
  evt.preventDefault();
  console.debug("getNewSubmission");

  //retrieves input values
  const author = $("#story-author").val();
  const title = $("#story-title").val();
  const url = $("#story-url").val();

  const submission = await storyList.addStory(currentUser, {title, author, url});
  $allStoriesList.prepend(generateStoryMarkup(submission));

  $storySubmitForm[0].reset();
  $storySubmitForm.hide();
}
//calls generateNewSubmission on story submission 
$storySubmitForm.on("submit", generateNewSubmission)

// toggleFavorites function toggles the star icon and either removes or adds story to favorites
function toggleFavorites(evt){
  console.debug("toggleFavorites");
  const $target = $(evt.target);
  const clickedStoryId = $target.closest("li").attr("id");

  const starIcon = ($target.attr("class") === "fas fa-star fa-xs") ? "far fa-star fa-xs" : "fas fa-star fa-xs";

  $target.attr("class", starIcon);

  const currentFavorites = currentUser.favorites.map(storyIds => storyIds.storyId);
  const clickedStory = storyList.stories.find(story => story.storyId === clickedStoryId);

  if(currentFavorites.includes(clickedStoryId)){
    currentUser.removeFromFavorites(clickedStory);
  }
  else{
    currentUser.addToFavorites(clickedStory);
  }
}
$allStoriesList.on("click", ".star-icon", toggleFavorites);
$favoriteStoriesList.on("click", ".star-icon", toggleFavorites);
$myStoriesList.on("click", ".star-icon", toggleFavorites);

// adds favorites to favorite story list
function putFavoritesOnPage() {
  console.debug("putFavoritesOnPage");
  $favoriteStoriesList.empty();
  if(currentUser.favorites.length === 0){
    $favoriteStoriesList.prepend(`No favorites added yet!`);
  }
  else{
    // loop through all of user favorite stories and generate HTML for them
    for (let favoriteStory of currentUser.favorites) {
      const $favoriteStory = generateStoryMarkup(favoriteStory);
      $favoriteStoriesList.append($favoriteStory);
    }
  }
  $favoriteStoriesList.show();
}

// adds user stories to "my stories" list
function putMyStoriesOnPage() {
  console.debug("putMyStoriesOnPage");
  $myStoriesList.empty();

  if(currentUser.ownStories.length === 0){
    $myStoriesList.prepend(`No stories added by user yet!`);
  }
  else{
    // loop through all of own stories and generate HTML for them
    for (let myStories of currentUser.ownStories) {
      const $myStories = generateStoryMarkup(myStories);
      let $trashIconHtml = `<span class="trash-icon"><i class="fas fa-trash-alt"></i></span>`;
      $myStories.prepend($trashIconHtml);
      $myStoriesList.append($myStories);
    }
  }
  $myStoriesList.show();
}

//removes story upon clicking on trash icon
async function removeStoryHandler(evt) {
  console.debug("removeStoryHandler",evt);
  const $target = $(evt.target);
  $target.parent().attr("class","trash-icon-no-click");
  // $target.attr("class",`fas fa-trash-alt' style='color:#ff0505`);
  const clickedStoryId = $target.closest("li").attr("id");
  const clickedStory = storyList.stories.find(story => story.storyId === clickedStoryId);
  currentUser.removeStory(clickedStory);
}
$myStoriesList.on("click", ".trash-icon", removeStoryHandler);
