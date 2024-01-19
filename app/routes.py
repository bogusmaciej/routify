from classes import SpotifyCC
from classes import SpotifyOA
from classes import Maps

import json
import os
import googlemaps

from flask import request, Blueprint, render_template, redirect, g
from flask_cors import CORS, cross_origin

gmaps = googlemaps.Client(key=os.environ.get("GOOGLE_MAPS_API_KEY"))
my_spotify_client_credentials = SpotifyCC.SpotifyCC()
my_spotify_OAuth = SpotifyOA.SpotifyOA()

bp = Blueprint('app', __name__)
CORS(bp, support_credentials=True) #cos tam do kwestii bezpieczenstwa, zeby mozna było robić fetch w js
#trzeva przetestowac tworzenie instancji oneiktu OAuth da danej sesji bo zapamietuje token


@bp.route('/')
@cross_origin(supports_credentials=True)
def index():
    code = request.args.get("code")
    if(code):
        print(f"code : {code}")
        my_spotify_OAuth.set_token(code)

    return render_template("index.html")

@bp.route('/login')
def logowanie():
    return redirect(my_spotify_OAuth.login())
      
@bp.route('/api')
@cross_origin(supports_credentials=True)
def api():
    try:
        origin = request.args.get('origin')
        destination = request.args.get('destination')
        mode = request.args.get('mode')
        artists = request.args.getlist('artist')
        genres = request.args.getlist('genre')
        
        maps = Maps.Maps(gmaps, origin, destination, mode)
        
        return my_spotify_client_credentials.create_playlist_api(artists, genres, maps)

    except Exception as e:
        response = {"exception" : { 
            "isException" : True,
            "error" : str(e)
            } }
        return response

@bp.route('/api/genres') #returns list of genres avaliable 
def genres_info():
    return my_spotify_client_credentials.get_genres()

@bp.route('/api/create-playlist', methods=['POST']) #creates playlist on spotify account  
def create_playlist():
    try:
        print("creating")
        tracks = json.loads(request.data)["tracks"]
        my_spotify_OAuth.create_user_playlist(tracks = tracks)
        return {"status":"ok", "message": "playlist created!"}
    except Exception as e:
        print(e)
        return {"status":"error", "message": str(e)}
