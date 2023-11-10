document.getElementById("create_playlist_button").addEventListener("click", getPlaylist);

const playlist_div = document.querySelector(".tracks")
const error_box = document.querySelector("#error")
const loading_icon = document.querySelector("#loading-icon");
let genres_array = []

async function getPlaylist(){
    let origin = document.querySelector("#origin").value
    let destionation = document.querySelector("#destination").value
    let mode = document.querySelector("#mode").value
    let artist = document.querySelector("#artist").value
    let genre = document.querySelector("#genre").value
    
    const playlist_info_box = document.querySelector(".playlist-info")
    
    if(origin && destionation && mode && artist && genre){
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
                if(response.route_info.route_duration>200){
                    if(response.playlist.number_of_tracks==100){warning_message = "Sorry, your playlist can include maximum 100 tracks."}
                    playlist_div.innerHTML="<h1>playlist for your trip</h1>"
            
                    generatePlaylistInfo(response.route_info.route_duration, response.route_info.route_distance, response.playlist.playlist_duration, response.playlist.number_of_tracks, warning_message)
                
                    let tracks = response.playlist.tracks;
                    tracks.forEach(track => {
                        createTrackElement(track, num)
                        num++
                    });
                }
                else createPlaylistError("your trip is too short, to generate playlist")
            }
            else createPlaylistError("an error occurred while creating the playlist")
        })
        .catch(error => {
            createPlaylistError("connection failed<br>check your internet connection!")
            loading_icon.classList.remove("display")
            console.log(error);
        })
    }
    else error_box.innerHTML="not all values are given!"
}

function createPlaylistError(message){
    playlist_div.innerHTML=""
    playlist_div.innerHTML+=`
    <div class='playlist-info'>
        ${message}
    </div>`
}

function generatePlaylistInfo(route_duration, route_distance, playlist_duration, tracks_num, warning){
    playlist_div.innerHTML+=`
    <div class='playlist-info'>
        you will travel ${route_distance} in <b>${calcTime(route_duration)}</b>.<br>
        generated playlist has <b>${tracks_num}</b> traks and is <b>${calcTime(playlist_duration)}</b> long.<br>
        <b>${warning}</b>
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
    url = "http://127.0.0.1:5000/api?"+"origin="+origin+"&destination="+destionation+"&mode="+mode+"&artist="+artist+"&genre="+genre;
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
    genres_array.forEach(genre => {
        if(genre.indexOf(user_string) != -1 && user_string != ""){
            console.log(genre)
            matches = true
        }
    })
    if(matches == false) console.log("nothing matches")
} 

window.onload = function() {
    fetch("http://127.0.0.1:5000/api/genres")
    .then(request => request.json())
    .then(response => {
        genres_array = response.genres
        document.getElementById("genre").addEventListener("keyup", () => {
            searchGenreList(document.getElementById("genre").value)
            console.log("---------------------")
        })
    });
}