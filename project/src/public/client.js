let store = {
    user: { name: "Explorer" },
    apod: '',
    rovers: ['Curiosity', 'Opportunity', 'Spirit'],
}

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
                    <button class="roverBtn">${store.rovers[0]}</button>
                    <button class="roverBtn">${store.rovers[1]}</button>
                    <button class="roverBtn">${store.rovers[2]}</button>
                </div>
                ${ImageOfTheDay(apod)}
            </section>
        </main>
        <footer></footer>
    `
}

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
    render(root, store)
})

// ------------------------------------------------------  COMPONENTS

// Pure function that renders conditional information -- THIS IS JUST AN EXAMPLE, you can delete it.
const Greeting = (name) => {
    if (name) {
        return `
            <h1>Welcome, ${name}!</h1>
        `
    }

    return `
        <h1>Hello!</h1>
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
            <p>See today's featured video <a href="${apod.url}">here</a></p>
            <p>${apod.title}</p>
            <p>${apod.explanation}</p>
        `)
    } else {
        let images = ``
        for (let i = 0; i<apod?.image?.photos.length; i++) {
            images += `
            <img src="${apod?.image?.photos[i].img_src}"/>
            <p>${apod?.image?.explanation}</p>
        `
        }
        return (images)
    }
}

// ------------------------------------------------------  API CALLS

// Example API call
const getImageOfTheDay = (state) => {
    let { apod } = state
    const rover = "curiosity"

    fetch(`http://localhost:3000/apod?rover=` + rover)
        .then(res => res.json())
        .then(apod => updateStore(store, { apod }))
        .then(apod=>console.log(apod))
}
