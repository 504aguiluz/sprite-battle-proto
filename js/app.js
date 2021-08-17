console.log('SPRITE BATTLE')

const hipHop4 = document.getElementById('hip-hop4')

class Sprite {
    constructor (name) {
        this.name = name
        this.type = ['fighter', 'mage'] //stretch: buff stats based on type
        this.level = 1 //stretch: level up to affect stats 
        this.turn = 'p2'
        this.fightDmg = 5
        this.fightCrit = this.fightDmg * 2
        this.spellDmg = 7
        this.spellCrit = this.spellDmg * 2
        this.currentHp = 60
        this.maxHp = 60
        this.currentMp = 30
        this.maxMp = 30
        this.ac = 5
        this.d20 = 0
        this.d8 = 0
        this.sprite1 = document.querySelector('.p1-sprite')
        this.sprite2 = document.querySelector('.p2-sprite')
        this.sprite1Effect = document.querySelector('#p1-effect')
        this.sprite2Effect = document.querySelector('#p2-effect')
        this.sprite1Points = document.querySelector('#p1-sprite-points')
        this.sprite2Points = document.querySelector('#p2-sprite-points')
        this.p1HP = document.getElementById('p1-HP')
        this.p2HP = document.getElementById('p2-HP')
        this.p1MP = document.getElementById('p1-MP')
        this.p2MP = document.getElementById('p2-MP')
        this.weapon = ['sword', 'axe', 'staff'] //to add: modifies fightDmg and spellDmg
    }
    rollD20(num = 1, rollType = ''){
        this.d20 = Math.ceil(Math.random()*20) * num
        console.log(`(${num})d20 ${rollType}: ${this.d20}`) 
    }

    rollD8(num = 1, rollType = ''){
        this.d8 = Math.ceil(Math.random()*8) * num
        console.log(`(${num})d8 ${rollType}: ${this.d8}`)
    }

    updateStats(){
        this.p1HP.innerHTML = `${player1.currentHp}/ ${player1.maxHp}`
        this.p2HP.innerHTML = `${player2.currentHp}/ ${player2.maxHp}`
        this.p1MP.innerHTML = `${player1.currentMp}/ ${player1.maxMp}`
        this.p2MP.innerHTML = `${player2.currentMp}/ ${player2.maxMp}`
    }

    fight(player, opponent, status = 'hit'){
        player.rollD20(1, 'attack roll')
        if((this.d20 >= opponent.ac) && this.d20 !== 20){
            console.log(`${player.name} attacked ${opponent.name} for ${player.fightDmg} damage!`)
            opponent.currentHp -= player.fightDmg
            player.sprite1Points.innerHTML = `-${player.fightDmg}`
            player.sprite2Points.innerHTML = `-${player.fightDmg}`
            this.fightAnimation(player, status)
        } if (this.d20 === 20){
            status = 'crit'
            opponent.currentHp -= player.fightCrit
            console.log(`${player.name} made a critical attack on ${opponent.name} for ${player.fightCrit} damage!`)
            player.sprite1Points.innerHTML = `critical hit!\n-${player.fightCrit}`
            player.sprite2Points.innerHTML = `critical hit!\n-${player.fightCrit}`
            this.fightAnimation(player, status)
        } else if (this.d20 < opponent.ac) {
            console.log(`${player.name} missed!`)
            status = 'miss'
            this.fightAnimation(player, status)
        }
        this.updateStats()
    }

