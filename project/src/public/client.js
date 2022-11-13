//Final version

let store = {
    user: { name: "Explorer" },
    apod: '',
    rovers: ['Curiosity', 'Opportunity', 'Spirit'],
}

let choosedRover = ["spirit"]

// add our markup to the page
const root = document.getElementById('root')

const updateStore = (store, newState) => {
    store = Object.assign(store, newState)
    render(root, store)
}

const render = async (root, state) => {
    root.innerHTML = App(state)
}


// create content
const App = (state) => {
    let { rovers, apod } = state

    return `
        
        <main>
            <header>${Greeting(store.user.name)}</header>
            <section>
                <p id="choose">Choose a rover</p>
                <div class="buttons">
                    <button class="roverBtn" onclick="btnClick('${store.rovers[0]}')">${store.rovers[0]}</button>
                    <button class="roverBtn"  onclick="btnClick('${store.rovers[1]}')">${store.rovers[1]}</button>
                    <button class="roverBtn"  onclick="btnClick('${store.rovers[2]}')">${store.rovers[2]}</button>
                </div>
                ${ImageOfTheDay(apod)}
            </section>
        </main>
        <footer></footer>
    `
}

function btnClick(rover){
    getImageOfTheDay(rover)
}

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
    render(root, store)
})

// ------------------------------------------------------  COMPONENTS

// First high order function
const Greeting = (name) => {
    name = "Dear " + name
    return sayHi(name)
}

const sayHi = function(name) {
    if (name) {
        return `
            <h1>Hi, ${name}!</h1>
            <h3 style="color:white">Have fun exploring the Universe...</h3>
        `
    }

    return `
        <h1>Great to see you here!</h1>
    `
}

// Example of a pure function that renders infomation requested from the backend
const ImageOfTheDay = (apod) => {

    // If image does not already exist, or it is not from today -- request it again
    const today = new Date()
    const photodate = new Date(apod.date)
    console.log(photodate.getDate(), today.getDate());

    console.log(photodate.getDate() === today.getDate());
    if (!apod || apod.date === today.getDate() ) {
        getImageOfTheDay(store)
    }

    // check if the photo of the day is actually type video!
    if (apod.media_type === "video") {
        return (`
            <p>Sorry we do not support videos</p>
            
        `)
    }
    else {   
        if (typeof(apod?.image?.photos) == "undefined") {
            return ""
        } else {
        return getArray(myFunc, apod?.image?.photos, 3)()
    }
}
}

function myFunc(result, photo) {
    return result += 
    `<img src="${photo.img_src}"/>
    <p>ID: ${photo.id}</p>
    <p>Date: ${photo.earth_date}</p>
    <p>Rover: ${photo.rover.name}</p>`
}

//Second High order function
let getArray = function(funcArg, source, number) {
    let newArray = []
    for (let i =0; i<= number; i++) {
        newArray.push(source[i])
    }
    return function() {
        return newArray.reduce(funcArg)
    }
}


// ------------------------------------------------------  API CALLS

// Example API call
const getImageOfTheDay = (state) => {
    let { apod } = state
    let rover = state
    fetch(`http://localhost:3000/apod?rover=` + rover)
        .then(res => res.json())
        .then(apod => updateStore(store, { apod }))
        .then(apod=>console.log(apod))
}
