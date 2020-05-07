class Player {
  constructor(name, type, pharse, hp) {
    this.playerTotalHp = hp;
    this.playerHp = hp;
    this.block = 0;
    this.name = name;
    this.type = type;
    this.pharse = pharse;
  }
}

const player = new Player('Pikachu', 'eletric', 'I ll shock your system!', 274);
const playerHpElement = document.getElementById('player-health');

const opponent = new Player('Squirtle', 'water', 'I ll wash you, watch out!', 300);
const opponentHpElement = document.getElementById('opponent-health');
const opponentTotalHp = 292;
let opponentHp = 292;


const turnText = document.getElementById('text');
let isTurnHappening = false;

const pharse = document.getElementById('pharse');

const playerAttacks = {
  thunderShock: {
    power: 40,
    accuracy: 100,
    name: 'Thunder Shock',
    type: 'electric',
  },
  quickAttack: {
    power: 40,
    accuracy: 100,
    name: 'Quick Attack',
    type: 'normal',
  },
  thunder: {
    power: 110,
    accuracy: 70,
    name: 'Thunder',
    type: 'electric',
  },
  submission: {
    power: 80,
    accuracy: 80,
    name: 'Submission',
    type: 'fighting',
  },
  giveup: {
    power: 292,
    accuracy: 100,
    name: 'Run For Live!',
    type: 'Only For Braves',
  },
}

const opponentAttacks = {
  tackle: {
    power: 40,
    accuracy: 100,
    name: 'Tackle',
    type: 'normal',
  },
  bubble: {
    power: 40,
    accuracy: 100,
    name: 'Bubble',
    type: 'water',
  },
  waterGun: {
    power: 40,
    accuracy: 100,
    name: 'Water Gun',
    type: 'water',
  },
  hydroPump: {
    power: 110,
    accuracy: 80,
    name: 'Hydro Pump',
    type: 'water',
  }
}

function gameOver (winner) {
  // Wait 1000 (Health loss animation)
  setTimeout(() => {
    // Update HTML text with the winner
    turnText.innerText = winner + ' is the winner!';
    // Open alert with the winner
    alert(winner + ' is the winner! Close this alert to play again');
    // Reload the game
    window.location.reload();
  }, 1000);
}

// display text
function displayTalk(text) {
  pharse.style.display = 'inline-block';
  pharse.innerText = text
}

function cleanDisplay() {
  pharse.innerText = ''
  pharse.style.display = null;
}

// Check if attacks misses
function willAttackMiss (accuracy) {
  return Math.floor(Math.random() * 100) > accuracy;
}

// Return random damage
function damageAtack() {
  return Math.floor(Math.random() * 100);
}

// Check if attacks misses
function willAttackBlock2Turns(power, accuracy) {
  // 0 : no block
  // 1 : block opponent
  switch (power) {
    case 'Thunder Shock':
      return Math.floor(Math.random() * 100) > accuracy;
    break;
    default: break;
  }
  
  return 0;
}

function updatePlayerHp(newHP) {
  // Prevents the HP to go lower than 0
  player.playerHp = Math.max(newHP, 0);

  // If player health is equal 0 opponent wins
  if (playerHp === 0) {
    gameOver('Opponent');
  }

  // Update the player hp bar
  const barWidth = (player.playerHp / player.playerTotalHp) * 100;
  playerHpElement.style.width = barWidth + '%';
}

function updateOpponentHp(newHP) {
  // Prevents the HP to go lower than 0
  opponent.playerHp = Math.max(newHP, 0);

  // If oppont health is equal 0 player wins
  if (opponentHp === 0) {
    gameOver('Player');
  }

  // Update the opponents hp bar
  const barWidth = (opponent.playerHp / opponent.playerTotalHp) * 100;
  opponentHpElement.style.width = barWidth + '%';
}

// *************************************************************************************
// Here you need to implement the player attack function that receives the used attack
// return false if attack misses
// otherwise update opponents health and return true
// *************************************************************************************