    spell(player, opponent, status = 'hit'){
        player.rollD20(1, 'spell attack roll')
        console.log(`d20 roll: ${this.d20}`)
        if(this.d20 >= opponent.ac && this.d20 !== 20){
            opponent.currentHp -= player.spellDmg
            player.sprite1Points.innerHTML = `-${player.spellDmg}`
            player.sprite2Points.innerHTML = `-${player.spellDmg}`
            player.currentMp -= 5
            // convert console logs to messages in pop-ups
            console.log(`${player.name} cast spell ${opponent.name} for ${player.spellDmg} damage!`)
            this.spellAnimation(player, status)
        } if (this.d20 === 20){
            status = 'crit'
            opponent.currentHp -= player.spellCrit
            player.sprite1Points.innerHTML = `critical hit!\n-${player.spellCrit}`
            player.sprite2Points.innerHTML = `critical hit!\n-${player.spellCrit}`
            console.log(`${player.name} made a critical spell attack on ${opponent.name} for ${player.spellCrit} damage!`)
            player.sprite1Effect
            this.spellAnimation(player, status)
        } else if (this.d20 < opponent.ac) {
            // vvv comment out when finished vvv
            console.log(`${player.name} spell missed!`)
            status = 'miss'
            this.spellAnimation(player, status)
        }
        this.updateStats()
    }
        
    heal(player){
        player.rollD8(1)
        player.currentHp += this.d8*2
        player.sprite1Points.innerHTML = `+${this.d8*2}`
        player.sprite2Points.innerHTML = `+${this.d8*2}`
        // convert console logs to messages in pop-ups and reflect status bars
        console.log(`${player.name} is healed! + ${this.d8*2}`)
        console.log(`p1 HP: ${player1.currentHp}\np1 MP: ${player1.currentMp}`)
        console.log(`p2 HP: ${player2.currentHp}\np2 MP: ${player2.currentMp}`)
        this.healAnimation()
        this.updateStats()
    }

    fightAnimation(player, status){
        if (this.turn === 'p1') {
            if (status == 'hit'){
                this.sprite1.style.animation = "p1-attack 2s"
                this.sprite2Points.style.animation = "p2-hp-points-down 2s"
            } if (status == 'crit'){
                this.sprite1.style.animation = "p1-attack 2s"
                this.sprite2Points.style.animation = "p2-hp-points-down 2s"
                this.sprite2Effect.style.animation = "p2-crit-struck 1s"
            } if (status == 'miss'){
                player.sprite1Points.innerHTML = 'missed'
                player.sprite2Points.innerHTML = 'missed'
                this.sprite1.style.animation = "p1-attack 2s"
                this.sprite2Points.style.animation = "p2-hp-points-down 2s"
            }
        } if (this.turn === 'p2') {
            if (status == 'hit'){
                this.sprite2.style.animation = "p2-attack 2s"
                this.sprite1Points.style.animation = "p1-hp-points-down 2s"
            } if (status == 'crit'){
                this.sprite2.style.animation = "p2-attack 2s"
                this.sprite1Points.style.animation = "p1-hp-points-down 2s"
                this.sprite1Effect.style.animation = "p1-crit-struck 1s"
            } if (status == 'miss'){
                player.sprite2Points.innerHTML = 'missed'
                player.sprite1Points.innerHTML = 'missed'
                this.sprite2.style.animation = "p2-attack 2s"
                this.sprite1Points.style.animation = "p1-hp-points-down 2s"
            }
        }
        this.struckAnimation(status)
        // hipHop4.play()
    }
    
    spellAnimation (player, status) {
        console.log(status, 'status')
        if (this.turn === 'p1') {
            if (status == 'hit'){
                this.sprite1.style.animation = "p1-spell 2s"
                this.sprite1Effect.style.animation = "p1-spell-effect 2s ease-in"
                this.sprite2Effect.style.animation = "p2-spell-struck 2s"
                this.sprite2Points.style.animation = "p2-hp-points-down 2s"
                this.struckAnimation(status)
            } if (status == 'miss') {
                player.sprite1Points.innerHTML = 'missed'
                player.sprite2Points.innerHTML = 'missed'
                this.sprite1.style.animation = "p1-spell 2s"
                this.sprite1Effect.style.animation = "p1-spell-effect 2s ease-in"
                this.sprite2Points.style.animation = "p2-hp-points-down 2s"
            }
        } if (this.turn === 'p2') {
            this.sprite2.style.animation = "p2-spell 2s"
            this.sprite2Effect.style.animation = "p1-spell-effect 2s ease-in"
            if (status == 'hit'){
                this.sprite2.style.animation = "p2-spell 2s"
                this.sprite1Points.style.animation = "p1-hp-points-down 2s"
                this.sprite1Effect.style.animation = "p1-spell-struck 2s"
            } if (status == 'miss'){
                player.sprite2Points.innerHTML = 'missed'
                player.sprite1Points.innerHTML = 'missed'
                this.sprite2.style.animation = "p2-spell 2s"
                this.sprite1Points.style.animation = "p1-hp-points-down 2s"
            }
        }
        this.struckAnimation(status)
        if(player1.currentHp <= 0) {
            this.sprite2.style.animation = "p1-death 500ms"
            this.sprite1.src = "../gifs/Martial-Hero-dead.gif"
        } if (player2.currentHp <= 0) {
            this.sprite2.style.animation = "p2-death 2s"
            // this.sprite2.src = "../gifs/Wizard-death.gif"
        }
        // hipHop4.play()
    }
    
