export class UI {
	static createElement(tag, attributes = {}, textContent = '') {
		const element = document.createElement(tag);
		for (const [key, value] of Object.entries(attributes)) {
			element.setAttribute(key, value);
		}
		element.textContent = textContent;
		return element;
	}

	static renderInitialScreen(
		startGameCallback,
		difficultyChangeCallback,
		lastDifficulty
	) {
		const container = document.createElement('div');
		container.className = 'menu';
		document.body.innerHTML = '';
		document.body.appendChild(container);

		const title = UI.createElement(
			'h1',
			{ class: 'menu__title' },
			'Simon says'
		);

		const difficultyLabel = UI.createElement(
			'label',
			{ for: 'difficulty', class: 'menu__label' },
			'Difficulty:'
		);
		const difficultySelect = UI.createElement('select', {
			id: 'difficulty',
			class: 'menu__select',
		});
		['Easy', 'Medium', 'Hard'].forEach((level) => {
			const option = UI.createElement(
				'option',
				{ value: level, class: 'menu__option' },
				level
			);
			if (level === lastDifficulty) option.selected = true;
			difficultySelect.appendChild(option);
		});
		difficultySelect.addEventListener('change', () =>
			difficultyChangeCallback(difficultySelect.value)
		);

		const startButton = UI.createElement(
			'button',
			{ id: 'start', class: 'menu__button' },
			'Start'
		);
		startButton.addEventListener('click', startGameCallback);

        container.appendChild(title);
		container.appendChild(difficultyLabel);
		container.appendChild(difficultySelect);
		container.appendChild(startButton);
	}

	static renderGameScreen(
		sequence,
		currentRound,
		difficulty,
		onKeyInput,
		repeatSequenceCallback,
		newGameCallback,
		repeatDisabled
	) {
		const container = document.createElement('div');
		container.className = 'game';
		document.body.innerHTML = '';
		document.body.appendChild(container);

		const roundInfo = UI.createElement(
			'div',
			{ class: 'game__info' },
			`Round: ${currentRound}`
		);
		const difficultyInfo = UI.createElement(
			'div',
			{ class: 'game__info' },
			`Difficulty: ${difficulty}`
		);

		const inputField = UI.createElement('input', {
			id: 'user-input',
			class: 'game__input',
			readonly: 'true',
		});

		const repeatButtonAttributes = { id: 'repeat', class: 'game__button' };
		if (repeatDisabled) repeatButtonAttributes.disabled = true;

		const repeatButton = UI.createElement(
			'button',
			repeatButtonAttributes,
			'Repeat the sequence'
		);
		repeatButton.addEventListener('click', repeatSequenceCallback);

		const newGameButton = UI.createElement(
			'button',
			{ id: 'new-game', class: 'game__button' },
			'New game'
		);
		newGameButton.addEventListener('click', newGameCallback);

		const virtualKeyboard = UI.createVirtualKeyboard(sequence);
		virtualKeyboard.addEventListener('click', (e) =>
			onKeyInput(e.target.textContent)
		);

		container.appendChild(roundInfo);
		container.appendChild(difficultyInfo);
		container.appendChild(inputField);
		container.appendChild(repeatButton);
		container.appendChild(newGameButton);
		container.appendChild(virtualKeyboard);
	}

	static createVirtualKeyboard(sequence) {
		const keyboard = UI.createElement('div', {
			id: 'keyboard',
			class: 'keyboard',
		});
		const characters = sequence.getCharacters();
		characters.forEach((char) => {
			const key = UI.createElement(
				'button',
				{ class: 'keyboard__key' },
				char
			);
			keyboard.appendChild(key);
		});
		return keyboard;
	}

	static highlightKey(key, correct = true) {
		const modifier = correct ? '--correct' : '--incorrect';
		key.classList.add(`keyboard__key${modifier}`);
		setTimeout(() => key.classList.remove(`keyboard__key${modifier}`), 300);
	}
}
