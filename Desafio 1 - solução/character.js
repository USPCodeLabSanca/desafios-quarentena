// Character class definition
class Character {
	constructor (name, type, maxHealth, attacks, imgSource, containerElement, textElement) {
		this.name = name;
		this.type = type;
		this.health = maxHealth;
		this.maxHealth = maxHealth;
		this.attacks = attacks;
		this.textElement = textElement;

		this.paralysedTurns = 0;

		this.xp = 0;
		this.level = 1;
		this.nextLevelXP = 10;
		this.rewardXP = 20;

		this.rootElement = document.createElement('div');
		this.rootElement.classList.add('character');
		this.rootElement.innerHTML = `
			<div class="health-bar">
				<div class="health-bar-green"></div>
				<span class="health-bar-number">100/100</span>
			</div>
			<div class="level-number">LVL 1</div>
			<div class="xp-number">xp: 0/10</div>
			<div class="paralysis-text" style="opacity: 0">paralysed</div>
			<img src="${imgSource}" alt="${name}">
			<div class="grass"></div>
		`;
		if (containerElement.firstElementChild) {
			// Replace containerElement.firstElementChild with rootElement
			containerElement.replaceChild(this.rootElement, containerElement.firstElementChild);
		} else {
			// Add rootElement inside containerElement
			containerElement.appendChild(this.rootElement);
		}

		this.healthBarElem = this.rootElement.querySelector('.health-bar-green');
		this.healthNumberElem = this.rootElement.querySelector('.health-bar-number');
		this.levelNumberElem = this.rootElement.querySelector('.level-number');
		this.xpNumberElem = this.rootElement.querySelector('.xp-number');
		this.characterImage = this.rootElement.querySelector('img');
		this.paralysisTextElem = this.rootElement.querySelector('.paralysis-text');

		this.updateHealth(maxHealth);

		if (attacks.length === 0) throw new Error('Must have at least one attack');
	}

	updateHealth (newValue) {
		this.health = Math.min(Math.max(newValue, 0), this.maxHealth);
		const barWidth = (this.health / this.maxHealth) * 100;
		this.healthBarElem.style.width = barWidth + '%';
		this.healthNumberElem.innerText = this.health + '/' + this.maxHealth;
		if (this.health === 0) this.die();

		return this.health > 0;
	}

	getRandomAttack () {
		return this.attacks[Math.floor(Math.random() * this.attacks.length)];
	}

	gainXP (ammount) {
		this.xp += ammount;
		while (this.xp >= this.nextLevelXP) this.levelUp();
		this.xpNumberElem.innerText = 'xp: ' + this.xp + '/' + this.nextLevelXP;
	}

	// Level Up playeer stats change
	levelUp () {
		this.xp -= this.nextLevelXP;
		this.level ++;
		const oldMaxHealth = this.maxHealth
		this.maxHealth = Math.round(this.maxHealth * 1.2);
		this.updateHealth(this.health + (this.maxHealth - oldMaxHealth));
		this.nextLevelXP = Math.round(this.nextLevelXP * 1.5);
		this.levelNumberElem.innerText = 'LVL ' + this.level;
	}

	// Death animation
	die () {
		this.characterImage.style.transform = 'rotate(90deg)';
		setTimeout(() => {
			this.characterImage.style.opacity = 0;
			setTimeout(() => {
				this.characterImage.style.transition = 'unset';
				this.characterImage.style.transform = '';
				this.characterImage.style.transition = '';
			}, 1000);
		}, 1000);
	}

	paralyse () {
		this.paralysedTurns = 2;
		this.paralysisTextElem.style.opacity = 1;
	}

	unparalyse () {
		this.paralysedTurns = 0;
		this.paralysisTextElem.style.opacity = 0;
	}

	attack (attack, character) {
		if (this.paralysedTurns > 0) {
			this.paralysedTurns--;
			if (this.paralysedTurns === 0) setTimeout(() => this.unparalyse(), 1000);
			this.textElement.innerText = this.name + ' is paralised!';
			return false;
		}

		// Check attack status
		this.textElement.innerText = this.name + ' used ' + attack.name;
		if (attack.willMiss()) {
			this.textElement.innerText += ', but missed!';
			return false;
		}

		if (attack.willParalyse()) {
			this.textElement.innerText += ', paralysing ' + character.name;
			character.paralyse();
		}

		let damage = attack.damage;
		if (attack.willBeSuperEffective(character.type)) {
			this.textElement.innerText += '. It was SUPER effective';
			damage *= 1.5;
		}

		// Each level increses damage by 20%, after effectiveness
		damage *= 1 + (this.level - 1) / 5;
		const isCharacterAlive = character.updateHealth(Math.round(character.health - damage));

		if (!isCharacterAlive) this.gainXP(character.rewardXP);

		return true;
	}
}

// Character class definition
class Player extends Character {
	constructor (turnFunction, textElement) {
		const buttonsContainer = document.getElementById('buttons-container');
		const attacks = [
			new Attack('Thunder Shock', 40, 100, 'electric', 50),
			new Attack('Thunder', 110, 70, 'electric'),
			new Attack('Quick Attack', 40, 100, 'normal'),
		];
		super(
			'Player',
			'electric',
			274,
			attacks,
			'assets/pikachu.gif',
			document.querySelector('#arena > #player-container'),
			textElement,
		);
		this.buttonsContainer = buttonsContainer;
		this.turnFunction = turnFunction;

		this.attacks = [];
		for (const attack of attacks) this.createAttack(attack);
	}

	createAttack (attack) {
		const newButton = document.createElement('button');
		newButton.innerText = attack.name.toUpperCase();
		newButton.classList.add('attack-button');
		this.buttonsContainer.appendChild(newButton);

		// Set newButton click interation
		newButton.addEventListener('click', () => {
			this.turnFunction(attack);
		});

		this.attacks.push(attack);
	}

	levelUp () {
		super.levelUp();
		if (this.level === 2) {
			this.createAttack(new Attack('Tail Whip', 60, 100, 'normal', 30));
		} else if (this.level === 3) {
			this.createAttack(new Attack('Double Kick', 40, 80, 'fighting', 60));
		} else if (this.level === 4) {
			this.createAttack(new Attack('Thunder', 110, 70, 'electric'));
			// Change player image
			this.characterImage.setAttribute('src', 'assets/raichu.gif');
		}
	}
}

// Squirtle class definition that inherit from Character class
class Squirtle extends Character {
	constructor (level, textElement) {
		super(
			'Opponent',
			'water',
			292,
			[
				new Attack('Tackle', 40, 100, 'normal', 30),
				new Attack('Bubble', 40, 100, 'water', 30),
				new Attack('Water Gun', 40, 100, 'water'),
				new Attack('Hydro Pump', 110, 80, 'water'),
			],
			'assets/squirtle.gif',
			// Select component with id opponent-container that are inside the component with id arena
			document.querySelector('#arena > #opponent-container'),
			textElement,
		);
		for (let i = 0; i < level; i++) this.levelUp();
	}
}
