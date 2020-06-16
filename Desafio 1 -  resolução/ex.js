
const _playerAttacks = {
  thunderShock: {
    power: 40,
    accuracy: 40,
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
    accuracy: 50,
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
    power: 8001,
    accuracy: 100,
    name: 'Run For Live!',
    type: 'Only For Braves',
  },
}

const _opponentAttacks = {
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

class Player {
  constructor(name, type, pharse, hp, playerAttacks, playerHpElement) {
    this.totalHp = hp;
    this.playerHp = hp;
    this.block = 0;
    this.name = name;
    this.type = type;
    this.pharse = pharse;
    this.playerAttacks = playerAttacks;
    this.playerHpElement = document.getElementById(playerHpElement);
    this.exp = 0;
    this.lvl = 0;
  }

  // Check if attacks misses
  // 0 : miss
  // 1 : hit
  willAttackMiss (accuracy) {
    return Math.floor(Math.random() * 100) > accuracy;
  }

  // Return value random damage
  damageAtack() {
    return Math.floor(Math.random() * 100);
  }

  // Check if attacks blokc opponent
  // 0 : no block
  // 2 : block opponent
  willAttackBlock(power, accuracy) {
    switch (power) {
      case 'Thunder Shock':
        return this.block = (Math.floor(Math.random() * 100) > accuracy)? 0 : 1;
      default: return 0;
    }
  }

  // 0 : no HP
  // 1 : update with sucess
  updatePlayerHp(newHP) {
    // Prevents the HP to go lower than 0
    this.playerHp = Math.max(newHP, 0);
  
    // If player health is equal 0 opponent wins
    if (this.playerHp === 0) {
      return 0;
    }
  
    // Update the player hp bar
    const barWidth = (this.playerHp / this.totalHp) * 100;
    this.playerHpElement.style.width = barWidth + '%';

    return 1;
  }

  // Check if is Block 
  // 0 : no blocked
  // 1 : blocked, and phases blocked decrease
  isBlocked() {
    if(this.block > 0) {
      this.block--;
      return 1;
    }
    else return 0;
  }

  evolution() {
    this.exp += 1;
    if(this.exp > 3 && this.lvl < 1) {
      let src = '#' + `${(this.name).toLowerCase()}` + ' img';
      let img = document.querySelector(src);
      src =  'assets/' + `${(this.name).toLowerCase()}` +  '_1.gif';
      img.src = src;
      setTimeout(() => {
        img.className = `${(this.name).toLowerCase()}` + '_1';
      }, 800);

      if(this.name == 'Picachu') {
        _playerAttacks.thunder += 20;
        _playerAttacks.quickAttack += 20;
      } else {
        _opponentAttacks.tackle += 20;
        _opponentAttacks.quickAttack += 60;
      }

      //TODO: new atack
    }
  }


  // *************************************************************************************
  // player attack function that receives the used attack
  // return false if attack misses
  // otherwise update opponents health and return true
  // *************************************************************************************
  playerAttack(attack, opponent) {
    // 0: return false if attack misses
    // 1: otherwise update opponents health and return true
    let accuracy = 10;
    
    if(attack.type == 'electric' && opponent.type == 'water') {
        attack.power += this.damageAtack();
    }

    if((this.willAttackMiss(100 - attack.accuracy))) {
      this.evolution();
      let newHP = opponent.playerHp - attack.power;
      opponent.updatePlayerHp(newHP)
      return 1;
    }
    return 0;
  }
}

const _player = new Player('Pikachu', 'eletric', 'I ll shock your system!', 274, _playerAttacks, 'player-health');
const _opponent = new Player('Squirtle', 'water', 'I ll wash you, watch out!', 300, _opponentAttacks, 'opponent-health');


const _turnText = document.getElementById('text');
let _isTurnHappening = false;

const _innerPharse = document.getElementById('pharse');

/*
Game Class
*/
function gameOver (winner) {
  // Wait 1000 (Health loss animation)
  setTimeout(() => {
    // Update HTML text with the winner
    _turnText.innerText = winner + ' is the winner!';
    // Open alert with the winner
    alert(winner + ' is the winner! Close this alert to play again');
    // Reload the game
    window.location.reload();
  }, 1000);
}

// display text
function displayTalk(text) {
  _innerPharse.style.display = 'inline-block';
  _innerPharse.innerText = text
}

function cleanDisplay() {
  _innerPharse.innerText = ''
  _innerPharse.style.display = null;
}

function chooseOpponentAttack () {
  // Put all opponents attacks in a array
  const possibleAttacks = Object.values(_opponentAttacks);

  // Randomly chooses one attack from the array
  return possibleAttacks[Math.floor(Math.random() * possibleAttacks.length)];
}

function turn(playerChosenAttack) {
  // Don't start another turn till the current one is not finished
  if (_isTurnHappening) {
    return;
  }
  _isTurnHappening = true;

  displayTalk(_player.name + ': ' + _player.pharse + '\n' + playerChosenAttack.name);
  
  const didPlayerHit = _player.playerAttack(playerChosenAttack, _opponent);
  
  // If player health is equal 0 opponent wins
  if (_opponent.playerHp === 0) {
    gameOver(_player.name);
  }

  // Update HTML text with the used attack
  _turnText.innerText = 'Player used ' + playerChosenAttack.name;
  
  // Update HTML text in case the attack misses
  if (!didPlayerHit) {
    _turnText.innerText += ', but missed!';
    displayTalk(_player.name + ' ' + playerChosenAttack.name + ' ' + ' missed');
  } else if(_opponent.block) {
    _turnText.innerText += ' : ' + _player.pharse;
    _opponent.willAttackBlock(playerChosenAttack.name, 50);
  }
    
  // Wait 2000ms to execute opponent attack (Player attack animation time)
  if(_opponent.isBlocked()) {
    setTimeout(() => {
      displayTalk('Opponent is slow, attack!')
      _turnText.innerText = _opponent.name + ': Blocked!';
      // Wait 2000ms to end the turn (Opponent attack animation time)
      setTimeout(() => {
        // Update HTML text for the next turn
        _turnText.innerText = 'Please choose one attack';
        _isTurnHappening = false;
        displayTalk(_player.name + ': ' + 'You in shock');
      }, 2000);
    }, 2000);
  } else {
    setTimeout(() => {
      // Randomly chooses opponents attack
      const opponentChosenAttack = chooseOpponentAttack();
      
      const didOpponentHit = _opponent.playerAttack(opponentChosenAttack, _player);
     
      // If player health is equal 0 opponent wins
      if (_player.playerHp === 0) {
        gameOver(_opponent.name);
      }

      _player.willAttackBlock(opponentChosenAttack.name, 50);

      displayTalk(_opponent.name + ' : ' + _opponent.pharse + '\n' + opponentChosenAttack.name);
      
      // Update HTML text with the used attack
      _turnText.innerText = 'Opponent used ' + opponentChosenAttack.name;
      
      // Update HTML text in case the attack misses
      if (!didOpponentHit) {
        _turnText.innerText += ', but missed!';
      }
      // Wait 2000ms to end the turn (Opponent attack animation time)
      setTimeout(() => {
        // Update HTML text for the next turn
        _turnText.innerText = 'Please choose one attack';
        cleanDisplay();
        _isTurnHappening = false;
      }, 2000);
    }, 2000);
  }
}

document.getElementById('thunder-shock-button').addEventListener('click', function() {
  turn(_playerAttacks.thunderShock);
});
document.getElementById('quick-attack-button').addEventListener('click', function() {
  turn(_playerAttacks.quickAttack);
});
document.getElementById('thunder-button').addEventListener('click', function() {
  turn(_playerAttacks.thunder);
});
document.getElementById('submission-button').addEventListener('click', function() {
  turn(_playerAttacks.submission);
});
document.getElementById('giveup-button').addEventListener('click', function() {
  turn(_playerAttacks.giveup);
});
