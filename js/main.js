"use strict"

let contentArea = document.querySelector('#field-game');
let areaRules = document.querySelector('.wr-rules');
let areaNavigation = document.querySelector('.wr-navigation');
let areaGame = document.querySelector('.wr-game');
let area = document.querySelector('#playing-field');
let areaEndGame = document.querySelector('.wr-end-game');
let skirtsListCaption = document.querySelector('.choice-skirts');
let btnStartGame = document.querySelector('.start-game');
let timeCaption = document.querySelector('.timer');

class Game {
	constructor() {
		this.point = null;
		this.count = 0;
		this.current = null;
		this.timerOutput = null;
		this.obj = null;
		this.timeResult = 0;
		this.key = null;
		this.endTime = null;
	}	

	fillInformation() {
		let setPlayerInfo = document.querySelector('#set-info-player');

		setPlayerInfo.addEventListener('click', (e) => {
			let firstName = contentArea.querySelector('#first-name');
			let lastName = contentArea.querySelector('#last-name');
			let email = contentArea.querySelector('#email');

			let firstNameLength = firstName.value.trim().length;
			let lastNameLength = lastName.value.trim().length;
			let emailLength = email.value.trim().length;

			if (firstNameLength && lastNameLength && emailLength != 0 ) {
				this.obj = {			
					firstName: firstName.value,
					lastName: lastName.value,
					email: email.value,
					time: this.timeResult
				};
				let serialObj = JSON.stringify(this.obj); 
				this.key = 'player' + (localStorage.length + 1);
				localStorage.setItem(this.key, serialObj);

				e.preventDefault();

				areaRules.classList.add('none');				
				areaNavigation.classList.remove('none');
			}	
		});
	}

	dropNavMenu(el) {
		el.addEventListener('click', function(e) {
			this.parentNode.classList.toggle('open');
		});
		window.addEventListener('click', function(e){
			if (event.target != el) {            
	            el.parentNode.classList.remove('open')
			}	
		});
	}

	choiceLevelGame() {
		let levelsList = contentArea.querySelector('.choice-levelGame .list');
		let btnCaptionLevelGame = contentArea.querySelector('#btn-level-game');

		this.dropNavMenu(btnCaptionLevelGame);

		levelsList.addEventListener('click', (e) => {
			setTimeout(function() {
				skirtsListCaption.classList.remove('none');
			}, 500);		
			if (event.target.id === 'low') {
				this.clearArea();
				this.point = 10;
				this.addCards('lowCardGame', this.point);
				this.drawCards();
			}
			if (event.target.id === 'medium') {
				this.clearArea();
				this.point = 18;
				this.addCards('medCardGame', this.point);				
				this.drawCards();
			}
			if (event.target.id === 'high') {
				this.clearArea();
				this.point = 24;
				this.addCards('highCardGame', this.point);				
				this.drawCards();
			}
		});
		this.choiceSkirtCard();	
	}

	choiceSkirtCard() {
		let skirt = contentArea.querySelector('.choice-skirts .list');
		let btnCaptionSkirtGame = document.querySelector('#btn-skirts-game');

		this.dropNavMenu(btnCaptionSkirtGame);

		skirt.addEventListener('click', (e) => {
			let frontSkirt = document.querySelectorAll('.front');
			this.startGame();

			setTimeout(() => {
				btnStartGame.classList.remove('none');
			}, 500);	

			if (event.target.id === 'juve-white') {            
	            frontSkirt.forEach( (el) => {
					el.style.backgroundImage = 'url("images/back1.PNG")';
				});
			}  
			if (event.target.id === 'juve-black') {            
	            frontSkirt.forEach( (el) => {
					el.style.backgroundImage = 'url("images/back2.png")';
				});
			}
			if (event.target.id === 'italy') {            
	            frontSkirt.forEach( (el) => {
					el.style.backgroundImage = 'url("images/back3.png")';
				});
			}			
		});
	}

	clearArea() {
		if (area.hasChildNodes()) {
			while (area.firstChild) {
			  area.removeChild(area.firstChild);
			}
		}
	}

	addCards(newClass, num) {
		for (let i = 0; i < num; i++) {
			let newLi = document.createElement('li');
		    newLi.className = newClass + ' card';
		    area.appendChild(newLi);
		}
	}

	drawCards() {
		let cardsGame = contentArea.querySelectorAll('#playing-field li');

		let cardsBack = [];
		for (let i = 0; i < cardsGame.length/2; i++) {
		    let back = 'player' + i;
			cardsBack.push(back);
			cardsBack.push(back);
		}

		function compareRandom(a, b) {
		  return Math.random() - 0.5;
		}
		cardsBack.sort(compareRandom);

		for (let i = 0; i < cardsGame.length; i++) {
			let back = cardsBack[i];
			let frontDiv = document.createElement('div');
			let backDiv = document.createElement('div');
			frontDiv.className = 'front'; 
		    backDiv.className = 'back ' + back; 
	    	cardsGame[i].appendChild(frontDiv);
	    	cardsGame[i].appendChild(backDiv);
	    }
	}

