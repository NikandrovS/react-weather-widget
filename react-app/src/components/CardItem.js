import React from 'react'
import direction from '../helpers/windDirections'
import { Card, Grid, IconButton, Typography } from "@material-ui/core"
import { ExploreOutlined, Navigation, SettingsOutlined } from "@material-ui/icons"

export default function CardItem({ index, city, setSettings }) {
    return (
        <Card className="card">
            <Grid container alignItems="center" spacing={ 2 }>
                <Grid container item xs={ 12 } alignItems="center">
                    <Grid container item xs={ 10 }>
                        <Typography variant="h6">
                            { city.name }, { city.sys.country }
                        </Typography>
                    </Grid>
                    { index === 0 &&
                    <Grid container item xs={ 2 } justifyContent="flex-end">
                        <IconButton aria-label="settings" onClick={ () => setSettings(true) }>
                            <SettingsOutlined/>
                        </IconButton>
                    </Grid>
                    }
                </Grid>
                <Grid container item xs={ 12 } alignItems="center" justifyContent="center">
                    <img src={ `${ process.env.ICON_ENDPOINT }/wn/${ city.weather[0].icon }@2x.png` } alt="img_icon"/>
                    <Typography variant="h4" style={ { width: "100px" } }>
                        { Math.round(city.main.temp) }&deg;C
                    </Typography>
                </Grid>
                <Grid container item xs={ 12 }>
                    <Typography variant="subtitle1">
                        Feels like { Math.round(city.main.feels_like) }&deg;C.&nbsp;
                        <p className="description">{ city.weather[0].description }.</p>
                    </Typography>
                </Grid>
                <Grid container item xs={ 12 } spacing={ 2 } justifyContent="space-evenly">
                    <Grid container item xs={ 5 }>
                        <Navigation color="action" fontSize="small"
                                    style={ { transform: `rotate(${ (city.wind.deg) - 180 }deg)` } }/>
                        &nbsp;
                        <Typography variant="subtitle2">
                            { city.wind.speed }m/s { direction(city.wind.deg) }
                        </Typography>
                    </Grid>
                    {
                        city.main.grnd_level ?
                            <Grid container item xs={ 5 }>
                                <ExploreOutlined color="action" fontSize="small"/>&nbsp;
                                <Typography variant="subtitle2">
                                    { city.main.grnd_level }hPa
                                </Typography>
                            </Grid> :
                            <Grid container item xs={ 5 }>
                                <Typography variant="subtitle2">
                                    Pressure: { city.main.pressure }
                                </Typography>
                            </Grid>
                    }
                    <Grid container item xs={ 5 }>
                        <Typography variant="subtitle2">
                            Humidity: { city.main.humidity }%
                        </Typography>
                    </Grid>
                    <Grid container item xs={ 5 }>
                        <Typography variant="subtitle2">
                            Clouds: { city.clouds.all }%
                        </Typography>
                    </Grid>
                    <Grid container item xs={ 5 }>
                        <Typography variant="subtitle2">
                            Visibility: { (city.visibility / 1000).toFixed(1) }km
                        </Typography>
                    </Grid>
                    <Grid container item xs={ 5 }/>
                </Grid>
            </Grid>
        </Card>
    )
}