    healAnimation () {
        if (this.turn === 'p1') {
            this.sprite1.style.animation = "p1-heal 2s ease-in"
            this.sprite1Effect.style.animation = "p1-heal-effect 1s ease-in"
            this.sprite1Points.style.animation = "p1-hp-points-up 2s"
        } if (this.turn === 'p2') {
            this.sprite2.style.animation = "p2-heal 2s ease-in"
            this.sprite2Effect.style.animation = "p2-heal-effect 2s ease-in"
            this.sprite2Points.style.animation = "p2-hp-points-up 2s"
            }
            // hipHop4.play()
        }
    struckAnimation (status) {
        if (status == 'hit' || status == 'crit'){
            if (this.turn == 'p2') {
                this.sprite1.style.animation = "p1-struck 500ms"
            }
            if (this.turn == 'p1') {
                this.sprite2.style.animation = "p2-struck 500ms"
            }
         }
    }
}

//instantiate players
const player1 = new Sprite ('player1')
const player2 = new Sprite ('player2')


function introSequence(){
    
}


function choosePlayerType(){
    const p1 = document.getElementById('#p1TypeMenu')
    const p2 = document.getElementById('#p2TypeMenu')
    const p1ChoiceText = p1.options[p1.selectedIndex].text
    const p2ChoiceText  = p2.options[p2.selectedIndex].text
    player1.type = p1ChoiceText
    player2.type = p2ChoiceText
    // const e = document.getElementById("elementId");
    // const value = e.options[e.selectedIndex].value;
}

function battle(){

}

function winSequence(){

}

// initGame()

// console log section


// temp game conditionals
// if(player1.currentHp <= 0) {
//     this.sprite1.style.animation = "p1-death 2s ease-in"
// } if (player2.currentHp <= 0) {
//     this.sprite2.style.animation = "p2-death 2s ease-in"
// }

// event handlers
document.getElementById('p1-fight-button').addEventListener('click', ()=>{player1.fight(player1, player2)}, ()=>{player1.fightAnimation()})
document.getElementById('p1-spell-button').addEventListener('click', ()=>{player1.spell(player1, player2)}, ()=>{player1.spellAnimation()} )
document.getElementById('p1-heal-button').addEventListener('click', ()=>{player1.heal(player1)}, ()=>{player1.healAnimation()} )
document.getElementById('p2-fight-button').addEventListener('click', ()=>{player2.fight(player2, player1)}, ()=>{player2.fightAnimation()} )
document.getElementById('p2-spell-button').addEventListener('click', ()=>{player2.spell(player2, player1)}, ()=>{player2.spellAnimation()} )
document.getElementById('p2-heal-button').addEventListener('click', ()=>{player2.heal(player2), ()=>{player2.healAnimation()} })
document.getElementById('test-button').addEventListener('click', ()=>{console.log('test button')})




// notes
// https://stackoverflow.com/questions/31565045/toggle-background-image-html

// js toggle class
// document.body.classList.toggle('BgClass') 

// css background
// body {
//     background-size: cover; 
//     background-repeat: no-repeat;  
//     background-attachment: fixed 
//   }
// .BgClass {
//     background-image: url('http://freedomwallpaper.com/wallpaper2/funky-wallpaper-hd.jpg');
// }