	startGame() {
		let startBtn = document.querySelector('#start-game');
		startBtn.addEventListener('click', (e) => {
			areaGame.classList.remove('none');
			localStorage.removeItem('score')
			this.playGame();
			this.timer();
			timeCaption.classList.remove('none');
	    });	
	}

	playGame() {
		area.addEventListener('click', (event) => {	
			let target = event.target;
			while (target !== area) {
				if (target.classList.contains('card')) {
					if (this.count === 2) {
						return false;
					};

					target.classList.add('flipped');
					this.count = this.count + 1;

					if (this.count === 1) {
						this.current = target;
					};

					if (target === this.current) {
						this.count = 1;
					};

					if (this.count === 2) {
						if (this.current.childNodes[1].classList.value === target.childNodes[1].classList.value) {
							setTimeout(() => {
								this.current.classList.add('hidden');
								target.classList.add('hidden');							
								this.point = this.point - 2;
								this.count = 0;
								if (this.point === 0) {								
									clearInterval(this.timerOutput);
									this.victory();
								}
							}, 1000);
						} else {
							setTimeout(() => {
								this.current.classList.remove('flipped');
								target.classList.remove('flipped');
								this.count = 0;
							}, 1000);
						}
					}
					return;
				}
				target = target.parentNode;
			}
		});
	}

	timer() {
		let recordTime = 0;

		let timeBegin = new Date();
	    this.timerOutput = setInterval(() => {
			let timeEnd = new Date();
	        let resTime = (Date.parse(timeEnd) - Date.parse(timeBegin));	

	        let secTime = Math.floor((resTime / 1000) % 60);
			let minTime = Math.floor((resTime / 1000 / 60) % 60);	

			let sec = ('0' + secTime).slice(-2);
			let min = ('0' + minTime).slice(-2);

			let res = `${min}:${sec}`;
			time.innerHTML = res;
	    }, 1000);
	}

	victory() {
		let winTime = contentArea.querySelector('#win-time');
		let btnNewGame = document.querySelector('#new-game');

		let res = time.innerHTML;
		this.endTime = `${res}`;
		winTime.innerHTML = this.endTime;

		this.addPlayerScore();
		this.getPlayersScore();

		areaGame.classList.add('none');
		areaNavigation.classList.add('none');
		areaEndGame.classList.remove('none');

		btnNewGame.addEventListener('click', () => {
			this.startNewGame();
		});
	}

	addPlayerScore() {
		this.timeResult = this.endTime.replace(':', '');
		localStorage.getItem(this.key);
		let returnObj = JSON.parse(localStorage.getItem(this.key));
		returnObj.time = this.timeResult;
		let serialObj = JSON.stringify(returnObj); 
		localStorage.setItem(this.key, serialObj);
	}

	getPlayersScore(){
		let listScore = contentArea.querySelector('#list-score')
		let keys = Object.keys(localStorage);
		let arr = [];
		let length = localStorage.length;

		function compareTime(personA, personB) {
			return personA.time - personB.time;
		}

		for (let i = 0; i < length; i++) {   
			if (JSON.parse(localStorage.getItem(keys[i])).time !== 0) {
            	arr.push(JSON.parse(localStorage.getItem(keys[i]))); 
            }                          		    
		}
		arr.sort(compareTime);

		let serialObj = JSON.stringify(arr); 
		let key = 'score';
		localStorage.setItem(key, serialObj);

		for (let i = 0; i < arr.length; i++) {
			if (i > 10) {
				return false;
			}
			let newLi = document.createElement('li');
			let namePlayer = document.createElement('span');			
			let scorePlayer = document.createElement('span');
			let timeScore = arr[i].time.substr(0,2) + ':' + arr[i].time.substr(2,3);

			namePlayer.innerHTML = arr[i].firstName;
			scorePlayer.innerHTML = timeScore;

			newLi.appendChild(namePlayer);
			newLi.appendChild(scorePlayer);
		    listScore.appendChild(newLi);
		}
	}

	startNewGame() {
		while (area.firstChild) {
		    area.removeChild(area.firstChild);
		}
		areaNavigation.classList.remove('none');
		areaEndGame.classList.add('none');	
		btnStartGame.classList.add('none');
		areaRules.classList.add('none');
		skirtsListCaption.classList.add('none');
		timeCaption.classList.add('none');		
	}

	init() {
		this.choiceLevelGame();
	}
}

let game = new Game();

document.addEventListener("DOMContentLoaded", function() {
	game.fillInformation();
	game.init();
});
