FROM python:3.10-alpine

EXPOSE 5000/tcp

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY app/ .

ENV SPOTIPY_CLIENT_ID={YOUR_CLIENT_ID}
ENV SPOTIPY_CLIENT_SECRET={YOUR_CLIENT_SECRET}
ENV GOOGLE_MAPS_API_KEY={YOUR_API_KEY}
ENV SPOTIPY_REDIRECT_URI={YOUR_REDIRECT_URI}

CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "app:app"]