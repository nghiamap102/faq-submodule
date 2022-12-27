# Database Setup

Create database with name: `tenantadmindb`

## Collections

### `environment`
```json
{
    "_id" : ObjectId("60813369ce70836c23a939e4"),
    "home" : "/ffms",
    "theme" : "DarkTheme",
    "product" : "ffms",
    "description" : "Field Force, Schedule, Tracking, Delivery",
    "manifest" : {
        "themeColor" : "#384552",
        "appName" : "Skedulomatic",
        "appleStatusbarStyle" : "",
        "background" : "#ffffff",
        "appleStatusbarStyle" : "black"
    },
    "mapStyleList" : [ 
        {
            "id" : "light",
            "label" : "Tiêu chuẩn"
        }, 
        {
            "id" : "dark",
            "label" : "Màu Tối"
        }, 
        {
            "id" : "terrain",
            "label" : "Địa hình"
        }, 
        {
            "id" : "boundary",
            "label" : "Ranh giới"
        }
    ],
    "themeList" : [ 
        {
            "name" : "DarkTheme",
            "base" : "dark",
            "className" : "theme-gray"
        }, 
        {
            "name" : "LightTheme",
            "base" : "light",
            "className" : "theme-red"
        }
    ],
    "language" : "en",
    "locale" : "en-in",
    "favicon" : "/ffms.ico",
    "logo" : "/ffms.png",
    "domain" : "localhost:3000",
    "place" : {
        "vietbando" : {
            "url" : "http://10.222.6.13:8987/solr",
            "provider" : "Vietbando",
            "user" : "solr",
            "pass" : "Vbd@2020"
        },
        "here" : {
            "apiKey" : "qeyw5ZCG92xjAkMv0uf34YpGsg0mxN-6Jt0saX9CE9I",
            "provider" : "Here"
        },
        "google" : {}
    },
    "street" : {
        "barrier" : "http://10.222.6.13:8008",
        "viaroute" : "http://10.222.6.13:8008",
        "flagpole" : "http://10.222.6.13:8008",
        "match" : "http://10.222.6.13:8008"
    },
    "vdms" : {
        "authUrl" : "https://accounts.sovereignsolutions.com",
        "url" : "https://dev.sovereignsolutions.com/ffms-backend-dev",
        "redirect" : false
    },
    "mapnik" : {
        "url" : "https://render.sovereignsolutions.com"
    },
    "ffms" : {
        "url" : "http://localhost:3002"
    },
    "emailConfig" : {
        "default" : "awsPinpoint",
        "awsPinpoint" : {
            "systemEmail" : "phamminhman@vietbando.vn",
            "appId" : "ff25bde2f4bb43039a8ae6fbf5920392",
            "accessKeyId" : "AKIATLJXHSMP7ZRURHEA",
            "secretAccessKey" : "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",
            "region" : "ap-southeast-1"
        }
    },
    "c4i2" : {},
    "tracking" : {},
    "matterMost" : {
        "url" : ""
    },
    "rabbitMQ" : {
        "host" : ""
    },
    "t4Queue" : {
        "host" : ""
    },
    "lprQueue" : {
        "host" : ""
    },
    "clickhouse" : {
        "spacerain" : {
            "host" : ""
        },
        "fs" : {
            "host" : ""
        }
    }
}
```

## `tenant`

```json
{
    "_id" : ObjectId("6109f515495a54050ae7cd5f"),
    "name" : "dev",
    "domain" : "localhost:3000",
    "sysId" : "YWNMZW",
    "createdDate" : ISODate("2021-06-01T06:32:33.274+07:00"),
    "modifiedDate" : ISODate("2021-06-01T06:32:33.269+07:00"),
    "createdBy" : "vietbando.2",
    "modifiedBy" : "vietbando.2",
    "application" : {
        "title" : "Dev Server",
        "subtitle" : ""
    },
    "environment" : {},
    "status" : 5,
    "id" : ObjectId("6109f515495a54050ae7cd5f")
}
```

# Development

## t4ch-ui

To install and work locally:
```
git clone https://git.vietbando.net/t4ch/t4ch-ui.git

# Checkout ffms dev branch
cd t4ch-ui
git checkout ffms/dev

# Install the dependencies and build the backend (port 3001)
cd backend
npm install
npm run ffms-dev

# Install the dependencies and build the frontend (port 3000)
cd t4ch-ui/frontend
npm install
npm start
```

## ffms-backend

Handle business logic of Skedulomatic

```
git clone https://git.vietbando.net/sovereignsolution/ffms/ffms-backend.git

# Checkout dev branch
cd ffms-backend
git checkout dev

# Install the dependencies
npm install

# Rebuild source code immediately in watch mode when changing the source code (port 3002)
npm run dev
```