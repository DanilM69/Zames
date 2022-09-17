const setTimeoutContext = (context, callback, delay) => window.setTimeout.bind(context, callback, delay);

class Game {
    constructor(playFunc){
        this.play = playFunc;
        this.chooseHero = document.querySelector('.chooseHero');

        this.chooseHero.addEventListener('click', this.chooseLeftHero.bind(this));
        this.chooseHero.addEventListener('contextmenu', this.chooseRightHero.bind(this));
        
    }

    activeHeroLeft = null;
    activeHeroRight = null;

    createButtonPlay() {
        if ((document.querySelector('.chooseLeftHero') !== null) && (document.querySelector('.chooseRightHero') !== null)) {
            document.querySelector('.buttonPlay').classList.remove('buttonPlay_passive');
        } else {
            document.querySelector('.buttonPlay').classList.add('buttonPlay_passive');
        }
        let buttonPlay = document.querySelector('.buttonPlay');
        buttonPlay.addEventListener('click', this.play);
    }

    timerId;

    timer() {
        let time = 20;
        const context = this;
        const tickCallback = function tick() {
            if (time >= 0) {
                document.querySelector('.timer').innerHTML = `${time}`;
                time--;
            }
            if (time < 0) {
                context.nextPlayer();
                const bindedTimer = context.timer.bind(context);
                setTimeout(bindedTimer, 1000);
                return;
            }
            context.timerId = setTimeout(tick, 1000);
        };
        this.timerId = setTimeout(tickCallback, 1000);
    }

    stopTimer() {
        const context = this;
        setTimeout(function() {
            clearTimeout(context.timerId);
        }, 1000);
    }

    reloadTimer() {
        const context = this;
        setTimeout(function() {
            clearTimeout(context.timerId);
            context.timer();
        }, 1000);
    }

    //выбор персонажа 
    chooseLeftHero() {
        event.preventDefault();

        if (event.target.closest('.heroes') == undefined) return;

        if (document.querySelectorAll('.chooseLeftHero').length > 0) {
            document.querySelector('.chooseLeftHero').classList.remove('chooseLeftHero');
        }
        event.target.closest('.heroes').classList.remove('chooseRightHero');
        event.target.closest('.heroes').classList.add('chooseLeftHero');

        this.activeHeroLeft = event.target.closest('.heroes').id;

        this.createButtonPlay();
    }


    chooseRightHero() {
        event.preventDefault();

        if (event.target.closest('.heroes') == undefined) return;

        if (document.querySelectorAll('.chooseRightHero').length > 0) {
            document.querySelector('.chooseRightHero').classList.remove('chooseRightHero');
        }

        event.target.closest('.heroes').classList.remove('chooseLeftHero');
        event.target.closest('.heroes').classList.add('chooseRightHero');
    
        this.activeHeroRight = event.target.closest('.heroes').id;

        this.createButtonPlay();
    }

    startGame() {
        this.chooseHero.style.display = 'none';
    }

    nextPlayer() {
        document.querySelector('.block').classList.toggle('blockRight');
        document.querySelector('.block').classList.toggle('blockLeft');
        setTimeout(() => {
            document.querySelector('.blockOpaciti').classList.toggle('rightOpacity');
            document.querySelector('.blockOpaciti').classList.toggle('leftOpacity');
        }, 2000);
    }

    createLeftHero() {  
        let act = heroes.find(obj => obj.name == this.activeHeroLeft); 
        let leftimg = document.createElement('img');
        leftimg.setAttribute('src', `./img/${this.activeHeroLeft}/left/pers.png`);
        leftimg.className = 'heroesImg';
        document.querySelector('.leftPlayer').append(leftimg);
    
        document.querySelector('.hp_left').style.width = `${3 * act.hp}px`;
        document.querySelector('.mana_left').style.width = `${2.2 * act.mana}px`;
    
        this.createButtonsSkills(act, 'left');
    }
    
