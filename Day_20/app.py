from flask import Flask, render_template, request
import requests

app = Flask(__name__)

@app.route("/weather", methods=["GET", "POST"])
def index():
    weather = None
    if request.method == "POST":
        if "city" in request.form and request.form["city"]:  
            city = request.form["city"]

            geo_url = f"https://nominatim.openstreetmap.org/search?city={city}&format=json"
            geo_resp = requests.get(geo_url, headers={"User-Agent": "SyntexSparrowWeatherApp"}).json()

            if geo_resp:
                lat = geo_resp[0]["lat"]
                lon = geo_resp[0]["lon"]
            else:
                return render_template("index.html", weather=None, error="City not found")

        else:
            lat = request.form.get("lat")
            lon = request.form.get("lon")
        url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current_weather=true"
        resp = requests.get(url).json()

        if "current_weather" in resp:
            current = resp["current_weather"]
            weather = {
                "lat": lat,
                "lon": lon,
                "temp": current["temperature"],
                "windspeed": current["windspeed"],
                "time": current["time"],
                "location": request.form.get("city", f"{lat}, {lon}")
            }

    return render_template("index.html", weather=weather)

if __name__ == "__main__":
    app.run(debug=True)
