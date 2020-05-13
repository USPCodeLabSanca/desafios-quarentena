class Map {
	constructor (containerElement) {
		this.movableEntities = [];
		this.containerElement = containerElement;
		this.gameStartTimestamp = Date.now();
	}

	addEntity (entity) {
		this.movableEntities.push(entity);
	}

	removeEntity (entity) {
		this.movableEntities.splice(this.movableEntities.findIndex(a => a === entity), 1);
	}

	verifyForCollision (entity1, entity2) {
		if (entity1 instanceof Asteroid && entity2 instanceof Asteroid) return;
		if (entity1 instanceof Player && entity2 instanceof Bullet) return;
		if (entity1 instanceof Bullet && entity2 instanceof Player) return;

		if (MovableEntity.didEntitiesColide(entity1, entity2)) {
			entity1.collided(entity2);
			entity2.collided(entity1);
		}
	}

	shouldAsteroidSpawn () {
		const asteroidSpawnChance = 0.003 + Math.sqrt(Date.now() - this.gameStartTimestamp) / 10000000;

		return Math.random() < asteroidSpawnChance;
	}

	frame () {
		this.movableEntities.forEach(entity => entity.frame());

		for (let i = 0; i < this.movableEntities.length; i ++) {
			const entity1 = this.movableEntities[i];
			for (let j = i + 1; j < this.movableEntities.length; j ++) {
				const entity2 = this.movableEntities[j];
				this.verifyForCollision(entity1, entity2);
			}

			if (entity1.distanceFromCenter() > 300) entity1.delete();
		}

		if (this.shouldAsteroidSpawn()) {
			const position = new Vector(Math.random() - 0.5, Math.random() - 0.5).normalize().scale(299);
			new Asteroid(this.containerElement, this, position);
		}
	}
}