    createRightHero() {
        let act = heroes.find(obj => obj.name == this.activeHeroRight); 
        let rightimg = document.createElement('img');
        rightimg.setAttribute('src', `./img/${this.activeHeroRight}/right/pers.png`);
        rightimg.className = 'heroesImg';
        document.querySelector('.rightPlayer').append(rightimg);
    
        document.querySelector('.hp_right').style.width = `${3 * act.hp}px`;
        document.querySelector('.mana_right').style.width = `${2.5 * act.mana}px`;
        
        this.createButtonsSkills(act, 'right');
    }

    createButtonsSkills(act, player) {
        let bottom = 10;
        for (let item of act.skills) {
            let newBut = document.createElement('button');
            newBut.className = `buttonSkill ${player}`;
            newBut.style.cssText = `${player}: 20px`;
            newBut.innerHTML = `${item.name.split('').splice(5).join('')}`
            newBut.style.bottom = `${bottom}px`
            document.body.prepend(newBut);
            bottom += 70;
            newBut.addEventListener('click', () => this.kickHandler(act, item()));
        }

    }

    defeat() {
        if (event.target.closest('.left') !== null) {
            let actLeft = heroes.find(obj => obj.name == this.activeHeroLeft); 
            let actRight = heroes.find(obj => obj.name == this.activeHeroRight); 
            if (document.querySelector('.hp_right').style.width == '0px') {
                setTimeout(() => {
                    document.querySelector(`.leftPlayer`).firstElementChild.setAttribute('src', `./img/${actLeft.name}/left/win.png`);
                    document.querySelector('.leftPlayer').classList.add('heroWin');
                    document.querySelector(`.rightPlayer`).firstElementChild.setAttribute('src', `./img/${actRight.name}/right/defeat.png`);
                    document.querySelector('.rightPlayer').classList.add('heroDefeat');
                    document.querySelector('.block').style.width = '100%';
                    document.querySelector('.blockOpaciti').style.width = '100%';
                }, 1000)
                this.stopTimer();
                setTimeout(() => {
                    let reloadButton = document.createElement('button');
                    reloadButton.className = 'reloadButton';
                    reloadButton.innerHTML = 'заново';
                    document.body.prepend(reloadButton);
                    reloadButton.addEventListener('click', () => window.location.reload())
                }, 1000);
            }
        } else {
            let actLeft = heroes.find(obj => obj.name == this.activeHeroLeft); 
            let actRight = heroes.find(obj => obj.name == this.activeHeroRight); 
            if (document.querySelector('.hp_left').style.width == '0px') {
                setTimeout(() => {
                    document.querySelector(`.rightPlayer`).firstElementChild.setAttribute('src', `./img/${actRight.name}/right/win.png`);
                    document.querySelector('.rightPlayer').classList.add('heroWin');
                    document.querySelector(`.leftPlayer`).firstElementChild.setAttribute('src', `./img/${actLeft.name}/left/defeat.png`);
                    document.querySelector('.leftPlayer').classList.add('heroDefeat');
                    document.querySelector('.block').style.width = '100%';
                    document.querySelector('.blockOpaciti').style.width = '100%';
                }, 1000)
                this.stopTimer();
                setTimeout(() => {
                    let reloadButton = document.createElement('button');
                    reloadButton.className = 'reloadButton';
                    reloadButton.innerHTML = 'заново';
                    document.body.prepend(reloadButton);
                    reloadButton.addEventListener('click', () => window.location.reload())
                }, 1000);
            }
        }
    }

    kickHandler(act, func) {
        act.func;
        this.nextPlayer();
        this.reloadTimer();
        this.defeat();
    };
}

class Hero {
    constructor(name, hp, mana) {
        this.name = name;
        this.hp = hp;
        this.mana = mana;
    }

