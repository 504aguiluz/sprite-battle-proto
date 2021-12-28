console.log('SPRITE BATTLE')
// mp3s
const hipHop7 = document.getElementById('hip-hop7')
const hipHop2 = document.getElementById('hip-hop2')
const deathSFX = document.getElementById('death-sfx')
const swordHitSFX = document.getElementById('sword-hit-sfx')
const swordCritSFX = document.getElementById('sword-crit-sfx')
const swordMissSFX = document.getElementById('sword-miss-sfx')
const swordDramaSFX = document.getElementById('sword-drama-sfx')
const explosionSFX = document.getElementById('explosion-sfx')
const frostbiteSFX = document.getElementById('frostbite-sfx')
const heal1SFX = document.getElementById('heal1-sfx')
const heal2SFX = document.getElementById('heal2-sfx')

// visual element tags
const announceBar = document.getElementById('announce-bar')
const bkgImg = document.getElementById('bkg-img')
const hideToggle = document.getElementsByClassName('hide')
const fightNowBtn = document.getElementById('fight-now-button')
const fightAgainBtn = document.getElementById('fight-again-button')

// randomization
const playerArr = ['p1', 'p2']
const randomPlayer = (value)=>{
    let item = value[Math.floor(Math.random()*value.length)]
    return item
}
let turn = randomPlayer(playerArr)
console.log(turn)


// set default volume
let defVolume = document.querySelectorAll('audio')
let muteToggle = document.getElementById('mute')

for(let i = 0; i < defVolume.length; i++){
    defVolume[i].volume = 0.1
    // toggle mute
    muteToggle.control.checked ? defVolume[i].muted = true : defVolume[i].muted = false
}

// volume control
let slider = document.querySelector('#vol-control')

slider.onchange = (e) => {
    let audio = document.querySelectorAll('audio')
    console.log(audio)
    console.log('slider value: ' + slider.value)
    for (let i = 0; i < audio.length; i++) {
        audio[i].volume = slider.value
    }

}

// sprite class======================================================
class Sprite {
    constructor (name, type) {
        this.name = name
        this.type = type //stretch: buff stats based on type
        this.level = 1 //stretch: level up to affect stats 
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
        this.sprite1 = document.querySelector('#p1-sprite')
        this.sprite2 = document.querySelector('#p2-sprite')
        this.sprite1Effect = document.querySelector('#p1-effect')
        this.sprite2Effect = document.querySelector('#p2-effect')
        this.sprite1Points = document.querySelector('#p1-sprite-points')
        this.sprite2Points = document.querySelector('#p2-sprite-points')
        this.p1HP = document.getElementById('p1-HP')
        this.p2HP = document.getElementById('p2-HP')
        this.p1MP = document.getElementById('p1-MP')
        this.p2MP = document.getElementById('p2-MP')
        this.p1BattleMenuNodes = document.getElementById('p1-battle-menu').getElementsByTagName('*')
        this.p1BattleMenu = document.getElementById('p1-battle-menu')
        this.p2BattleMenuNodes = document.getElementById('p2-battle-menu').getElementsByTagName('*')
        this.p2BattleMenu = document.getElementById('p2-battle-menu')
        this.weapon = ['sword', 'axe', 'staff'] //to add: modifies fightDmg and spellDmg
    }

    // d20 roll======================================================
    rollD20(num = 1, rollType = ''){
        this.d20 = Math.ceil(Math.random()*20) * num
        console.log(`(${num})d20 ${rollType}: ${this.d20}`) 
    }

    //d8 roll ======================================================
    rollD8(num = 1, rollType = ''){
        this.d8 = Math.ceil(Math.random()*8) * num
        console.log(`(${num})d8 ${rollType}: ${this.d8}`)
    }

    // updates stats in window======================================================
    updateStats(){
        this.minMaxStats()
        this.p1HP.innerHTML = `${player1.currentHp}/ ${player1.maxHp}`
        this.p2HP.innerHTML = `${player2.currentHp}/ ${player2.maxHp}`
        this.p1MP.innerHTML = `${player1.currentMp}/ ${player1.maxMp}`
        this.p2MP.innerHTML = `${player2.currentMp}/ ${player2.maxMp}`
        this.checkDeath()
    }

