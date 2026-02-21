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
    "x-np-app-version": "6.5.1",
    "x-np-user-agent": "clientType=MOBILE_DEVICE; devicePlatform=ANDROID; deviceUid=; applicationName=The Gym Group; applicationVersion=5.0; applicationVersionCode=38",
    "content-type": "application/x-www-form-urlencoded",
    "content-length":"*CALCULATE CONTENT LENGTH HERE*"
}
```

#### Important Note
You can set the `x-np-app-version` header to a value greater than the current version, such as 9999. This forces the API to use the latest available version, even if the app has been updated. This is an easy workaround to avoid issues where old versions of the API stop working after updates.

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
    "x-np-app-version": "6.5.1",
    "x-np-user-agent": "clientType=MOBILE_DEVICE; devicePlatform=ANDROID; deviceUid=; applicationName=The Gym Group; applicationVersion=5.0; applicationVersionCode=38"
}
```

## Full docs via Claude Code and decompiling the APK

# The Gym Group (NetPulse) API Reference

Documented by decompiling The Gym Group Android APK (`com.netpulse.mobile.thegymgroup`) and testing endpoints against the live API.

## Base URL

```
https://thegymgroup.netpulse.com
```

All endpoint paths below are relative to this base. The base URL is dynamic per brand — other NetPulse/egym white-label apps use different hostnames.

## Authentication

Authentication is cookie-based via a `JSESSIONID` cookie. Log in first, then the cookie store handles subsequent authenticated requests automatically.

### Required Headers

Every request must include:

| Header | Value | Notes |
|--------|-------|-------|
| `User-Agent` | `okhttp/3.12.3` | The Android app's HTTP client user-agent |
| `Accept` | `application/json` | |
| `X-NP-API-Version` | `1.5` | |
| `X-NP-APP-Version` | Numeric app version (e.g. `9999`) | Must be a number |
| `X-NP-User-Agent` | See below | Semicolon-separated key=value pairs |

The `X-NP-User-Agent` header format:

```
clientType=MOBILE_DEVICE; devicePlatform=ANDROID; deviceUid=<device-uuid>; applicationName=The Gym Group; applicationVersion=<version-name>; applicationVersionCode=<version-code>
```

---

## Login

### POST `/np/exerciser/login`

Standard username/password login.

**Content-Type:** `application/x-www-form-urlencoded`

**Form Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `username` | string | Email address |
| `password` | string | PIN / passcode |

**Response:** `200 OK`

```json
{
  "username": "user@example.com",
  "uuid": "18fe83d6-c80c-4d21-a64f-b6277c418c97",
  "sessionId": "...",
  "isVerified": true,
  "isEmailVerified": true,
  "clubChainName": "The Gym Group",
  "homeClubUuid": "1bdeaf9b-37b1-42ee-9a6c-b8d82b86b7ad",
  "homeClubName": "London Acton",
  "firstName": "...",
  "lastName": "...",
  "chainUuid": "...",
  "timeZone": "Europe/London",
  "timeZoneOffset": "...",
  "measurementUnit": "...",
  "isGuestUser": false,
  "isHasMessages": false,
  "isProfileComplete": true,
  "isShowPT": false,
  "expirationTime": 0,
  "accountStatus": "Active",
  "googleWalletUrl": "..."
}
```

A `JSESSIONID` cookie is set — use a cookie jar for all subsequent requests.

### POST `/np/exerciser/oauth2/login`

OAuth2 login (used for social sign-in).

### POST `/np/logout`

Logs out and invalidates the session.

---

## Classes (GroupX)

### GET `/np/company/{companyUuid}/classes`

List classes for a gym location.

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `startDateTime` | long | Yes | Start of range (epoch milliseconds) |
| `endDateTime` | long | Yes | End of range (epoch milliseconds) |
| `exerciserUuid` | string | Yes | Logged-in user's UUID |
| `type` | string | No | Filter by class type |

**Response:** `200 OK` — Array of class objects

```json
[
  {
    "brief": {
      "id": "class-uuid-here",
      "name": "SGT-Functional Conditioning",
      "type": "...",
      "free": true,
      "booked": false,
      "waitlisted": false,
      "maxCapacity": 16,
      "totalBooked": 3,
      "waitlistCapacity": 0,
      "waitlistBooked": 0,
      "startDateTime": 1771678200000,
      "endDateTime": 1771681800000,
      "instructor": {
        "fullName": "Instructor Name"
      },
      "activity": {
        "description": "A full body workout..."
      },
      "availableOptions": { ... },
      "childCare": false,
      "availableSpots": ["1", "2", "3"],
      "customInfo": [],
      "clubUuid": "1bdeaf9b-37b1-42ee-9a6c-b8d82b86b7ad",
      "liveStreamClass": false,
      "cancelled": false
    },
    "details": null,
    "attendeeDetails": {
      "id": "...",
      "booked": false,
      "waitlistBooked": false,
      "waitlistPosition": null,
      "productAvailability": null,
      "availableActions": [],
      "spotBooked": null
    }
  }
]
```