    takeDamage(damage, mana) {
        if (event.target.closest('.left') !== null) {
            let hp = document.querySelector('.hp_right').style.width;
            let arrHp = hp.split('');
            arrHp.splice(-2);
            let endHp = arrHp.join('') - damage;
            if (endHp < 0) endHp = 0;
            let mmana = document.querySelector('.mana_left').style.width;
            let arrMana = mmana.split('');
            arrMana.splice(-2);
            let endMana = arrMana.join('') - mana;
            if (endMana < 0) endMana = 0;
            document.querySelector('.hp_right').style.width = `${endHp}px`;
            document.querySelector('.mana_left').style.width = `${endMana}px`;
        } else {
            let hp = document.querySelector('.hp_left').style.width;
            let arrHp = hp.split('');
            arrHp.splice(-2);
            let endHp = arrHp.join('') - damage;
            if (endHp < 0) endHp = 0;
            let mmana = document.querySelector('.mana_right').style.width;
            let arrMana = mmana.split('');
            arrMana.splice(-2);
            let endMana = arrMana.join('') - mana;
            if (endMana < 0) endMana = 0;
            document.querySelector('.hp_left').style.width = `${endHp}px`;
            document.querySelector('.mana_right').style.width = `${endMana}px`;
        }

        this.manaRecovery(damage);
    }

    manaRecovery(damage) {
        if (event.target.closest('.left') !== null) {
            let mmana = document.querySelector('.mana_right').style.width;
            let arrMana = mmana.split('');
            arrMana.splice(-2);
            let endMana = +arrMana.join('') + 0.2*damage;
            if (endMana < 0) endMana = 0;
            if (endMana > 250) endMana = 250;
            document.querySelector('.mana_right').style.width = `${endMana}px`;
        } else {
            let mmana = document.querySelector('.mana_left').style.width;
            let arrMana = mmana.split('');
            arrMana.splice(-2);
            let endMana = +arrMana.join('') + 0.2*damage;
            if (endMana < 0) endMana = 0;
            if (endMana > 250) endMana = 250;
            document.querySelector('.mana_left').style.width = `${endMana}px`;
        }
    }

    endMana(mana) {
        if (event.target.closest('.left') !== null) {
            let mmana = document.querySelector('.mana_left').style.width;
            let arrMana = mmana.split('');
            arrMana.splice(-2);
            let endMana = +arrMana.join('') - mana;
            if (endMana < 0) {
                let err = document.createElement('div');
                err.className = 'err';
                err.innerHTML = 'не хватило маны';
                document.body.prepend(err);
                setTimeout(() => err.remove(), 1000);
                return false;
            };
        } else {
            let mmana = document.querySelector('.mana_right').style.width;
            let arrMana = mmana.split('');
            arrMana.splice(-2);
            let endMana = +arrMana.join('') - mana;
            if (endMana < 0) {
                let err = document.createElement('div');
                err.className = 'err';
                err.innerHTML = 'не хватило маны';
                document.body.prepend(err);
                setTimeout(() => err.remove(), 1000);
                return false;
            };
        }
    }
    
}

class FireMan extends Hero {
    skills = [this.fireBall.bind(this), this.udar.bind(this), this.standardKick.bind(this)];

    standardKick() {
        let damage = 30;
        let mana = 0;
        if (this.endMana(mana) == false) {
            this.takeDamage(0, mana);
            return;
        };
        let player;
        if (event.target.closest('.left')) {
            player = 'left';
        } else {
            player = 'right';
        };
        document.querySelector(`.${player}Player`).firstElementChild.style.display = 'none';
        let anim = document.createElement('img');
        anim.setAttribute('src', `./img/fireMan/${player}/pers1.png`);
        anim.className = 'fiman';
        anim.style.cssText = `${player}: 100px`;
        document.body.prepend(anim);
        setTimeout(() => {
            anim.setAttribute('src', `./img/fireMan/${player}/pers2.png`);
            anim.className = 'fiman1';
            anim.style.cssText = `${player}: 250px`;
            anim.style.animationName = `move${player}`;
            setTimeout(() => {
                anim.setAttribute('src', `./img/fireMan/${player}/pers3.png`)
            }, 600);
        }, 200)
        setTimeout(() => {
            anim.remove();
            document.querySelector(`.${player}Player`).firstElementChild.style.display = '';
        }, 1400);
        this.takeDamage(damage, mana);
    }