    // battle options======================================================
    fight(player, opponent, status = 'hit'){
        // this.toggleBattleMenus()
        player.rollD20(1, 'attack roll')
        player.fightAnimation(player, status)
        if((this.d20 >= opponent.ac) && this.d20 !== 20){
            opponent.currentHp -= player.fightDmg
            player.sprite1Points.innerHTML = `-${player.fightDmg}`
            player.sprite2Points.innerHTML = `-${player.fightDmg}`
        } else if (this.d20 === 20){
            status = 'crit'
            opponent.currentHp -= player.fightCrit
            player.sprite1Points.innerHTML = `critical hit!\n-${player.fightCrit}`
            player.sprite2Points.innerHTML = `critical hit!\n-${player.fightCrit}`
            // player.fightAnimation(player, status)
        } else if (this.d20 < opponent.ac) {
            status = 'miss'
            // player.fightAnimation(player, status)
        }
        this.updateStats()
    }

    spell(player, opponent, status = 'hit'){
        player.rollD20(1, 'spell attack roll')
        console.log(`d20 roll: ${this.d20}`)
        player.spellAnimation(player, status)
        if(this.d20 >= opponent.ac && this.d20 !== 20 && player.currentMp > 0){
            opponent.currentHp -= player.spellDmg
            player.sprite1Points.innerHTML = `-${player.spellDmg}`
            player.sprite2Points.innerHTML = `-${player.spellDmg}`
            player.currentMp -= 5
        } else if (this.d20 === 20 && player.currentMp > 0){
            player.spellAnimation(player, status)
            status = 'crit'
            opponent.currentHp -= player.spellCrit
            player.sprite1Points.innerHTML = `critical hit!\n-${player.spellCrit}`
            player.sprite2Points.innerHTML = `critical hit!\n-${player.spellCrit}`
            player.sprite1Effect
        } else if (this.d20 < opponent.ac) {
            status = 'miss'
            // player.spellAnimation(player, status)
        } else if (player.currentMp <= 0) {
            player.announceSomething(`Not enough MP!`)
        }
        this.updateStats()
    }
        
    heal(player){
        player.rollD8(1)
        player.currentHp += this.d8*2
        player.sprite1Points.innerHTML = `+${this.d8*2}`
        player.sprite2Points.innerHTML = `+${this.d8*2}`
        player.currentMp -= 5
        player.healAnimation()
        this.updateStats()
    }

    // animation methods======================================================
    fightAnimation(player, status){
        if (turn === 'p1') {
            if (status == 'hit'){
                swordHitSFX.play()
                player.sprite2Points.style.animation = "p2-hp-points-down 2s"
                player.sprite1.style.animation = "p1-attack 2s"
            } else if (status == 'crit'){
                swordCritSFX.play()
                player.sprite2Points.style.animation = "p2-hp-points-down 2s"
                player.sprite1.style.animation = "p1-attack 2s"
                player.sprite2Effect.style.animation = "p2-crit-struck 1s"
            } else if (status == 'miss'){
                swordMissSFX.play()
                player.sprite2Points.style.animation = "p2-hp-points-down 2s"
                player.sprite1Points.innerHTML = 'missed'
                player.sprite2Points.innerHTML = 'missed'
                player.sprite1.style.animation = "p1-attack 2s"
            }
        } else if (turn === 'p2') {
            if (status == 'hit'){
                swordDramaSFX.play()
                player.sprite1Points.style.animation = "p1-hp-points-down 2s"
                player.sprite2.style.animation = "p2-attack 2s"
            } else if (status == 'crit'){
                swordDramaSFX.play()
                player.sprite1Points.style.animation = "p1-hp-points-down 2s"
                player.sprite2.style.animation = "p2-attack 2s"
                this.sprite1Effect.style.animation = "p1-crit-struck 1s"
            } else if (status == 'miss'){
                swordMissSFX.play()
                player.sprite1Points.style.animation = "p1-hp-points-down 2s"
                player.sprite2Points.innerHTML = 'missed'
                player.sprite1Points.innerHTML = 'missed'
                player.sprite2.style.animation = "p2-attack 2s"
            }
        }
        this.struckAnimation(player, status)
    }
    
