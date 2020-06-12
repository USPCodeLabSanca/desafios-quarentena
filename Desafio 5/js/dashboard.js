const MAX_TIME = 5000; // 60 seconds 
const MIN_TIME = 10000; // 10 secons

class Dashboard {
    
    
    // This is to allow for the map to set it's difficulty based on the game's time length decrease
    constructor(containerElement, gameOver) {
        this.containerElement = containerElement;   // DOM element 
        this.badHeigth = containerElement.querySelector('#show-time');
        this.gameOver = gameOver;                   // funcion to end game
        this.level = 0;                             // initializion level
        this.gameLeftTime = Date.now() + MAX_TIME;  // time to play before lose
    }

    /**
     * 
     * @param {*} timeLeft 
     */
    timeUpdateView(timeLeft) {
        let timeElement = document.getElementById("show-time");
        timeElement.innerHTML = '<h2>' + Math.ceil(timeLeft/1000) + '</h2>';
        document.getElementById("time-left").style.height =  (100*(timeLeft / MAX_TIME )) + '%';
    }

    /**
     * 
     * @param {*} level 
     */
    levelUpdateView(level) {
        let levelElement = document.getElementById("show-level");
        levelElement.contentText = `${level}`;
    }

    /**
     * 
     */
    static levelUp() {
        
        // Min time to play is 10 seconds, by level player will have 5s less than before. 
        this.gameLeftTime = Date.now() + max(MIN_TIME, MAX_TIME - (5000*level));
        
        this.level += 1;

        // reset display
        levelUpdateView(this.gameLeftTime - Date.now());
        levelUpdateView(this.level);
    }


    /**
     * 
     */
     start() {  
        let pid = setInterval(() => {
            let timeLeft = this.gameLeftTime - Date.now();
            if(timeLeft < 0) {
                this.gameOver();
                clearInterval(pid);
            } else {
                this.timeUpdateView(timeLeft);
            }
        }, 0);

        return pid;
    }
}