**Notes:**
- `startDateTime` and `endDateTime` are epoch milliseconds
- `instructor.fullName` may be empty for some gyms
- The `brief` wrapper is always present in list responses
- `cancelled` indicates whether the class itself has been cancelled by the gym

### GET `/np/company/{companyUuid}/class/{classUuid}`

Get details for a single class.

**Response:** Single class object (same shape as array items above).

### GET `/np/exerciser/{exerciserUuid}/schedule`

Get the user's booked classes (my schedule).

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `startDateTime` | long | No | Start of range (epoch milliseconds) |
| `endDateTime` | long | No | End of range (epoch milliseconds) |
| `clubUuid` | string | No | Filter by club |

**Response:** Array of class objects.

---

## Booking & Waitlist

### POST `/np/company/{companyUuid}/class/{classUuid}/addExerciser`

Book a class.

**Content-Type:** `application/x-www-form-urlencoded`

**Form Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `exerciserUuid` | string | Yes | User's UUID |
| `spot` | string | No | Spot number (for spot-based booking) |
| `type` | string | No | Booking type |

**Response:** `200 OK` — Updated class object

Returns a `403` with message `"Session is already booked"` if already enrolled.

### POST `/np/company/{companyUuid}/class/{classUuid}/removeExerciser`

Cancel a class booking.

**Content-Type:** `application/x-www-form-urlencoded`

**Form Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `exerciserUuid` | string | Yes | User's UUID |
| `type` | string | No | Cancellation type |

**Response:** `200 OK` — Updated class object (with `booked: false`)

### POST `/np/company/{companyUuid}/class/{classUuid}/updateBooking`

Update an existing booking (e.g. change spot).

**Form Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `exerciserUuid` | string | Yes | User's UUID |
| `spot` | string | No | New spot number |

### POST `/np/company/{companyUuid}/class/{classUuid}/waitlist/addExerciser`

Add to a class waitlist.

**Form Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `exerciserUuid` | string | Yes | User's UUID |

### POST `/np/company/{companyUuid}/class/{classUuid}/waitlist/removeExerciser`

Remove from a class waitlist.

**Form Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `exerciserUuid` | string | Yes | User's UUID |

---

## Allowed Options

### GET `/np/company/{companyUuid}/allowedOptions`

Get what operations are allowed for a specific club.

**Response:**

```json
{
  "singleClassAccessAllowed": true,
  "addToClassAllowed": true,
  "removeFromClassAllowed": true,
  "addToWaitlistAllowed": true,
  "removeFromWaitlistAllowed": true,
  "accountBalanceItemsRetrievalAllowed": true,
  "filterMyClassesAllowed": true
}
```

### GET `/np/allowedOptions`

Get brand-level allowed options (same response shape).

---

## Gym Busyness / Capacity

### GET `/np/thegymgroup/v1.0/exerciser/{exerciserUuid}/gym-busyness`

Get current gym busyness.

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `gymLocationId` | string | Yes | Gym location UUID |

**Response:**

```json
{
  "gymLocationId": "1bdeaf9b-37b1-42ee-9a6c-b8d82b86b7ad",
  "gymLocationName": "London Acton",
  "currentCapacity": 42,
  "currentPercentage": 15,
  "status": "OPEN",
  "historical": [...]
}
```

### GET `/np/thegymgroup/v1.0/locations/{locationUuid}/historical-busyness`

Get historical busyness patterns.

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `dayOfWeek` | string | Yes | Day to query |

---

## Check-in History

### GET `/np/exercisers/{exerciserUuid}/check-ins/history`

Get check-in history.

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `startDate` | string | Yes | ISO format `YYYY-MM-DDTHH:MM:SS` |
| `endDate` | string | Yes | ISO format `YYYY-MM-DDTHH:MM:SS` |

**Response:**

```json
{
  "checkIns": [
    {
      "checkInDate": "2025-01-15T10:30:00",
      "timezone": "Europe/London",
      "gymLocationName": "London Acton",
      "gymLocationAddress": "...",
      "duration": 3600000
    }
  ]
}
```

**Notes:**
- `duration` is in milliseconds
- `checkInDate` is in local time (no timezone offset in the string)
- Response is not sorted — client must sort

### GET `/np/exercisers/{exerciserUuid}/latest-check-in`

Get the most recent check-in.

### GET `/np/exercisers/{exerciserUuid}/check-ins/recurring-reports`

Get recurring check-in report subscriptions.

### POST `/np/exercisers/{exerciserUuid}/check-ins/report`

Request a check-in report.

