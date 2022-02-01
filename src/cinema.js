const Movie = require('./movie.js')
const Screen = require('./screen.js')
const screenExistsError = 'Screen already exists'
const maxCapacityError = 'Exceeded max capacity'
const movieExistsError = 'Movie already exists'
const invalidRatingError = "Invalid rating"
const ratingsArray = ["U", "PG", 12, 15, 18]

class Cinema {

  constructor() {
    this.movies = []
    this.screens = []
    this.maxCapacity = 100
  }
  
  addNewScreen(screenName, capacity) {
    for (const screen of this.screens) {
      if (screen.screenName === screenName) {
        return screenExistsError
      } else if (capacity > this.capacity) {
        return maxCapacityError
      }
    }
    return this.screens.push(new Screen(screenName, capacity))
  }

  addNewMovie(movieTitle, ageRating, duration) {
    for (const movie of this.movies) {
      if (movie.title === movieTitle || movie.title !== null) {
        return movieExistsError
      } else if (movie.ageRating !== ) {
        return invalidRatingError
      }
    }
    return this.movies.push(new Movie(movieTitle, ageRating, duration))
  }


  //Add a new film
  // addNewMovie(movieName, rating, duration) {

  //   //Check the film doesn't already exist
  //   let movie = null
  //   // use for of loop
  //   for (let i=0;i<this.movies.length;i++) {
  //     if (this.movies[i].name===movieName) {
  //       movie = this.movies[i]
  //     }
  //   }

  //   // Not sure about the logic
  //   if(movie!==null) {
  //     return 'Film already exists'
  //   }

  //   //Check the rating is valid
  //   if (rating!=="U" && rating!=="PG") {
  //     if (rating!=="12" && rating!=="15" && rating!=="18") {
  //       return 'Invalid rating'
  //     }
  //   }
    
  //   //Check duration
  //   // not sure about this, what does it do?
  //   const result = /^(\d?\d):(\d\d)$/.exec(duration)
  //   if(result===null) {
  //     return 'Invalid duration'
  //   }

  //   const hours = parseInt(result[1])
  //   const mins = parseInt(result[2])
  //   if(hours<=0 || mins>60) {
  //     return 'Invalid duration'
  //   }

  //   this.movies.push({name:movieName, rating:rating, duration: duration})
  // }

  //Add a showing for a specific film to a screen at the provided start time
  addNewShowing(movie, screenName, startTime) {

    let result = /^(\d?\d):(\d\d)$/.exec(startTime)
    if(result===null) {
      return 'Invalid start time'
    }

    const intendedStartTimeHours = parseInt(result[1])
    const intendedStartTimeMinutes = parseInt(result[2])
    if(intendedStartTimeHours<=0 || intendedStartTimeMinutes>60) {
      return 'Invalid start time'
    }


    let film = null
    //Find the film by name
    for (let i=0;i<this.movies.length;i++) {
      if (this.movies[i].name===movie) {
        film = this.movies[i]
      }
    }

    if(film===null) {
      return 'Invalid film'
    }

    //From duration, work out intended end time
    //if end time is over midnight, it's an error
    //Check duration
    result = /^(\d?\d):(\d\d)$/.exec(film.duration)
    if(result===null) {
      return 'Invalid duration'
    }

    const durationHours = parseInt(result[1])
    const durationMins = parseInt(result[2])
    const screenCleaningTime = 20
    //Add the running time to the duration
    let intendedEndTimeHours = intendedStartTimeHours + durationHours
    
    //It takes 20 minutes to clean the screen so add on 20 minutes to the duration 
    //when working out the end time
    let intendedEndTimeMinutes = intendedStartTimeMinutes + durationMins + screenCleaningTime
    if (intendedEndTimeMinutes>=60) {
      intendedEndTimeHours += Math.floor(intendedEndTimeMinutes/60)
      intendedEndTimeMinutes = intendedEndTimeMinutes%60
    }

    if(intendedEndTimeHours>=24) {
      return 'Invalid start time - film ends after midnight'
    }

    //Find the screen by name
    let theatre = null
    for (let i=0;i<this.screens.length;i++) {
      if (this.screens[i].name===screenName) {
        theatre = this.screens[i]
      }
    }

    if(theatre===null) {
      return 'Invalid screen'
    }
    
    //Go through all existing showings for this film and make
    //sure the start time does not overlap 
    let error = false
    for(let i=0;i<theatre.showings.length;i++) {

      //Get the start time in hours and minutes
      const startTime = theatre.showings[i].startTime
      result = /^(\d?\d):(\d\d)$/.exec(startTime)
      if(result===null) {
        return 'Invalid start time'
      }
  
      const startTimeHours = parseInt(result[1])
      const startTimeMins = parseInt(result[2])
      if(startTimeHours<=0 || startTimeMins>60) {
        return 'Invalid start time'
      }

      //Get the end time in hours and minutes
      const endTime = theatre.showings[i].endTime
      result = /^(\d?\d):(\d\d)$/.exec(endTime)
      if(result===null) {
        return 'Invalid end time'
      }
  
      const endTimeHours = parseInt(result[1])
      const endTimeMins = parseInt(result[2])
      if(endTimeHours<=0 || endTimeMins>60) {
        return 'Invalid end time'
      }

      //if intended start time is between start and end
      const date1 = new Date()
      date1.setMilliseconds(0)
      date1.setSeconds(0)
      date1.setMinutes(intendedStartTimeMinutes)
      date1.setHours(intendedStartTimeHours)

      const date2 = new Date()
      date2.setMilliseconds(0)
      date2.setSeconds(0)
      date2.setMinutes(intendedEndTimeMinutes)
      date2.setHours(intendedEndTimeHours)

      const date3 = new Date()
      date3.setMilliseconds(0)
      date3.setSeconds(0)
      date3.setMinutes(startTimeMins)
      date3.setHours(startTimeHours)

      const date4 = new Date()
      date4.setMilliseconds(0)
      date4.setSeconds(0)
      date4.setMinutes(endTimeMins)
      date4.setHours(endTimeHours)

      if ((date1 > date3 && date1 < date4) || (date2 > date3 && date2 < date4) || (date1 < date3 && date2 > date4) ) {
        error = true
        break
      }
    }

    if(error) {
      return 'Time unavailable'
    }

    //Add the new start time and end time to the showing
    theatre.showings.push({
      film: film,
      startTime: startTime,
      endTime: intendedEndTimeHours + ":" + intendedEndTimeMinutes
    })
  } 

  getAllShowings() {
    let showings = {}
    for (let i=0;i<this.screens.length;i++) {
      const screen = this.screens[i]
      for(let j=0;j<screen.showings.length;j++) {
        const showing = screen.showings[j]
        if (!showings[showing.film.name]) {
          showings[showing.film.name] = []
        }
        showings[showing.film.name].push( `${screen.name} ${showing.film.name} (${showing.film.rating}) ${showing.startTime} - ${showing.endTime}`)
      }
    }
  
    return showings
  }
}

module.exports = Cinema