document.getElementById("create_playlist_button").addEventListener("click", getPlaylist);

const playlist_div = document.querySelector(".tracks")
const error_box = document.querySelector("#error")
const loading_icon = document.querySelector("#loading-icon");
const message_box = document.querySelector(".message-box");
const genres_suggestions_block = document.querySelector(".genres-suggestions");
let genres_array = []
let tracks_array = []

async function getPlaylist(){
    let origin = document.querySelector("#origin").value
    let destionation = document.querySelector("#destination").value
    let mode = document.querySelector("#mode").value
    let artist = document.querySelector("#artist").value
    let genre = document.querySelector("#genre").value

    const playlist_info_box = document.querySelector(".playlist-info")

    if(!genres_array.includes(genre)){
        showMessageBox("genre not found!", true)
        return
    }
    
    if(origin && destionation && mode && artist && genres_array.includes(genre)){
        let warning_message = ""
        num=1

        error_box.innerHTML=""
        loading_icon.classList.add("display")
        playlist_info_box.innerHTML=""
        playlist_div.innerHTML=""
        fetch(createURL(origin, destionation, mode, artist, genre))
        .then(request => request.json())
        .then(response => {
            loading_icon.classList.remove("display")
            if(response.exception.isException == false){
                if(response.route_info.duration>200){
                    if(response.playlist.number_of_tracks==100){warning_message = "Sorry, your playlist can include maximum 100 tracks.<br/>"}
                    playlist_div.innerHTML="<h1>playlist for your trip</h1>"
            
                    generatePlaylistInfo(origin, destionation, mode, response.route_info.duration, response.route_info.distance, response.playlist.playlist_duration, response.playlist.number_of_tracks, warning_message)
                
                    let tracks = response.playlist.tracks;
                    tracks.forEach(track => {
                        createTrackElement(track, num)
                        num++
                        tracks_array.push(track.id)
                    });
                }
                else{
                    showMessageBox("your trip is too short, to generate playlist", true)
                    createPlaylistError()
                }
            }
            else showMessageBox("an error occurred while creating the playlist", true)
            const urlParams = new URLSearchParams(window.location.search);

            if(urlParams.has('code')){
                document.querySelector("#save_playlist_to_spotify_button")?.addEventListener('click', ()=> {
                    fetch("/api/create-playlist", {
                            "method": "POST",
                            "body": JSON.stringify({"tracks":tracks_array}),
                    })
                    .then((response) =>{ 
                        return response.json()
                    })
                    .then((data) => {
                        console.log(data)
                        if(data.status == "ok"){
                            showMessageBox(data.message, false)
                        }
                        else{
                            showMessageBox(data.message, true)
                        }
                    })
                });
            }
            else{
                document.querySelector("#save_playlist_to_spotify_button").href = "/login"
            }

            
        })
        .catch(error => {
            showMessageBox("connection failed<br>check your internet connection!", true)
            loading_icon.classList.remove("display")
            console.log(error);
        })
    }
    else showMessageBox("not all values are given!", true)
}

function createPlaylistError(){
    playlist_div.innerHTML=""
    playlist_div.innerHTML+=`
    <div class='playlist-info'>
        try with different data
    </div>`
}

function generatePlaylistInfo(origin, destination, mode, route_duration, route_distance, playlist_duration, tracks_num, warning){
    playlist_div.innerHTML+=`
    <div class='playlist-info'>
        you will <a href="https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=${mode}">travel</a> ${route_distance} in <b>${calcTime(route_duration)}</b>.<br>
        generated playlist has <b>${tracks_num}</b> traks and is <b>${calcTime(playlist_duration)}</b> long.<br>
        <b>${warning}</b>
        <a id="save_playlist_to_spotify_button">add this playlist to your Spotify account</a>
    </div>`
}

function calcTime(time_in_sec){
    if(time_in_sec>3600){
        hours = Math.floor(time_in_sec/3600)
        min = Math.floor((time_in_sec - (hours*3600)) / 60)
        sec = time_in_sec%60
        return hours+"h "+min+" min "+sec+" sec"
    }
    else if(time_in_sec<3600 && time_in_sec>60){
        min = Math.floor(time_in_sec/60)
        sec = time_in_sec%60
        return min+" min "+sec+" sec"
    }
    else return time_in_sec+" sec"
}

function createURL(origin, destionation, mode, artist, genre){
    url = "/api?"+"origin="+origin+"&destination="+destionation+"&mode="+mode+"&artist="+artist+"&genre="+genre;
    return url
}

function createTrackElement(track, num){
    track_element = `
    <a href='${track.url}' target='_blank'>
        <div class="track">
            <div class="track-img"><img src="${track.img}"></div>
            <div class="track-info-outer">
                <div class="track-info">
                    <div class="track-name">${num}.${track.name}</div>    
                    <div class="track-artist">${track.artist}</div>
                </div>
            </div>
            
        </div>
    </a>
    `
    playlist_div.innerHTML += track_element
}

function searchGenreList(user_string){
    let matches = false
    genres_suggestions_block.style.display = "block"
    genres_suggestions_block.innerHTML = ""
    

    genres_array.forEach(genre => {
        if(genre.indexOf(user_string) != -1 || user_string == ""){
            suggestion = genre.replace(user_string, `<b>${user_string}</b>`)
            genres_suggestions_block.innerHTML += `<div class='genre-sugesstion' onclick="writeGenre('${genre}')">${suggestion}<div>`
            matches = true
        }
    })
    if(matches == false) genres_suggestions_block.innerHTML = `<div class='genre-sugesstion'>nothing matches<div>`
} 

function writeGenre(genre){
    document.querySelector("#genre").value = genre
    genres_suggestions_block.style.display = "none"
}

function showMessageBox(message, isError = false){
    if(isError == true) message_box.style.backgroundColor = "rgba(189, 0, 0)"
    else message_box.style.backgroundColor = "rgba(65, 255, 74)"
    message_box.innerHTML = message;
    message_box.style.visibility = "visible"
    message_box.classList.add("msg-visible");
    setTimeout(() => {
        message_box.classList.remove("msg-visible");
        setTimeout(() => {message_box.style.visibility = "hidden"}, "500");
    }, "4000");
}

(() => {
    fetch("/api/genres")
    .then(request => request.json())
    .then(response => {
        genres_array = response.genres
        document.getElementById("genre").addEventListener("keyup", () => {
            searchGenreList(document.getElementById("genre").value)
        })
        document.getElementById("genre").onfocus = () => {
            searchGenreList(document.getElementById("genre").value)
        }
        document.getElementById("genre").onblur = () => {
            setTimeout(() => {
                genres_suggestions_block.style.display = "none"
              }, 100);
            
        }
    });

    checkGeoPermission()
})();   
