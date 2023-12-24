class Maps:
    def __init__(self, gmaps, origin, destination, mode=None):
        self.gmaps = gmaps
        self.origin = origin
        self.destination = destination
        self.mode = mode
        
    def get_route_info(self):
        directions_result = self.gmaps.directions(self.origin, self.destination, mode=self.mode)
        
        result = {
            "origin" : self.origin,
            "destination" : self.destination,
            "mode" : self.mode,
            "duration" : directions_result[0]["legs"][0]["duration"]["value"],
            "distance" : directions_result[0]["legs"][0]["distance"]["text"]
        }
        
        return result