    spellAnimation (player, status) {
        console.log(status, 'status')
        if (turn === 'p1') {
            this.announceSomething('Fireball', '2s')
            explosionSFX.play()
            if (status == 'hit'){
                player.sprite2Points.style.animation = "p2-hp-points-down 2s"
                player.sprite1.style.animation = "p1-spell 2s"
                player.sprite1Effect.style.animation = "p1-spell-effect 2s ease-in"
                player.sprite2Effect.style.animation = "p2-spell-struck 2s"
                player.struckAnimation(status)
            } else if (status == 'miss') {
                player.sprite2Points.style.animation = "p2-hp-points-down 2s"
                player.sprite1Points.innerHTML = 'missed'
                player.sprite2Points.innerHTML = 'missed'
                player.sprite1.style.animation = "p1-spell 2s"
                player.sprite1Effect.style.animation = "p1-spell-effect 2s ease-in"
            } 
        } else if (turn === 'p2') {
            frostbiteSFX.play()
            player.announceSomething('Frostbite', '2s')
            player.sprite2.style.animation = "p2-spell 2s"
            player.sprite2Effect.style.animation = "p1-spell-effect 2s ease-in"
            if (status == 'hit'){
                player.sprite2.style.animation = "p2-spell 2s"
                player.sprite1Points.style.animation = "p1-hp-points-down 2s"
                player.sprite1Effect.style.animation = "p1-spell-struck 2s"
            } else if (status == 'miss'){
                player.sprite2Points.innerHTML = 'missed'
                player.sprite1Points.innerHTML = 'missed'
                player.sprite2.style.animation = "p2-spell 2s"
                player.sprite1Points.style.animation = "p1-hp-points-down 2s"
            }
        }
        this.struckAnimation(player, status)
    }
    
    healAnimation () {
        if (turn === 'p1') {
            heal1SFX.play()
            this.sprite1.style.animation = "p1-heal 2s ease-in"
            this.sprite1Effect.style.animation = "p1-heal-effect 1s ease-in"
            this.sprite1Points.style.animation = "p1-hp-points-up 2s"
        } else if (turn === 'p2') {
            heal1SFX.play()
            this.sprite2.style.animation = "p2-heal 2s ease-in"
            this.sprite2Effect.style.animation = "p2-heal-effect 2s ease-in"
            this.sprite2Points.style.animation = "p2-hp-points-up 2s"
            }
    }
    
    struckAnimation (player, status) {
        if (status == 'hit' || status == 'crit'){
            if (turn == 'p2') {
                player.sprite1.style.animation = "p1-struck 500ms"
            } else if (turn == 'p1') {
                player.sprite2.style.animation = "p2-struck 500ms"
            }
         }
    }

