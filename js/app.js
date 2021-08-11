console.log('SPRITE BATTLE')

class Sprite {
    constructor (name) {
        this.name = name
        this.type = ['fighter', 'mage'] //to add: buff stats based on type
        this.level = 1 //to add: level up to affect stats 
        this.fightDmg = 5
        this.fightCrit = this.fightDmg * 2
        this.spellDmg = 7
        this.spellCrit = this.spellDmg * 2
        this.currentHp = 60
        this.maxHp = 60
        this.currentMp = 30
        this.maxMp = 30
        this.ac = 10
        this.d20 = 0
        this.d8 = 0
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

    fight(player, opponent){
            player.rollD20(1, 'attack roll')
            if((this.d20 >= opponent.ac) && this.d20 !== 20){
                console.log(`${player.name} attacked ${opponent.name} for ${player.fightDmg} damage!`)
                opponent.currentHp -= player.fightDmg
                // console.log(`p2's HP is now:${player2.currentHp}`)
                console.log(`p1 HP: ${player1.currentHp}/${player1.maxHp}\np1 MP: ${player1.currentMp}/${player1.maxMp}`)
                console.log(`p2 HP: ${player2.currentHp}/${player2.maxHp}\np1 MP: ${player2.currentMp}/${player2.maxMp}`)
            } if (this.d20 === 20){
                opponent.currentHp -= player.fightCrit
                console.log(`${player.name} made a critical attack on ${opponent.name} for ${player.fightCrit} damage!`)
                // console.log(`p2's HP is now:${player2.currentHp}`)
                console.log(`p1 HP: ${player1.currentHp}/${player1.maxHp}\np1 MP: ${player1.currentMp}/${player1.maxMp}`)
                console.log(`p2 HP: ${player2.currentHp}/${player2.maxHp}\np1 MP: ${player2.currentMp}/${player2.maxMp}`)
            } else if (this.d20 < opponent.ac) {
                console.log(`${player.name} missed!`)
            }
    }

    spell(player, opponent){
            player.rollD20(1, 'spell attack roll')
            console.log(`d20 roll: ${this.d20}`)
            if(this.d20 >= opponent.ac && this.d20 !== 20){
                console.log(`p1 cast spell on p2 for ${player.spellDmg} damage!`)
                opponent.currentHp -= player.spellDmg
                player.currentMp -= 5
                console.log(`p1 HP: ${player1.currentHp}\np1 MP: ${player1.currentMp}`)
                console.log(`p2 HP: ${player2.currentHp}\np2 MP: ${player2.currentMp}`)
            } if (this.d20 === 20){
                opponent.currentHp -= player.spellCrit
                console.log(`${player.name} made a critical spell attack on ${opponent.name} for ${player.spellCrit} damage!`)
                // console.log(`p2's HP is now:${player2.currentHp}`)
                console.log(`p1 HP: ${player1.currentHp}/${player1.maxHp}\np1 MP: ${player1.currentMp}/${player1.maxMp}`)
                console.log(`p2 HP: ${player2.currentHp}/${player2.maxHp}\np1 MP: ${player2.currentMp}/${player2.maxMp}`)
            } else if (this.d20 < opponent.ac) {
                console.log(`${player.name} spell missed!`)
            }
    }

    heal(player){
        player.rollD8(1)
        console.log(`${player.name} is healed! + ${this.d8}`)
        player.currentHp += this.d8
        console.log(`p1 HP: ${player1.currentHp}\np1 MP: ${player1.currentMp}`)
        console.log(`p2 HP: ${player2.currentHp}\np2 MP: ${player2.currentMp}`)
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
console.log(`STARTING STATS\np1 HP: ${player1.currentHp}/${player1.maxHp}\np1 MP: ${player1.currentMp}/${player1.maxMp}\np2 HP: ${player2.currentHp}/${player2.maxHp}\np1 MP: ${player2.currentMp}/${player2.maxMp}`)


// event handlers
document.getElementById('p1-fight-button').addEventListener('click', ()=>{player1.fight(player1, player2)})
document.getElementById('p1-spell-button').addEventListener('click', ()=>{player1.spell(player1, player2)})
document.getElementById('p1-heal-button').addEventListener('click', ()=>{player1.heal(player1)})
document.getElementById('p2-fight-button').addEventListener('click', ()=>{player2.fight(player2, player1)})
document.getElementById('p2-spell-button').addEventListener('click', ()=>{player2.spell(player2, player1)})
document.getElementById('p2-heal-button').addEventListener('click', ()=>{player2.heal(player2)})

