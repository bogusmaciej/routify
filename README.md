1. create virtual enviroment (venv) (just at first time): 
>python -m venv .venv
2. start venv: 
>source .venv/Scripts/activate
3. install packages (just at first time): 
>pip install -r requirements.txt 
4. export env variables (in console): (from google maps api and spotify api)
>export SPOTIPY_CLIENT_ID={YOUR_CLIENT_ID}  
>export SPOTIPY_CLIENT_SECRET={YOUR_CLIENT_SECRET}  
>export GOOGLE_MAPS_API_KEY={YOUR_API_KEY}  
>export SPOTIPY_REDIRECT_URI={'YOUR_REDIRECT_URI'}  
5. run flask development server:
>flask run
