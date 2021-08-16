# react-weather-widget

It contains 2 folders:  

1) `react-app` - an isolated stand-alone widget.
2) `weather-widget` - a build of weather widget, ready to deploy and integration. 

## running the projects 

### `react-app`

```bash
cd react-app
npm install
npm start
```

## build
```bash
npm run build
```

## adding widget on to website
1) Load the Roboto font from a CDN via Google Web Fonts.
2) Add css styles.
```bash
<head>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
    <link rel="stylesheet" href="weather-widget/static/css/weather-widget.css">
</head>
```
3) Insert `<weather-widget />` tag on your page.
4) Add script on your page.
```bash
<body>
    <weather-widget />
    <script src="weather-widget/static/js/weather-widget.js"></script>
</body>
```

