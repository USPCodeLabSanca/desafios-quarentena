const MAX_TIME = 50000; // 60 seconds 
const MIN_TIME = 15000; // 10 secons

class Dashboard {
    
    static candyMachted = []; // every candy which explode will be saved here.

    // This is to allow for the map to set it's difficulty based on the game's time length decrease
    constructor(containerElement, gameOver) {
        this.containerElement = containerElement;   // DOM element 
        this.badHeigth = containerElement.querySelector('#show-time');
        this.gameOver = gameOver;                   // funcion to end game
        this.level = 0;                             // initializion level 0
        this.score = 0;                             // initializion score 0
        this.gameLeftTime = Date.now() + MAX_TIME;  // time to play before lose
    }

    /**
     * 
     * @param { number } timeLeft time in milleseconds to player loose the game 
     */
    timeUpdateView(timeLeft) {
        let timeElement = document.getElementById("show-time");
        timeElement.innerHTML = '<h2>' + Math.ceil(timeLeft/1000) + '</h2>';
        document.getElementById("time-left").style.height =  (100*(timeLeft / MAX_TIME )) + '%';
    }

    /**
     * 
     *  score of the  player will e update in display 
     */
    scoreUpdateView() {
        let levelElement = document.getElementById("show-pontos");
        levelElement.innerHTML = '<h2>' + this.score + '</h2>';
    }

    /**
     *  level of the  player will e update in display 
     */
    levelUpdateView() {
        let levelElement = document.getElementById("show-level");
        levelElement.innerHTML = '<h2>' + this.level + '</h2>';
    }

    /**
     * Check if the player can pass level
     * Each level need 200 points to be passed (100 blocks destroyed)
     * Or each level, the player has 5 seconds less than before and it will be not less than 15 seconds. 
     * 
     */
    levelUp() {
        
        if(this.score > (200*(this.level+1))) {
            // Try unlock a new type of candy
            Candy.unlockCandy();
            
            // Min time to play is 10 seconds, by level player will have 5s less than before. 
            this.gameLeftTime = Date.now() + Math.max(MIN_TIME, MAX_TIME - (5000*this.level));
            
            this.level += 1;    
    
            // reset display
            this.timeUpdateView(this.gameLeftTime - Date.now());
            this.levelUpdateView();
        }
    }

    /**
     *  This check if a candy exploid, for each, the score increase
     */ 
    updateScore() {
        if(Dashboard.candyMachted.length) {
            this.score += 1;
            this.levelUp();
            this.scoreUpdateView();
            Dashboard.candyMachted.pop();
        }
    } 

    /**
     * This fnction keep updating the dahboard on game.
     * This includes the timer, the bar timer, the score, the level and check if the game is over.
     */
     start() {  
        let pid = setInterval(() => {
            let timeLeft = this.gameLeftTime - Date.now();

            // Run of time, game over 
            if(timeLeft < 0) {
                this.timeUpdateView(0);
                this.gameOver();
            } else {
                this.updateScore();
                this.timeUpdateView(timeLeft);
            }
        }, 0);

        // If the pid, the process can be closed with clearIntervel(pid)
        return pid;
    }
}