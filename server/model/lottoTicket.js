class LottoTicket {
    constructor(numbers, expiry) {
        this._numbers = numbers;
        this._expiry = expiry;

        this._mainNumbers = numbers.splice(0, 5);
        this._luckyStars = numbers;
    }

    get mainNumbers() {
        return this._mainNumbers;
    }

    get luckyStars() {
        return this._luckyStars;
    }

    /* Checks if ticket has been pulled yet
     * @returns {Boolean} true if ticket has been pulled
     */
    shouldCheckTicket() {
        const currentTime = new Date();
        return this._expiry.getTime() <= currentTime.getTime();
    }

    /*
     * Originally written with nested switch statements
     * but after discussing on StackOverflow this is a much cleaner function
     * https://stackoverflow.com/questions/71713839/cleaner-way-to-calculate-lottery-winnings
     * 
     * @param {Array} winningMainNumbers the winning main numbers
     * @param {Array} winningLuckyStars the winning lucky stars
     * @returns will either return the total winnings or 'JACKPOT' for the max prize
     */ 
    calculateWinnings(winningMainNumbers, winningLuckyStars) {
        const intersectLength = (arr1, arr2) => arr1.reduce((a, b) => a + arr2.includes(b), 0);

        const matchingMainNumbers = intersectLength(winningMainNumbers, this._mainNumbers);
        const matchingLuckyStars = intersectLength(winningLuckyStars, this._luckyStars);
        const winningsByMatchingMainAndLucky = {
            0: [0, 0, 0],
            1: [0, 0, 4.3],
            2: [2.5, 3.6, 9.1],
            3: [6, 7.3, 37.3],
            4: [25.6, 77.8, 844.7],
            5: [13561.2, 130554.3, 'JACKPOT']
        };
        this.totalWinningMainNumbers = matchingMainNumbers;
        this.totalWinningLuckyStars = matchingLuckyStars;
        return winningsByMatchingMainAndLucky[matchingMainNumbers][matchingLuckyStars];
    }
}

module.exports.LottoTicket = LottoTicket;