import requests

base_headers = {
    "accept": "application/json",
    "accept-encoding": "gzip",
    "connection": "Keep-Alive",
    "host": "thegymgroup.netpulse.com",
    "user-agent": "okhttp/3.12.3",
    "x-np-api-version": "1.5",
    "x-np-app-version": "5.0",
    "x-np-user-agent": "clientType=MOBILE_DEVICE; devicePlatform=ANDROID; deviceUid=; applicationName=The Gym Group; applicationVersion=5.0; applicationVersionCode=38"}

profile_headers = base_headers.copy()
base_headers["content-length"] = "56"
base_headers["content-type"] = "application/x-www-form-urlencoded"

creds = {"username": "", "password": ""}

response = requests.post("https://thegymgroup.netpulse.com/np/exerciser/login", data=creds, headers=base_headers)
cookie = response.headers["Set-Cookie"]
profile_headers["cookie"] = cookie
user_id = response.json()["uuid"]

def get_url(url):
    profile = (requests.get(
        url,
        headers=profile_headers))
    return profile.json()


mins = 0
visits = get_url("https://thegymgroup.netpulse.com/np/exercisers/"+user_id+"/check-ins/history?endDate=2022-10-09T15%3A02%3A56")
for i in visits["checkIns"]:
    mins += i["duration"] / 60000

print("You have spent", str(round(mins / 60)), "hours in the gym since ", visits["checkIns"][0]["checkInDate"])
