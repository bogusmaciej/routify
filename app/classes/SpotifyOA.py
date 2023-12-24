import math
from datetime import datetime
from spotipy import oauth2
import spotipy
import os

SPOTIPY_CLIENT_ID = os.environ.get("SPOTIPY_CLIENT_ID")
SPOTIPY_CLIENT_SECRET = os.environ.get('SPOTIPY_CLIENT_SECRET')
SPOTIPY_REDIRECT_URI = os.environ.get('SPOTIPY_REDIRECT_URI')
SCOPE = 'playlist-modify-public playlist-modify-private'
CACHE = '.spotipyoauthcache'

class SpotifyOA:
    #maps - defined Maps object, spotify - spotipy object (SpotifyClientCredentials)
    def __init__(self, token="eoeo"):
        self.token = token
        self.isLogged = False
        self.spotify = oauth2.SpotifyOAuth(SPOTIPY_CLIENT_ID, SPOTIPY_CLIENT_SECRET, SPOTIPY_REDIRECT_URI, scope=SCOPE, cache_path=CACHE )
        
    def login(self):
        return self.spotify.get_authorize_url()
    
    def set_token(self, code):
        token_info = self.spotify.get_access_token(code)
        self.token = token_info['access_token']
        self.isLogged = True

        
    def create_user_playlist(self, tracks=[], public=False):
        print(self.token)
        if(self.token):
            try:
                print(self.token)
                sp = spotipy.Spotify(self.token)
                name = f"Routify {datetime.now().strftime('%d.%m.%y %H:%M')}"
                user = sp.current_user()["id"]
                pl = sp.user_playlist_create(user=user, name=name, public=public)
                sp.user_playlist_add_tracks(user=user, playlist_id = pl["id"], tracks=tracks)
                return ""
            except Exception as e:
                print (e)
        else:
            print("no token")