    udar() {
        let damage = 60;
        let mana = 50;
        if (this.endMana(mana) == false) {
            this.takeDamage(0, mana);
            return;
        };
        let player;
        if (event.target.closest('.left')) {
            player = 'left';
        } else {
            player = 'right';
        };
        document.querySelector(`.${player}Player`).firstElementChild.style.display = 'none';
        let anim = document.createElement('img');
        anim.setAttribute('src', `./img/fireMan/${player}/pers8.png`);
        anim.className = 'fiman1';
        anim.style.cssText = `${player}: 100px`;
        document.body.prepend(anim);
        setTimeout(() => {
            anim.setAttribute('src', `./img/fireMan/${player}/pers9.png`);
            anim.style.animationName = `moveFi${player}`;
            setTimeout(() => {
                anim.setAttribute('src', `./img/fireMan/${player}/pers10.png`);
            }, 400);
            setTimeout(() => {
                anim.setAttribute('src', `./img/fireMan/${player}/pers11.png`)
            }, 600);
        }, 200)
        setTimeout(() => {
            anim.remove();
            document.querySelector(`.${player}Player`).firstElementChild.style.display = '';
        }, 1400);
        this.takeDamage(damage, mana);
    }

    fireBall() {
        let damage = 120;
        let mana = 110;
        if (this.endMana(mana) == false) {
            this.takeDamage(0, mana);
            return;
        };
        let player;
        if (event.target.closest('.left')) {
            player = 'left';
        } else {
            player = 'right';
        };
        document.querySelector(`.${player}Player`).firstElementChild.style.display = 'none';
        let man = document.createElement('img');
        let ball = document.createElement('img');
        man.setAttribute('src', `./img/fireMan/${player}/pers6.png`);
        man.className = 'fiman2';
        man.style.cssText = `${player}: 100px`;
        document.body.prepend(man);
        setTimeout(() => {
            man.setAttribute('src', `./img/fireMan/${player}/pers7.png`)
        }, 300);
        setTimeout(() => {
            ball.setAttribute('src', `./img/fireMan/${player}/fire-ball.png`);
            ball.className = 'fireBall';
            ball.style.cssText = `${player}: 400px`;
            ball.style.animationName = `${player}`;
            document.body.prepend(ball);
        }, 300)
        setTimeout(() => {
            ball.remove();
            man.remove();
            document.querySelector(`.${player}Player`).firstElementChild.style.display = '';
        }, 1250);
        this.takeDamage(damage, mana);
    }

}

class Ded extends Hero {
    skills = [this.iceBall.bind(this), this.udar.bind(this), this.standardKick.bind(this)];

    standardKick() {
        let damage = 20;
        let mana = 0;
        if (this.endMana(mana) == false) {
            this.takeDamage(0, mana);
            return;
        };
        let player;
        if (event.target.closest('.left')) {
            player = 'left';
        } else {
            player = 'right';
        };
        document.querySelector(`.${player}Player`).firstElementChild.style.display = 'none';
        let anim = document.createElement('img');
        anim.setAttribute('src', `./img/ded/${player}/pers1.png`);
        anim.className = 'ded';
        anim.style.cssText = `${player}: 100px`;
        document.body.prepend(anim);
        setTimeout(() => {
            anim.setAttribute('src', `./img/ded/${player}/pers2.png`);
            anim.className = 'ded1';
            anim.style.cssText = `${player}: 250px`;
            anim.style.animationName = `moveDed${player}`;
            setTimeout(() => {
                anim.setAttribute('src', `./img/ded/${player}/pers3.png`)
            }, 600);
        }, 200)
        setTimeout(() => {
            anim.remove();
            document.querySelector(`.${player}Player`).firstElementChild.style.display = '';
        }, 1400);
        this.takeDamage(damage, mana);
    }