### DELETE `/np/exercisers/{exerciserUuid}/check-ins/recurring-reports/{reportUuid}`

Delete a recurring report subscription.

---

## User Profile

### GET `/np/exerciser/{exerciserUuid}`

Get user profile.

### PUT `/np/exerciser/{exerciserUuid}`

Update user profile.

### POST `/np/exerciser/{exerciserUuid}/avatar`

Upload user avatar (multipart image upload).

### DELETE `/np/exerciser/{exerciserUuid}/avatar`

Remove user avatar.

### POST `/np/exerciser/changePassword`

Change password.

**Form Parameters:** `email`, `oldPassword`, `newPassword`, `confirmPassword`

### POST `/np/exerciser/password-reset`

Reset password.

**Form Parameters:** `email`, `token`, `secret` (optional)

### GET `/np/exerciser/forgot-passcode`

Request passcode reset.

**Query Parameters:** `login` (username/email)

### GET `/np/exerciser/validate`

Validate XID or email.

**Query Parameters:** `xid` or `email`

---

## Membership & Barcode

### GET `/np/exerciser/{exerciserUuid}/membership`

Get membership information.

### POST `/np/exerciser/{exerciserUuid}/membership`

Send barcode for membership lookup.

**Form Parameters:** `barcode`

### POST `/np/exerciser/{exerciserUuid}/membership/activate`

Activate membership.

**Form Parameters:** `barcode` or `agreement`

### GET `/np/exerciser/{exerciserUuid}/membership-barcode`

Get membership barcode.

### GET `/np/exercisers/{exerciserUuid}/google/pay/barcode`

Get Google Pay JWT barcode.

**Query Parameters:** `appVersion`, `backgroundColor`

---

## Account Balance & Purchases

### GET `/np/exerciser/{exerciserUuid}/account/balance`

Get account balance.

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `clubUuid` | string | Club UUID |
| `itemType` | string | e.g. `"class"` |

### GET `/np/company/{companyUuid}/class/purchase/bundles`

Get available purchase bundles for a club.

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `type` | string | `"Session"` |
| `name` | string | Bundle name filter |

### POST `/np/exerciser/{exerciserUuid}/class/purchase/bundle`

Purchase a class bundle.

**Form Parameters:** `type`, `clubUuid`, `id`, `type`, `price`, `taxRate`, `quantity`

### GET `/np/exerciser/{exerciserUuid}/payer`

Get payment information.

---

## Schedule & Find a Class

### GET `/np/schedule/forClub/{clubUuid}`

Get the weekly class schedule template for a club.

### GET `/np/purchases/forClub/{clubUuid}`

Get purchase types available for a club's schedule.

---

## Notifications

### GET `/np/exerciser/{exerciserUuid}/notifications`

Get notifications list.

**Query Parameters:** `startingFrom`

### POST `/np/exerciser/{exerciserUuid}/notification`

Register FCM push token.

**Form Parameters:** `token`, `deviceUid`, `provider`, `providerId`, `version`

---

## Challenges

### GET `/np/exerciser/{exerciserUuid}/challenges/active`

Get active challenges.

### GET `/np/exerciser/{exerciserUuid}/challenges/past-participated`

Get past challenges.

### GET `/np/exerciser/{exerciserUuid}/challenge/{challengeId}`

Get challenge details.

### POST `/np/exerciser/{exerciserUuid}/challenge/{challengeId}?command=join`

Join a challenge.

**Form Parameters:** `timeZone`

### POST `/np/exerciser/{exerciserUuid}/challenge/{challengeId}?command=leave`

Leave a challenge.

### GET `/np/exerciser/{exerciserUuid}/challenge/{challengeId}/progress-history`

Get challenge progress.

**Query Parameters:** `timezone`

### GET `/np/exerciser/{exerciserUuid}/challenge/{challengeId}/participants`

Get challenge participants.

**Query Parameters:** `pageSize`, `start`

### GET `/np/challenge/{challengeId}/prize`

Get challenge prize info.

### GET `/np/challenge/{challengeId}/prize/image`

Get challenge prize image.

---

## Activity Levels & Ranking

Base path: `/analysis/api/v1.0`

### GET `/analysis/api/v1.0/exercisers/{exerciserUuid}/activitylevels/definitions`

Get activity level definitions.

**Query Parameters:** `languageCode`

### GET `/analysis/api/v1.0/exercisers/{exerciserUuid}/activitylevels`

Get user's current activity level.

### GET `/analysis/api/v1.0/exercisers/{exerciserUuid}/ranking`

Get user's ranking.

**Query Parameters:** `languageCode`, `shift`

### GET `/analysis/api/v1.0/exercisers/{exerciserUuid}/ranking/leaderboard`

Get leaderboard.

**Query Parameters:** `languageCode`, `size`, `nextPageToken`

