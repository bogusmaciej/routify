import os
from spotipy.oauth2 import SpotifyClientCredentials
class Spotify(object):
    def __init__(self):
        self.SPOTIPY_CLIENT_ID = os.environ.get("SPOTIPY_CLIENT_ID")
        self.SPOTIPY_CLIENT_SECRET = os.environ.get('SPOTIPY_CLIENT_SECRET')
        self.SPOTIPY_REDIRECT_URI = os.environ.get('SPOTIPY_REDIRECT_URI')
        self.SCOPE = 'playlist-modify-public playlist-modify-private'
        self.CACHE = '.spotipyoauthcache'