    // toggles visibility and utilization of player battle menus===================
    toggleBattleMenus (){
        if (turn == 'p1'){
            this.p1BattleMenu.disabled = false
            this.p2BattleMenu.disabled = true
            this.p2BattleMenu.style.visibility = 'hidden'
            this.p1BattleMenu.style.visibility = 'visible'
        } else if (turn == 'p2'){
            this.p2BattleMenu.disabled = false
            this.p1BattleMenu.disabled = true
            this.p1BattleMenu.style.visibility = 'hidden'
            this.p2BattleMenu.style.visibility = 'visible'
        } else if (player1.currentHp <= 0 || player2.currentHp <= 0){
            this.p1BattleMenu.style.visibility = 'hidden'
            this.p2BattleMenu.style.visibility = 'hidden'
        } else if (turn == ''){
            this.p1BattleMenu.style.visibility = 'hidden'
            this.p2BattleMenu.style.visibility = 'hidden'
        }
    }
    // sets boundaries of HP and MP - I need to dry this==========================
    minMaxStats(){ //DRY THIS CODE!!! 
        if (player1.currentHp <= 0){
            player1.currentHp = 0
        } if (player1.currentHp >= player1.maxHp) {
            player1.currentHp = player1.maxHp
        } if (player1.currentMp <= 0) {
            player1.currentMp = 0
        } if (player1.currentMp >= player1.maxMp) {
            player1.currentMp = player1.maxMp
        } if (player2.currentHp <= 0){
            player2.currentHp = 0
        } if (player2.currentHp >= player2.maxHp) {
            player2.currentHp = player2.maxHp
        } if (player2.currentMp <= 0) {
            player2.currentMp = 0
        } if (player2.currentMp >= player2.maxMp) {
            player2.currentMp = player2.maxMp
        }
    }
    // checks if anyone has died each round; if so, prompts restart===============
    checkDeath(){
        if(player1.currentHp <= 0) {
            announceBar.style.opacity = '0.9'
            hipHop7.pause()
            deathSFX.play()
            this.sprite1.style.animation = "p1-death 500ms"
            this.announceSomething(`${player1.name} the ${player1.type} has been defeated!`, '10s')
            this.sprite1.src = "./gifs/Martial-Hero-dead.gif"
            this.fightAgainPrompt()
        } if (player2.currentHp <= 0) {
            announceBar.style.opacity = '0.9'
            hipHop7.pause()
            hipHop2.pause()
            deathSFX.play()
            this.sprite2.style.animation = "p2-death 2s"
            this.sprite2.src = "./gifs/Wizard-dead.gif"
            this.announceSomething(`${player2.name} the ${player2.type} has been defeated!`, '10s')
            this.fightAgainPrompt()
        } else {
            this.switchTurn()
        }
    }
    // used to announce something in the announce bar===========================
    announceSomething (text, duration = '3s'){
        announceBar.innerHTML = text
        announceBar.style.animation = `announce ${duration}`
    }
    // switches turns
    switchTurn(){ 
        if (turn === 'p1'){
            turn = 'p2'
        } else if (turn === 'p2'){
            turn = 'p1'
        }
        console.log(`${turn}'s turn`)
        this.toggleBattleMenus()
    }
    // start battle button======================================================
    fightNow(){
        announceBar.style.opacity = 0
        fightNowBtn.style.opacity = 0
        changeVisibility(hideToggle, 'visible')
        this.toggleBattleMenus()
        if (turn == 'p1'){
            hipHop7.play()
            bkgImg.src = './img/snow-field.jpeg'
            // this.announceSomething(`${player1.name}'s level`) // announces level
        } else if (turn == 'p2'){
            hipHop2.play()
            bkgImg.src = './img/buddhist-volcano.png'
            // this.announceSomething(`${player2.name}'s level`) // announces level
        }
    }
    // sets restart prompt======================================================
    fightAgainPrompt(){
        fightAgainBtn.disabled = false
        fightAgainBtn.style.opacity = 0.9
    }
}

//instantiate players======================================================
const player1 = new Sprite ('Musashi', 'warrior')
const player2 = new Sprite ('Gilfoyle', 'cleric')

//global functions==========================================================
function introScreen(){
    announceBar.style.opacity = 0.9
    fightNowBtn.style.opacity = 0.9
    changeVisibility(hideToggle, 'hidden')
}

function changeVisibility(element, visibility){
    [].forEach.call(element, function (el) {el.style.visibility = visibility});
}
function changeOpacity(element, opacity){
    [].forEach.call(element, function (el) {el.style.opacity = opacity});
}

// event handlers===========================================================
window.addEventListener('load', ()=>{
    console.log('page has loaded')
    introScreen()
})
document.getElementById('p1-fight-button').addEventListener('click', ()=>{player1.fight(player1, player2)})
document.getElementById('p1-spell-button').addEventListener('click', ()=>{player1.spell(player1, player2)})
document.getElementById('p1-heal-button').addEventListener('click', ()=>{player1.heal(player1)})
document.getElementById('p2-fight-button').addEventListener('click', ()=>{player2.fight(player2, player1)})
document.getElementById('p2-spell-button').addEventListener('click', ()=>{player2.spell(player2, player1)})
document.getElementById('p2-heal-button').addEventListener('click', ()=>{player2.heal(player2)})
document.getElementById('fight-now-button').addEventListener('click', ()=>{player1.fightNow()}, ()=>{console.log('play game')})
document.getElementById('fight-again-button').addEventListener('click', ()=>{location.reload()})
document.getElementById('mute').addEventListener('click', ()=>{for(let i = 0; i < defVolume.length; i++){
        if(muteToggle.control.checked){
            defVolume[i].muted = true
        } else {
            defVolume[i].muted = false
        }
    }
})

// notes=====================================================================
// how to toggle bkg imgs
// https://stackoverflow.com/questions/31565045/toggle-background-image-html

//how to reset all animations by class
// //https://css-tricks.com/restart-css-animation/

