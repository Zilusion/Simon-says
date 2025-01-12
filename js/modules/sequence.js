export class Sequence {
	constructor(difficulty) {
		this.difficulty = difficulty;
		this.currentSequence = [];
	}

	generateSequence(length) {
		const characters = this.getCharacters();
		this.currentSequence = Array.from(
			{ length },
			() => characters[Math.floor(Math.random() * characters.length)]
		);
	}

	getCharacters() {
		if (this.difficulty === 'Easy') return '0123456789'.split('');
		if (this.difficulty === 'Medium')
			return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
		if (this.difficulty === 'Hard')
			return '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
	}

	getSequence() {
		return this.currentSequence;
	}
}
