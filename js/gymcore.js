const fetch = require('node-fetch')
const querystring = require('querystring')
const host = 'https://thegymgroup.netpulse.com/np/'
var setCookie = ''
class core {
    static creds = querystring.stringify({"username": "email", "password": "pin"})
    static link = {
        login: host + 'exerciser/login',
        profile: host + 'exerciser/UUID/profile',
        membership: host + 'exerciser/UUID/membership',
        activity: host + `exercisers/UUID/check-ins/history?endDate=${String(new Date()).split(' ')[3]}-12-31T23%3A59%3A59&startDate=2010-01-01T00%3A00%3A00`,
        gym: host + 'thegymgroup/v1.0/exerciser/UUID/gym-busyness?gymLocationId=' //add uuid from gym.txt to get specific gym info, if nothing is supplied then gym tied to the membership is returned
    }
    static headers = {
        "accept": "application/json",
        "accept-encoding": "gzip",
        "connection": "Keep-Alive",
        "host": "thegymgroup.netpulse.com",
        "user-agent": "okhttp/3.12.3",
        "x-np-api-version": "1.5",
        "x-np-app-version": "5.0",
        "x-np-user-agent": "clientType=MOBILE_DEVICE; devicePlatform=ANDROID; deviceUid=; applicationName=The Gym Group; applicationVersion=5.0; applicationVersionCode=38",
        "content-type": "application/x-www-form-urlencoded"
    }
    static req(url, headers, method, payload, ops={method: method, headers: headers}) {
        if (payload) ops.body = payload
        return new Promise((resolve)=>{
            fetch(url,ops).then(res=>{
                setCookie = res.headers.get('set-cookie')
                return res.json()
            }).then(msg=>resolve([msg, setCookie]))
        })
    }
    static mstodate(ms) {
        const roundTowardsZero = ms > 0 ? Math.floor : Math.ceil;
        return this.msToDuration({
            days: roundTowardsZero(ms / 86400000),
            hours: roundTowardsZero(ms / 3600000) % 24,
            minutes: roundTowardsZero(ms / 60000) % 60,
            seconds: roundTowardsZero(ms / 1000) % 60,
            milliseconds: roundTowardsZero(ms) % 1000,
            microseconds: roundTowardsZero(ms * 1000) % 1000,
            nanoseconds: roundTowardsZero(ms * 1e6) % 1000
        });
    }
    static msToDuration(s) {
        let e = "";
        if (s.days > 0 && 1 !== s.days)
            if (s.days < 365) e += `${s.days} days `;
            else {
                let d = s.days, n = 0;
                for (; d > 365;) d -= 365, n++;
                e += 1 === n ? `${n} year ` : `${n} years `, e += 1 === d ? `${d} day ` : `${d} days `
            }
        else 1 === s.days && (e += `${s.days} day `);
        return s.hours > 0 && 1 !== s.hours ? e += `${s.hours} hours ` : 1 === s.hours && (e += `${s.hours} hour `), s.minutes > 0 && 1 !== s.minutes ? e += `${s.minutes} minutes ` : 1 === s.minutes && (e += `${s.minutes} minute `), s.seconds > 0 && 1 !== s.seconds ? e += `${s.seconds} seconds ` : 1 === s.seconds && (e += `${s.days} second `), e
    }
}
module.exports = core