import React, { useEffect, useState } from 'react'
import CardItem from './CardItem'
import Settings from "./Settings"
import axios from "axios"

function App() {
    const [settings, setSettings] = useState(false)
    const [cities, setCities] = useState([])
    const [location, setLocation] = useState({ latitude: 0, longitude: 0 })

    useEffect(() => {
        setCities([])
        const storage = localStorage.getItem("cities")
        if (!storage && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(setPosition, error)
            return
        }
        const array = JSON.parse(storage)

        getSortedList()
        async function getSortedList() {
            for (const arrayElement of array) {
                await fetchWeather(arrayElement)
            }
            [...cities].sort((a, b) => {
                return b.position - a.position
            });
        }
    }, [settings])

    useEffect(() => {
        if (location.latitude && location.longitude) fetchLocationWeather()
    }, [location])

    async function fetchWeather(element) {
        const response = await axios.get(element.link)
        response.position = element.position
        setCities(cities => [...cities, response.data])
    }

    async function fetchLocationWeather() {
        const response = await axios.get(`${process.env.API_ENDPOINT}lat=${ location.latitude }&lon=${ location.longitude }&units=metric&appid=${process.env.API_KEY}`)
        setCities([...cities, response.data])
    }

    function setPosition(position) {
        setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        })
    }

    function error(err) {
        alert(`ERROR(${err.code}): ${err.message}`);
    }

    if (settings) {
        return <Settings setSettings={ setSettings }/>;
    }

    return cities.map((city, index) => {
        return <CardItem index={index} setSettings={ setSettings } city={ city } key={ city.id }/>
    })
}

export default App