    udar() {
        let damage = 40;
        let mana = 50;
        if (this.endMana(mana) == false) {
            this.takeDamage(0, mana);
            return;
        };
        let player;
        if (event.target.closest('.left')) {
            player = 'left';
        } else {
            player = 'right';
        };
        document.querySelector(`.${player}Player`).firstElementChild.style.display = 'none';
        let anim = document.createElement('img');
        anim.setAttribute('src', `./img/ded/${player}/pers5.png`);
        anim.className = 'dedu';
        anim.style.cssText = `${player}: 100px`;
        document.body.prepend(anim);
        setTimeout(() => {
            anim.setAttribute('src', `./img/ded/${player}/pers4.png`);
            anim.className = 'dedu1';
            anim.style.cssText = `${player}: 250px`;
            anim.style.animationName = `move${player}`;
            setTimeout(() => {
                anim.setAttribute('src', `./img/ded/${player}/pers6.png`);
                setTimeout(() => {
                    anim.setAttribute('src', `./img/ded/${player}/pers7.png`);
                    anim.style.width = '170px';
                    anim.style.height = '210px';
                }, 200);
            }, 400);
        }, 200)
        setTimeout(() => {
            anim.remove();
            document.querySelector(`.${player}Player`).firstElementChild.style.display = '';
        }, 1400);
        this.takeDamage(damage, mana);
    }

    iceBall() {
        let damage = 80;
        let mana = 110;
        if (this.endMana(mana) == false) {
            this.takeDamage(0, mana);
            return;
        };
        let player;
        if (event.target.closest('.left')) {
            player = 'left';
        } else {
            player = 'right';
        };
        document.querySelector(`.${player}Player`).firstElementChild.style.display = 'none';
        let man = document.createElement('img');
        let ball = document.createElement('img');
        man.setAttribute('src', `./img/ded/${player}/pers9.png`);
        man.className = 'tek';
        //man.style.width = '150px';
        man.style.cssText = `${player}: 100px`;
        document.body.prepend(man);
        setTimeout(() => {
            man.setAttribute('src', `./img/ded/${player}/pers8.png`);
            man.style.width = '170px';
        }, 300);
        setTimeout(() => {
            ball.setAttribute('src', `./img/ded/${player}/ball.png`);
            ball.className = 'ball';
            ball.style.cssText = `${player}: 400px`;
            ball.style.animationName = `${player}`;
            document.body.prepend(ball);
        }, 300)
        setTimeout(() => {
            ball.remove();
            man.remove();
            document.querySelector(`.${player}Player`).firstElementChild.style.display = '';
        }, 1250);
        this.takeDamage(damage, mana);
    }
}

class Tekken extends Hero {
    skills = [this.typhoon.bind(this), this.udar.bind(this), this.standardKick.bind(this)];

    standardKick() {
        let damage = 25;
        let mana = 0;
        if (this.endMana(mana) == false) {
            this.takeDamage(0, mana);
            return;
        };
        let player;
        if (event.target.closest('.left')) {
            player = 'left';
        } else {
            player = 'right';
        };
        document.querySelector(`.${player}Player`).firstElementChild.style.display = 'none';
        let anim = document.createElement('img');
        anim.setAttribute('src', `./img/tekken/${player}/pers1.png`);
        anim.className = 'dedu';
        anim.style.cssText = `${player}: 100px`;
        document.body.prepend(anim);
        setTimeout(() => {
            anim.setAttribute('src', `./img/tekken/${player}/pers2.png`);
            anim.className = 'dedu1';
            anim.style.cssText = `${player}: 250px`;
            anim.style.animationName = `move${player}`;
            setTimeout(() => {
                anim.setAttribute('src', `./img/tekken/${player}/pers3.png`);
                setTimeout(() => {
                    anim.setAttribute('src', `./img/tekken/${player}/pers4.png`);
                    anim.style.width = '170px';
                    anim.style.height = '210px';
                }, 200);
            }, 400);
        }, 200)
        setTimeout(() => {
            anim.remove();
            document.querySelector(`.${player}Player`).firstElementChild.style.display = '';
        }, 1400);
        this.takeDamage(damage, mana);
    }

