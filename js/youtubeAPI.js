const apiKey = 'AIzaSyABvTENtW0dmRxwvOUPu76RZ7Z6vg9kRA4'; 
const searchURL = 'https://www.googleapis.com/youtube/v3/search';

function formatQueryParams(params) {
    const queryItems = Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
  }
  
  function loadVideoToPlayer(videoId){
    $('#playable-video').attr('src', `https://www.youtube.com/embed/${videoId}`);
  }

  function displayVideoResults(responseJson,exclude='') {
    // iterate through the items array
    let i = 0;
    let vidPos = 0;
    while (i < 3){
      console.log(i);
      // for each video object in the items 
      //array, add a list item to the results 
      //list with the video title and thumbnail
      if( exclude.length > 0 && responseJson.items[vidPos].id.videoId == exclude ){
        vidPos++;
      }else{
        $('#video-thumbs').append(
          `<li style='display:inline-block;margin-bottom:20px;'>
          <a href="javascript:loadVideoToPlayer('${responseJson.items[vidPos].id.videoId}')">
          <img src='${responseJson.items[vidPos].snippet.thumbnails.default.url}' style='margin-right:10px;'>
          <h3 style='align-self:flex-start'>${responseJson.items[vidPos].snippet.title}</h3>
          </a>
          </li>`
        );
        i++;
        vidPos++;
      }
    };
  };
  
  function getYouTubeVideos(query, excludeVideoID='') {
    const params = {
      key: apiKey,
      q: `${query} recipe`,
      part: 'snippet',
      maxResults: 10,
      type: 'video'
    };

    const queryString = formatQueryParams(params)
    const url = searchURL + '?' + queryString;
  
    console.log(url);
  
    fetch(url)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(response.statusText);
      })
      .then(responseJson => displayVideoResults(responseJson,excludeVideoID))
      .catch(err => {
          console.log('uho');
        //$('#js-error-message').text(`Something went wrong: ${err.message}`);
      });
  }