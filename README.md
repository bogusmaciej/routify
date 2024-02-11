VENV:
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

DOCKER:
1. In Dockerfile change lines
>ENV SPOTIPY_CLIENT_ID={YOUR_CLIENT_ID}  
>ENV SPOTIPY_CLIENT_SECRET={YOUR_CLIENT_SECRET}  
>ENV GOOGLE_MAPS_API_KEY={YOUR_API_KEY}  
>ENV SPOTIPY_REDIRECT_URI={YOUR_REDIRECT_URI}  

2. run 'docker build -t flask-container .'
3. run 'docker run -d -p 5000:5000 flask-container'

4. project will be hosted on your server's ip address on port 5000