    udar() {
        let damage = 50;
        let mana = 50;
        if (this.endMana(mana) == false) {
            this.takeDamage(0, mana);
            return;
        };
        let player;
        if (event.target.closest('.left')) {
            player = 'left';
        } else {
            player = 'right';
        };
        document.querySelector(`.${player}Player`).firstElementChild.style.display = 'none';
        let anim = document.createElement('img');
        anim.setAttribute('src', `./img/tekken/${player}/pers7.png`);
        anim.className = 'teku';
        anim.style.cssText = `${player}: 100px`;
        document.body.prepend(anim);
        setTimeout(() => {
            anim.setAttribute('src', `./img/tekken/${player}/pers8.png`);
            anim.style.animationName = `moveTek${player}`;
            setTimeout(() => {
                anim.setAttribute('src', `./img/tekken/${player}/pers9.png`);
                setTimeout(() => {
                    anim.setAttribute('src', `./img/tekken/${player}/pers10.png`);
                    setTimeout(() => {
                        anim.setAttribute('src', `./img/tekken/${player}/pers11.png`);
                        anim.style.width = '180px';             
                    }, 100);
                }, 150);
            }, 250);
            setTimeout(() => {
                anim.setAttribute('src', `./img/tekken/${player}/pers1.png`)
            }, 600);
        }, 200)
        setTimeout(() => {
            anim.remove();
            document.querySelector(`.${player}Player`).firstElementChild.style.display = '';
        }, 1400);
        this.takeDamage(damage, mana);
    }

    typhoon() {
        let damage = 100;
        let mana = 110;
        if (this.endMana(mana) == false) {
            this.takeDamage(0, mana);
            return;
        };
        let player;
        if (event.target.closest('.left')) {
            player = 'left';
        } else {
            player = 'right';
        };
        document.querySelector(`.${player}Player`).firstElementChild.style.display = 'none';
        let man = document.createElement('img');
        let ball = document.createElement('img');
        man.setAttribute('src', `./img/tekken/${player}/pers1.png`);
        man.className = 'tek';
        man.style.cssText = `${player}: 100px`;
        document.body.prepend(man);
        setTimeout(() => {
            man.setAttribute('src', `./img/tekken/${player}/pers3.png`);
            man.className = 'tek1';
        }, 300);
        setTimeout(() => {
            ball.setAttribute('src', `./img/tekken/${player}/typhoon.png`);
            ball.className = 'typhoon';
            ball.style.cssText = `${player}: 400px`;
            ball.style.animationName = `${player}t`;
            document.body.prepend(ball);
        }, 300)
        setTimeout(() => {
            ball.remove();
            man.remove();
            document.querySelector(`.${player}Player`).firstElementChild.style.display = '';
        }, 1250);
        this.takeDamage(damage, mana);
    }
    
}

function play() {
    ded = new Ded('ded', 120, 100);
    fireMan = new FireMan('fireMan', 85, 100);
    tekken = new Tekken('tekken', 100, 100);
    heroes = [fireMan, ded, tekken];
    newGame.startGame();
    newGame.createLeftHero();
    newGame.createRightHero();
    newGame.timer();

    let block = document.createElement('div');
    let blockOpaciti = document.createElement('div');
    block.className = 'block blockRight';
    blockOpaciti.className = 'blockOpaciti rightOpacity';
    document.body.prepend(blockOpaciti);
    document.body.prepend(block);
}

let heroes;
let ded;
let fireMan;
let tekken;

let newGame = new Game(play);

