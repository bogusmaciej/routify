from app import app
from flask import request, send_from_directory
from flask_cors import CORS, cross_origin
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
import googlemaps
import math
import os

CORS(app, support_credentials=True) #cos tam do kwestii bezpieczenstwa, zeby mozna było robić fetch w js

spotify = spotipy.Spotify(client_credentials_manager=SpotifyClientCredentials())
gmaps = googlemaps.Client(key=os.environ.get("GOOGLE_MAPS_API_KEY"))


@app.route('/')
@cross_origin(supports_credentials=True)
def index():
    return send_from_directory("static", "index.html")

@app.route('/api')
@cross_origin(supports_credentials=True)
def api():
    try:
        origin = request.args.get('origin')
        destination = request.args.get('destination')
        mode = request.args.get('mode')
        artists = request.args.getlist('artist')
        genres = request.args.getlist('genre')
        
        route_info = get_route_info(origin, destination, mode)
        route_duration = route_info["duration"]
        estimated_numb_of_songs = math.ceil(route_duration/200)
        if(estimated_numb_of_songs) == 0: estimated_numb_of_songs=1
        artists_list = create_artist_id_list(artists)
        
        playlist_duration = 0
        number_of_tracks = 0
        
        tracks_dict = {
            "route_info" : {
                "origin" : origin,
                "destination" : destination,
                "mode" : mode,
                "route_duration" : route_info["duration"],
                "route_distance" : route_info["distance"]
            },
            "playlist":{
                "number_of_tracks" : "",
                "playlist_duration" : "",
                "tracks" : []
            },
            "exception" : {
                "isException" : False
            }
        }
        
        if(estimated_numb_of_songs>100) : estimated_numb_of_songs = 100

        tracks_response = spotify.recommendations(seed_artists=artists_list, seed_genres=genres, limit=estimated_numb_of_songs)
        
        tracks_response = tracks_response["tracks"]
        for track in tracks_response:
            if route_duration > 0:
                tracks_dict["playlist"]["tracks"].append(
                    {
                        "artist" : track["artists"][0]["name"],
                        "name" : track["name"],
                        "duration" : track["duration_ms"]/1000,
                        "url" : track["external_urls"]["spotify"],
                        "img" : track["album"]["images"][0]["url"],
                    }
                )
                playlist_duration += round(track["duration_ms"]/1000, 2)
                route_duration -= track["duration_ms"]/1000
                number_of_tracks += 1
            else: break
        tracks_dict["playlist"]["playlist_duration"] = round(playlist_duration, 0)
        tracks_dict["playlist"]["number_of_tracks"] = number_of_tracks
        return tracks_dict

    except Exception as e:
        response = {"exception" : { 
            "isException" : True,
            "error" : "trzeba to zrobić kurde zeby pokazywało kody błedu np 502"
            } }
        return response

@app.route('/api/genres') #returns list of genres avaliable  
@cross_origin(supports_credentials=True)
def genres_info():
    return spotify.recommendation_genre_seeds()

def get_route_info(origin, destination, mode):
    directions_result = gmaps.directions(origin, destination, mode=mode)
    
    result = {
        "duration" : directions_result[0]["legs"][0]["duration"]["value"],
        "distance" : directions_result[0]["legs"][0]["distance"]["text"]
    }
    
    return result

def create_artist_id_list(artists):
    artists_list=[]
    
    for artist in artists:
        respose = spotify.search(artist, type='artist')
        artists_list.append(respose["artists"]["items"][0]["id"])
        
    return artists_list
