const maxCapacityError = 'Exceeded max capacity'
const screenExistsError = 'Screen already exists'

class Screen {
    constructor(screenName, capacity) {
      this.screenName = screenName
      this.capacity = capacity
      this.showings = []
    }
}

module.exports = Screen