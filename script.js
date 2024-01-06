let xp = 0;
let health = 100;
let gold = 50;
let currentWeapon = 0;
let fighting;
let monsterHealth;
let inventory = ["pau"];

const button1 = document.querySelector('#button1');
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const monsterStats = document.querySelector("#monsterStats");
const monsterName = document.querySelector("#monsterName");
const monsterHealthText = document.querySelector("#monsterHealth");
const weapons = [
  { name: 'pau', power: 5 },
  { name: 'punhal', power: 30 },
  { name: 'martelo de garra', power: 50 },
  { name: 'espada', power: 100 }
];
const monsters = [
  {
    name: "slime",
    level: 2,
    health: 15
  },
  {
    name: "fanged beast",
    level: 8,
    health: 60
  },
  {
    name: "dragon",
    level: 20,
    health: 500
  }
]
const locations = [
  {
    name: "torre",
    "button text": ["Loja", "Caverna", "Lutar c/dragão"],
    "button functions": [goStore, goCave, fightDragon],
    text: "Você esta na torre"
  },
  {
    name: "store",
    "button text": ["compre 10 de saúde(10 gold)", "Compre armas (30 gold)", "Torre"],
    "button functions": [buyHealth, buyWeapon, goTown],
    text: "You enter the store."
  },
  {
    name: "cave",
    "button text": ["lutar c/slime", "lutar c/besta", "Ir para torre"],
    "button functions": [fightSlime, fightBeast, goTown],
    text: "Você entrou na caverna, está cheio de monstros."
  },
  {
    name: "fight",
    "button text": ["Attack", "defesa", "correr"],
    "button functions": [attack, dodge, goTown],
    text: "Você esta lutando com um monstro."
  },
  {
    name: "kill monster",
    "button text": ["torre", "torre", "Ir para torre"],
    "button functions": [goTown, goTown, goTown],
    text: 'O monstro grita "Arg!" à medida que morre. Você ganha pontos de experiência e encontra ouro.'
  },
  {
    name: "lose",
    "button text": ["Denovo", "Denovo", "Denovo"],
    "button functions": [restart, restart, restart],
    text: "You die. ☠️"
  },
  { 
    name: "win", 
    "button text": ["Denovo", "Denovo", "Denovo"], 
    "button functions": [restart, restart, restart], 
    text: "Você derrota o dragão! VOCÊ GANHOU O JOGO! 🎉" 
  },
  {
    name: "easter egg",
    "button text": ["2", "8", "Ir para torre"],
    "button functions": [pickTwo, pickEight, goTown],
    text: "Yvocê encontra um jogo secreto. Escolha um número acima. Dez números serão escolhidos aleatoriamente entre 0 e 10. Se o número escolhido corresponder a um dos números aleatórios, você ganha!"
  }
];

// initialize buttons
button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;

function update(location) {
  monsterStats.style.display = "none";
  button1.innerText = location["button text"][0];
  button2.innerText = location["button text"][1];
  button3.innerText = location["button text"][2];
  button1.onclick = location["button functions"][0];
  button2.onclick = location["button functions"][1];
  button3.onclick = location["button functions"][2];
  text.innerText = location.text;
}

function goTown() {
  update(locations[0]);
}

function goStore() {
  update(locations[1]);
}

function goCave() {
  update(locations[2]);
}

function buyHealth() {
  if (gold >= 10) {
    gold -= 10;
    health += 10;
    goldText.innerText = gold;
    healthText.innerText = health;
  } else {
    text.innerText = "Você não tem ouro suficiente para comprar saúde.";
  }
}

function buyWeapon() {
  if (currentWeapon < weapons.length - 1) {
    if (gold >= 30) {
      gold -= 30;
      currentWeapon++;
      goldText.innerText = gold;
      let newWeapon = weapons[currentWeapon].name;
      text.innerText = "Você agora tem uma " + newWeapon + ".";
      inventory.push(newWeapon);
      text.innerText += " em seu inventario: " + inventory;
    } else {
      text.innerText = "You do not have enough gold to buy a weapon.";
    }
  } else {
    text.innerText = "Você já tem a arma mais poderosa!";
    button2.innerText = "Venda arma por 10 ouro";
    button2.onclick = sellWeapon;
  }
}

function sellWeapon() {
  if (inventory.length > 1) {
    gold += 10;
    goldText.innerText = gold;
    let currentWeapon = inventory.shift();
    text.innerText = "Você vendeu uma " + currentWeapon + ".";
    text.innerText += " No seu inventario tem: " + inventory;
  } else {
    text.innerText = "Não venda sua única arma!";
  }
}

function fightSlime() {
  fighting = 0;
  goFight();
}

function fightBeast() {
  fighting = 1;
  goFight();
}

function fightDragon() {
  fighting = 2;
  goFight();
}

function goFight() {
  update(locations[3]);
  monsterHealth = monsters[fighting].health;
  monsterStats.style.display = "block";
  monsterName.innerText = monsters[fighting].name;
  monsterHealthText.innerText = monsterHealth;
}

function attack() {
  text.innerText = "O" + monsters[fighting].name + " Ataca.";
  text.innerText += " Você ataca com sua " + weapons[currentWeapon].name + ".";
  health -= getMonsterAttackValue(monsters[fighting].level);
  if (isMonsterHit()) {
    monsterHealth -= weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1;    
  } else {
    text.innerText += " Você sente falta.";
  }
  healthText.innerText = health;
  monsterHealthText.innerText = monsterHealth;
  if (health <= 0) {
    lose();
  } else if (monsterHealth <= 0) {
    fighting === 2 ? winGame() : defeatMonster();
  }
  if (Math.random() <= .1 && inventory.length !== 1) {
    text.innerText += " Sua " + inventory.pop() + " quebrou.";
    currentWeapon--;
  }
}

function getMonsterAttackValue(level) {
  const hit = (level * 5) - (Math.floor(Math.random() * xp));
  console.log(hit);
  return hit > 0 ? hit : 0;
}

function isMonsterHit() {
  return Math.random() > .2 || health < 20;
}

function dodge() {
  text.innerText = "Você defendeu o ataque da(o) " + monsters[fighting].name;
}

function defeatMonster() {
  gold += Math.floor(monsters[fighting].level * 6.7);
  xp += monsters[fighting].level;
  goldText.innerText = gold;
  xpText.innerText = xp;
  update(locations[4]);
}

function lose() {
  update(locations[5]);
}

function winGame() {
  update(locations[6]);
}

function restart() {
  xp = 0;
  health = 100;
  gold = 50;
  currentWeapon = 0;
  inventory = ["pau"];
  goldText.innerText = gold;
  healthText.innerText = health;
  xpText.innerText = xp;
  goTown();
}

function easterEgg() {
  update(locations[7]);
}

function pickTwo() {
  pick(2);
}

function pickEight() {
  pick(8);
}

function pick(guess) {
  const numbers = [];
  while (numbers.length < 10) {
    numbers.push(Math.floor(Math.random() * 11));
  }
  text.innerText = "Você escolheu " + guess + ". Aqui estão os números aleatórios:\n";
  for (let i = 0; i < 10; i++) {
    text.innerText += numbers[i] + "\n";
  }
  if (numbers.indexOf(guess) !== -1) {
    text.innerText += "Certo! Você ganhou 20 ouro!";
    gold += 20;
    goldText.innerText = gold;
  } else {
    text.innerText += "Errado! Você perdeu 10 de saúde!";
    health -= 10;
    healthText.innerText = health;
    if (health <= 0) {
      lose();
    }
  }
}