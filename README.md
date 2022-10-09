# The Gym Group - API

This repository outlines the structure of The Gym's API. With the example code, you will be able to query any API endpoint to programatically retrieve data about your gym profile.

*As The Gym Group's App is just a templated app for "egym" by NetPuse, this may work for any other of their Apps too.*

## API Structure
The web app renders your statistics server side. Web scraping is gross. To retrieve our gym statistics we opt for the mobile API.

### Login mechanism
The login mechanism requires slighty different headers to the rest of the API:

*POST* `https://thegymgroup.netpulse.com/np/exerciser/login`
#### Data
```
{"username": "USERNAME", 
"password": "PIN"}
```
#### Headers
```
{
    "accept": "application/json",
    "accept-encoding": "gzip",
    "connection": "Keep-Alive",
    "host": "thegymgroup.netpulse.com",
    "user-agent": "okhttp/3.12.3",
    "x-np-api-version": "1.5",
    "x-np-app-version": "5.0",
    "x-np-user-agent": "clientType=MOBILE_DEVICE; devicePlatform=ANDROID; deviceUid=; applicationName=The Gym Group; applicationVersion=5.0; applicationVersionCode=38",
    "content-type": "application/x-www-form-urlencoded",
    "content-length":"*CALCULATE CONTENT LENGTH HERE*"
}
```

### Get Visits
When you log in, the response will contain a `Set-Cookie` header. Use this header for other API requests.

The login response will return general user information including your user UUID. Use this for other API requests too.

*GET* `https://thegymgroup.netpulse.com/np/exercisers/*USER_UUID*/check-ins/history?endDate=2022-10-09T15:02:56`

#### Headers
```
{
    "accept": "application/json",
    "accept-encoding": "gzip",
    "connection": "Keep-Alive",
    "cookie": *COOKIE*,
    "host": "thegymgroup.netpulse.com",
    "user-agent": "okhttp/3.12.3",
    "x-np-api-version": "1.5",
    "x-np-app-version": "5.0",
    "x-np-user-agent": "clientType=MOBILE_DEVICE; devicePlatform=ANDROID; deviceUid=; applicationName=The Gym Group; applicationVersion=5.0; applicationVersionCode=38"
}
```

### Other API routes
#### GET
* https://thegymgroup.netpulse.com/np/exerciser/*USER_UUID*/profile
* https://thegymgroup.netpulse.com/np/exerciser/*USER_UUID*/membership
* https://thegymgroup.netpulse.com/np/company/*GYM_UUID*/classes?startDateTime=1665241380601&exerciserUuid=*USER_UUID*&endDateTime=1667833376241
* https://thegymgroup.netpulse.com/np/thegymgroup/v1.0/exerciser/*USER_UUID*/gym-busyness?gymLocationId=
#### PUT
* https://thegymgroup.netpulse.com/np/exerciser/*USER_UUID*