function playerAttack(attack) {
  // 0: return false if attack misses
  // 1: otherwise update opponents health and return true
  let accuracy = 10;
  
  if(attack.type == 'electric' && opponent.type == 'water') {
      attack.power += damageAtack();
      console.log(player.pharse);
  }

  if((willAttackMiss(accuracy))) {
    let newHP = opponentHp - attack.power;
    updateOpponentHp(newHP)
    return 1;
  }
  return 0;
}

// *************************************************************************************
// Here you need to implement the opponent attack function that receives the used attack
// return false if attack misses
// otherwise update player health and return true
// *************************************************************************************

// opponent attack function that receives the used attack
function opponentAttack(attack) {
  // 0: return false if attack misses
  // 1: otherwise update player health and return true
  let accuracy = 10;

  if((willAttackMiss(accuracy))) {
    let newHP = playerHp - attack.power;
    updatePlayerHp(newHP)
    return 1;
  }
  return 0;
}

function chooseOpponentAttack () {
  // Put all opponents attacks in a array
  const possibleAttacks = Object.values(opponentAttacks);

  // Randomly chooses one attack from the array
  return possibleAttacks[Math.floor(Math.random() * possibleAttacks.length)];
}

function turn(playerChosenAttack) {
  // Don't start another turn till the current one is not finished
  if (isTurnHappening) {
    return;
  }
  isTurnHappening = true;

  displayTalk(player.name + ': ' + player.pharse);
  
  const didPlayerHit = playerAttack(playerChosenAttack);
  opponent.block = (didPlayerHit && willAttackBlock2Turns(playerChosenAttack.name, 90)? 2 : opponent.block );
  
  // Update HTML text with the used attack
  turnText.innerText = 'Player used ' + playerChosenAttack.name;
  
  // Update HTML text in case the attack misses
  if (!didPlayerHit) {
    turnText.innerText += ', but missed!';
  } else if(opponent.block) {
    turnText.innerText += ' : ' + player.pharse;
  }
    
  // Wait 2000ms to execute opponent attack (Player attack animation time)
  if(opponent.block) {
    opponent.block -= 1;
    setTimeout(() => {
      turnText.innerText = opponent.name + ': Blocked!';
      // Wait 2000ms to end the turn (Opponent attack animation time)
      setTimeout(() => {
        // Update HTML text for the next turn
        turnText.innerText = 'Please choose one attack';
        isTurnHappening = false;
        displayTalk(player.name + ': ' + 'You in shock');
      }, 2000);
    }, 2000);
  } else {
    setTimeout(() => {
      // Randomly chooses opponents attack
      const opponentChosenAttack = chooseOpponentAttack();
      
      const didOpponentHit = opponentAttack(opponentChosenAttack);
     
      displayTalk(opponent.name + ' : ' + opponent.pharse);
      // Update HTML text with the used attack
      turnText.innerText = 'Opponent used ' + opponentChosenAttack.name;
      
      // Update HTML text in case the attack misses
      if (!didOpponentHit) {
        turnText.innerText += ', but missed!';
      }
      // Wait 2000ms to end the turn (Opponent attack animation time)
      setTimeout(() => {
        // Update HTML text for the next turn
        turnText.innerText = 'Please choose one attack';
        isTurnHappening = false;
      }, 2000);
    }, 2000);
  }
}

// Set buttons click interaction
document.getElementById('thunder-shock-button').addEventListener('click', function() {
  turn(playerAttacks.thunderShock);
});
document.getElementById('quick-attack-button').addEventListener('click', function() {
  turn(playerAttacks.quickAttack);
});
document.getElementById('thunder-button').addEventListener('click', function() {
  turn(playerAttacks.thunder);
});
document.getElementById('submission-button').addEventListener('click', function() {
  turn(playerAttacks.submission);
});
document.getElementById('giveup-button').addEventListener('click', function() {
  turn(playerAttacks.giveup);
});
