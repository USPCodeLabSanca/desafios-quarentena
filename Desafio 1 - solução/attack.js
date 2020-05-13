// Attack class definition
class Attack {
	constructor (name, damage, accuracy, type, paralysisChance = 0) {
		this.name = name;
		this.damage = damage;
		this.accuracy = accuracy;
		this.type = type;
		this.paralysisChance = paralysisChance;
	}

	// Checks attack stats
	willMiss () {
		return Math.random() * 100 >= this.accuracy;
	}

	willBeSuperEffective (targetType) {
		if (this.type === 'electric' && targetType === 'water') return true;
		return false;
	}

	willParalyse () {
		return Math.random() * 100 <= this.paralysisChance;
	}
}
