const playerHpElement = document.getElementById('player-health');
const playerLevelElement = document.querySelector('#player-level');
const opponentLevelElement = document.querySelector('#opponent-level');
let playerLvl3Button = document.querySelector('#lvl3-button');
let playerLvl4Button = document.querySelector('#lvl4-button');

playerLvl3Button.style.display = 'none';
playerLvl4Button.style.display = 'none';

const playerTotalHp = 274;
let playerHp = 274;

const opponentHpElement = document.getElementById('opponent-health');
const opponentTotalHp = 292;
let opponentHp = 292;

const turnText = document.getElementById('text');
let isTurnHappening = false;

const playerChampion = {
  level: 1,
  role: 'earth',
  attacks: {
    fastPunch: {
      power: 40,
      accuracy: 100,
      name: 'Fast Punch',
      type: 'electric',
    },
    splintersKick: {
      power: 40,
      accuracy: 100,
      name: 'Splinters Kick',
      type: 'normal',
    },
    thunder: {
      power: 110,
      accuracy: 70,
      name: 'Thunder',
      type: 'eletric',
      shock: false,
    },
    backFlip: {
      power: 80,
      accuracy: 80,
      name: 'Back Flip',
      type: 'normal',
    },
    shuriken: {
      power: 90,
      accuracy: 90,
      name: 'Shuriken',
      type: 'normal'
    },
    nunchaku: {
      power: 50,
      accuracy: 70,
      name: 'Nunchaku',
      type: 'normal'
    }
  }
}

const opponentChampion = {
  level: 1,
  role: 'water',
  turnsToGo: 0,
  attacks: {
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

// Check if attacks misses
function willAttackMiss (accuracy) {
  return Math.floor(Math.random() * 100) > accuracy;
}

function updatePlayerHp(newHP) {
  // Prevents the HP to go lower than 0
  playerHp = Math.max(newHP, 0);

  // If player health is equal 0 opponent wins
  if (playerHp === 0) {
    gameOver('Opponent');
  }

  // Update the player hp bar
  const barWidth = (playerHp / playerTotalHp) * 100;
  playerHpElement.style.width = barWidth + '%';
}

function updateOpponentHp(newHP) {
  // Prevents the HP to go lower than 0
  opponentHp = Math.max(newHP, 0);

  // If oppont health is equal 0 player wins
  if (opponentHp === 0) {
    gameOver('Player');
  }

  // Update the opponents hp bar
  const barWidth = (opponentHp / opponentTotalHp) * 100;
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
  if(!willAttackMiss(attack.accuracy)) {
    updateOpponentHp(opponentHp - attack.power);

    if (attack.type === 'eletric' && opponentChampion.role === 'water') {
      //40% bonus by eletric attacks against water opponents
      attack.power *= 1.4;
    }

    if (attack.name === 'Thunder') {
      let thundershock = Math.floor(Math.random() * 5);
      if (thundershock >= 4) {
        //stun the opponent for 2 rounds if thundershock has value 4 ou 5
        opponentChampion.turnsToGo = 2;
        playerChampion.attacks.thunder.shock = true;
      }
    }
    
    playerChampion.level += 1;
    return true;
  }

  return false;
  
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
  if(!willAttackMiss(attack.accuracy)) {
    updatePlayerHp(playerHp - attack.power);

    opponentChampion.level += 1;
    return true;
  }

  return false;
}

function chooseOpponentAttack () {
  // Put all opponents attacks in a array
  const possibleAttacks = Object.values(opponentChampion.attacks);

  // Randomly chooses one attack from the array
  return possibleAttacks[Math.floor(Math.random() * possibleAttacks.length)];
}

function turn(playerChosenAttack) {
  // Don't start another turn till the current one is not finished
  if (isTurnHappening) {
    return;
  }
  isTurnHappening = true;

  const didPlayerHit = playerAttack(playerChosenAttack);

  // Updates HTML text with the used attack
  turnText.innerText = 'Player used ' + playerChosenAttack.name;
  if (didPlayerHit && playerChosenAttack.name === 'Thunder' && playerChosenAttack.shock === true) {
    turnText.innerHTML += '<br />Opponent stunned for the 2 next rounds'
  }

  // Updates HTML text in case the attack misses
  if (!didPlayerHit) {
    turnText.innerText += ', but missed!';
  }

  //Updates player's level 
  playerLevelElement.innerText = 'Level: ' + playerChampion.level;
  if (playerChampion.level == 3) {
    playerLvl3Button.style.display = 'block';
  } else if (playerChampion.level >= 4) {
    playerLvl4Button.style.display = 'block';
  }
  
  // Wait 2000ms to execute opponent attack (Player attack animation time)
  setTimeout(() => {
    //opponentChampion.turnstoGo != 0 when stunned
    if (opponentChampion.turnsToGo === 0) {
      // Randomly chooses opponents attack
      const opponentChosenAttack = chooseOpponentAttack();

      const didOpponentHit = opponentAttack(opponentChosenAttack);

      // Update HTML text with the used attack
      turnText.innerText = 'Opponent used ' + opponentChosenAttack.name;

      // Update HTML text in case the attack misses
      if (!didOpponentHit) {
        turnText.innerText += ', but missed!';
      }
    } else {
      opponentChampion.turnsToGo -= 1;
    }

    opponentLevelElement.innerText = 'Level: ' + opponentChampion.level;

    // Wait 2000ms to end the turn (Opponent attack animation time)
    setTimeout(() => {
      // Update HTML text for the next turn
      turnText.innerText = 'Please choose one attack';
      isTurnHappening = false;
    }, 2000);
  }, 2000);
}

// Set buttons click interaction
document.getElementById('fast-punch-button').addEventListener('click', function() {
  turn(playerChampion.attacks.fastPunch);
});
document.getElementById('splinters-kick-button').addEventListener('click', function() {
  turn(playerChampion.attacks.splintersKick);
});
document.getElementById('thunder-button').addEventListener('click', function() {
  turn(playerChampion.attacks.thunder);
});
document.getElementById('back-flip-button').addEventListener('click', function() {
  turn(playerChampion.attacks.backFlip);
});
document.getElementById('lvl3-button').addEventListener('click', function() {
  turn(playerChampion.attacks.shuriken);
});
document.getElementById('lvl4-button').addEventListener('click', function() {
  turn(playerChampion.attacks.nunchaku);
});
