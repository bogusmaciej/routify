import math
from datetime import datetime
from spotipy.oauth2 import SpotifyClientCredentials
import spotipy


class SpotifyCC:
    #maps - defined Maps object, spotify - spotipy object (SpotifyClientCredentials)
    def __init__(self):
        super()
        self.spotify = spotipy.Spotify(client_credentials_manager=SpotifyClientCredentials())
        
    
    def create_playlist_api(self, artists, genres, maps):
        route_info = maps.get_route_info()
        
        tracks_dict = {
            "route_info" : route_info,
            "playlist":{
                "number_of_tracks" : "",
                "playlist_duration" : "",
                "tracks" : []
            },
            "exception" : {
                "isException" : False
            }
        }
        
        route_duration = route_info["duration"]
        
        estimated_numb_of_songs = math.ceil(route_duration/200)
        if(estimated_numb_of_songs>100) : estimated_numb_of_songs = 100
        elif(estimated_numb_of_songs== 0) : estimated_numb_of_songs=1
        
        artists_list = self.create_artist_id_list(artists)
        
        playlist_duration = 0
        number_of_tracks = 0
        
        tracks_response = self.spotify.recommendations(seed_artists=artists_list, seed_genres=genres, limit=estimated_numb_of_songs)
        tracks_response = tracks_response["tracks"]
        
        for track in tracks_response:
            if route_duration > 0:
                
                tracks_dict["playlist"]["tracks"].append(self.generate_track_item(track))
                
                playlist_duration += round(track["duration_ms"]/1000, 2)
                route_duration -= track["duration_ms"]/1000
                number_of_tracks += 1
            
            else: break
            
        tracks_dict["playlist"]["playlist_duration"] = round(playlist_duration, 0)
        tracks_dict["playlist"]["number_of_tracks"] = number_of_tracks
        return tracks_dict
    
    def generate_track_item(self, track):
        return {
                "artist" : track["artists"][0]["name"],
                "name" : track["name"],
                "duration" : track["duration_ms"]/1000,
                "url" : track["external_urls"]["spotify"],
                "img" : track["album"]["images"][0]["url"],
                "id" : track["id"]
            }
        
    def create_artist_id_list(self, artists):
        artists_list=[]
        
        for artist in artists:
            respose = self.spotify.search(artist, type='artist')
            artists_list.append(respose["artists"]["items"][0]["id"])
            
        return artists_list
    
    def get_genres(self):
        return self.spotify.recommendation_genre_seeds()
    
    def create_user_playlist(self, tracks=[], public=False):
        name = f"Routify {datetime.now().strftime('%d.%m.%y %H:%M')}"
        user = self.spotifyOAuth.current_user()["id"]
        pl = self.spotifyOAuth.user_playlist_create(user=user, name=name, public=public)
        self.spotifyOAuth.user_playlist_add_tracks(user=user, playlist_id = pl["id"], tracks=tracks)
        return ""