### GET `/analysis/api/v1.0/exercisers/{exerciserUuid}/rankingwithleaderboard`

Get ranking with leaderboard combined.

**Query Parameters:** `languageCode`, `size`

---

## Feedback & Requests

### POST `/np/exerciser/{exerciserUuid}/app-rating-feedback`

Send app rating feedback.

**Form Parameters:** `message`

### POST `/np/exerciser/{exerciserUuid}/location-feedbacks`

Send club visit feedback.

### POST `/np/exerciser/{exerciserUuid}/request-trainer`

Request a personal trainer.

**Form Parameters:** `type`, `comments`, `phone`, `topic`

### POST `/np/exerciser/{exerciserUuid}/request-fitness-assessment`

Request fitness assessment.

**Form Parameters:** `comments`, `phone`

---

## Referrals & Trial Pass

### GET `/np/exerciser/referral-config`

Get refer-a-friend configuration.

### POST `/np/exerciser/{exerciserUuid}/rewards/refer-a-friend`

Refer a friend (classic).

**Form Parameters:** `email`

### POST `/np/exerciser/{exerciserUuid}/refer-friend`

Refer a friend (extended).

**Form Parameters:** `firstName`, `lastName`, `email`, `phone`

### POST `/np/exerciser/trial-pass`

Request a trial pass.

**Form Parameters:** `firstName`, `lastName`, `homeClub`, `email`, `phone`

---

## The Gym Group Specific

### GET `/np/thegymgroup/v1.0/exercisers/{exerciserUuid}/checklist`

Get TGG check-in checklist.

### GET `/np/thegymgroup/v1.0/exercisers/{exerciserUuid}/preference`

Get check-in question status/preferences.

---

## eGym Integration

### GET `/np/egym/v1.0/users?email={email}`

Get eGym user account by email.

### POST `/np/egym/v1.0/users/{exerciserUuid}/register`

Register with eGym.

### GET `/np/egym/v1.0/users/{exerciserUuid}/linking-status`

Get eGym linking status.

### POST `/np/egym/v1.0/users/{exerciserUuid}/link`

Link to eGym.

### POST `/np/egym/v1.0/users/{exerciserUuid}/unlink`

Unlink from eGym.

### POST `/np/egym/v1.0/users/{exerciserUuid}/accept-tac`

Accept eGym terms and conditions.

### GET/POST `/np/egym/v1.0/users/{exerciserUuid}/opt-ins`

Get or set eGym opt-in preferences.

### POST `/np/egym/v1.0/users/{exerciserUuid}/set-password`

Set eGym password.

### POST `/np/egym/v1.0/users/reset-password`

Reset eGym password.

**Form Parameters:** `email`

---

## Workouts & Connected Apps

### GET `/np/workouts/v2.1/exercisers/{exerciserUuid}/external-workouts/connected-apps`

Get connected external workout apps.

---

## Extra Barcodes

### GET `/np/manual-barcodes/v1.0/exercisers/{exerciserUuid}/barcodes`

List extra/manual barcodes.

### POST `/np/manual-barcodes/v1.0/exercisers/{exerciserUuid}/barcodes`

Save a new barcode.

### PUT `/np/manual-barcodes/v1.0/exercisers/{exerciserUuid}/barcodes/{barcodeId}`

Edit a barcode.

### DELETE `/np/manual-barcodes/v1.0/exercisers/{exerciserUuid}/barcodes/{barcodeId}`

Delete a barcode.

---

## Branding & Config

### GET `/np/nfa/config`

Get branding configuration.

**Query Parameters:** `brandId`, `resourceType`

### GET `/np/nfa/resolveContainer`

Resolve container/brand.

**Query Parameters:** `keyword`, `containerAppVersion`

---

## Verification

### GET `/np/exercisers-verification/v1.0/exercisers/{exerciserUuid}/verification-tan`

Get verification TAN.

---

## Partner Portal

### GET `/np/exerciser/{exerciserUuid}/externalAccount/matrixPortal/token`

Get partner portal token.

**Query Parameters:** `club_uuid`

---

## Notes

- All timestamps are epoch **milliseconds** (not seconds)
- Auth is via `JSESSIONID` cookie set during login
- POST endpoints for booking/cancel use `application/x-www-form-urlencoded`, not JSON
- The API is powered by NetPulse/egym and is used by many gym brands — only the base URL differs
- Path parameters use `%s` format substitution in the source (e.g. `/np/company/%s/class/%s/addExerciser`)
- Note the inconsistency: some paths use `/exerciser/` (singular) and others use `/exercisers/` (plural)
- The `brief` wrapper in class responses contains the core class data; `details` and `attendeeDetails` may be null in list responses
- Source: Decompiled from APK version with `galaxy_TheGymGroupRelease` build variant

