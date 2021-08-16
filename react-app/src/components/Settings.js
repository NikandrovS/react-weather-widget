import React, { useState, useRef, useEffect } from "react"
import { withStyles } from '@material-ui/core/styles'
import { Card, Grid, IconButton, Typography, TextField } from "@material-ui/core"
import { Close, SubdirectoryArrowLeft, Menu, DeleteOutlineOutlined } from "@material-ui/icons"
import axios from "axios"

const CssTextField = withStyles({
    root: {
        width: '100%',
        '& label.Mui-focused': {
            color: 'black',
        },
        '& .MuiOutlinedInput-root': {
            '&.Mui-focused fieldset': {
                borderColor: 'black',
            },
        },
    },
})(TextField)

export default function Settings({ setSettings }) {
    const [error, setError] = useState(false)
    const [storageCities, setStorageCities] = useState([])
    const [currentCard, setCurrentCard] = useState(null)
    const inputRef = useRef('')

    useEffect(() => {
        const stringifiedStorage = localStorage.getItem("cities")
        if (stringifiedStorage) {
            const storage = JSON.parse(stringifiedStorage)
            setStorageCities(storage)
        }
    }, [])

    async function fetchLocation() {
        const location = inputRef.current.value.trim()
        location.replaceAll(" ", "+")
        if (!location.length) return

        const response = await axios.get(`${ process.env.API_ENDPOINT }q=${ location }&units=metric&appid=${ process.env.API_KEY }`)
            .catch(() => {
                setError(true)
                setTimeout(() => {
                    setError(false)
                }, 2000)
            })

        if (response && response.status === 200) {
            inputRef.current.value = ""
            appendResponse(response)
        }
    }

    function appendResponse(response) {
        let obj = {
            link: response.config.url,
            id: response.data.id,
            name: response.data.name,
            country: response.data.sys.country,
        }

        const stringifiedStorage = localStorage.getItem("cities")
        let storage = []
        if (!stringifiedStorage) {
            obj.position = 0
        } else {
            storage = JSON.parse(stringifiedStorage)
            obj.position = storage.length
        }
        storage.push(obj)
        updateStorage(storage)
    }

    function removeItem(id) {
        let storage = JSON.parse(localStorage.getItem("cities"))
        storage = storage.filter(city => city.id !== id)
        recountPositions(storage)
        updateStorage(storage)
    }

    function recountPositions(storage) {
        for (let i = 0; i < storage.length; i++) {
            if (storage[i].position !== i) storage[i].position = i
        }
    }

    function updateStorage(storage) {
        if (!storage.length) {
            localStorage.removeItem("cities")
        } else {
            localStorage.setItem("cities", JSON.stringify(storage))
        }
        setStorageCities(storage)
    }

    function dragStartHandler(e, city) {
        setCurrentCard(city)
    }

    function dragEndHandler(e) {
        if (e.target.closest('#sortable')) {
            e.target.closest('#sortable').style.background = '#f0f0f0'
        }
    }

    function dragOverHandler(e) {
        e.preventDefault()
        if (e.target.closest('#sortable')) {
            e.target.closest('#sortable').style.background = '#e3e3e3'
        }
    }

    function dropHandler(e, city) {
        e.preventDefault()
        if (currentCard.position !== city.position) {
            let storage = JSON.parse(localStorage.getItem("cities"))
            storage = storage.filter(city => city.id !== currentCard.id)
            currentCard.position = city.position - 1
            storage.push(currentCard)
            storage = storage.sort((a, b) => {
                return a.position - b.position
            })

            recountPositions(storage)
            updateStorage(storage)
        }

        if (e.target.closest('#sortable')) {
            e.target.closest('#sortable').style.background = '#f0f0f0'
        }
    }

    return (
        <Card className="card">
            <Grid container alignItems="center" spacing={ 2 }>
                <Grid container item xs={ 12 } alignItems="center">
                    <Grid container item xs={ 10 }>
                        <Typography variant="h6">
                            Settings
                        </Typography>
                    </Grid>
                    <Grid container item xs={ 2 } justifyContent="flex-end">
                        <IconButton aria-label="close" onClick={ () => setSettings(false) }>
                            <Close/>
                        </IconButton>
                    </Grid>
                </Grid>
                <Grid container item xs={ 12 } id="wrapper">
                    {
                        storageCities.map(city => {
                            return (
                                <Grid container item xs={ 12 } alignItems="center" key={ city.id }
                                      className="sortable"
                                      id="sortable"
                                      draggable={ true }
                                      onDragStart={ (e) => dragStartHandler(e, city) }
                                      onDragLeave={ (e) => dragEndHandler(e) }
                                      onDragEnd={ (e) => dragEndHandler(e) }
                                      onDragOver={ (e) => dragOverHandler(e) }
                                      onDrop={ (e) => dropHandler(e, city) }
                                >
                                    <Grid container item xs={ 2 }>
                                        <IconButton aria-label="mover" style={ { cursor: "grab" } }>
                                            <Menu/>
                                        </IconButton>
                                    </Grid>
                                    <Grid container item xs={ 8 }>
                                        <Typography variant="subtitle2">
                                            { city.name }, { city.country }
                                        </Typography>
                                    </Grid>
                                    <Grid container item xs={ 2 } justifyContent="flex-end">
                                        <IconButton aria-label="remover" onClick={ () => removeItem(city.id) }>
                                            <DeleteOutlineOutlined/>
                                        </IconButton>
                                    </Grid>
                                </Grid>
                            )
                        })
                    }
                </Grid>
                <Grid container item xs={ 12 } alignItems="center">
                    <Grid container item xs={ 12 }>
                        <Typography variant="subtitle1" style={ { marginBottom: "5px" } }>
                            Add location
                        </Typography>
                    </Grid>
                    <Grid container item xs={ 10 }>
                        <CssTextField
                            id="city"
                            label="Location"
                            variant="outlined"
                            size="small"
                            inputRef={ inputRef }
                        />
                    </Grid>
                    <Grid container item xs={ 2 } justifyContent="flex-end">
                        <IconButton aria-label="close" onClick={ fetchLocation }>
                            <SubdirectoryArrowLeft/>
                        </IconButton>
                    </Grid>
                    { error &&
                    <Grid container item xs={ 12 }>
                        <Typography variant="body2" style={ { marginTop: "5px" } }>
                            Location does not exists
                        </Typography>
                    </Grid>
                    }
                </Grid>
            </Grid>
        </Card>
    )
}