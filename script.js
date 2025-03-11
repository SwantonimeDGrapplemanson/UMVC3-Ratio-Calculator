const characterData = {
    "Akuma": { ratio: 4, image: "images/AKUMA.jpg" },
    "Amaterasu": { ratio: 3, image: "images/AMATERASU.jpg" },
    "Arthur": { ratio: 2, image: "images/ARTHUR.jpg" },
    "C.Viper": { ratio: 3, image: "images/C.VIPER.jpg" },
    "Captain America": { ratio: 4, image: "images/CAPTAIN AMERICA.jpg" },
    "Chun-Li": { ratio: 2, image: "images/CHUN-LI.jpg" },
    "Chris": { ratio: 3, image: "images/CHRIS.jpg" },
    "Dante": { ratio: 5, image: "images/DANTE.jpg" },
    "Deadpool": { ratio: 4, image: "images/DEADPOOL.jpg" },
    "Doctor Doom": { ratio: 6, image: "images/DOCTOR DOOM.jpg" },
    "Doctor Strange": { ratio: 4, image: "images/DOCTOR STRANGE.jpg" },
    "Dormammu": { ratio: 5, image: "images/DORMAMMU.jpg" },
    "Felicia": { ratio: 2, image: "images/FELICIA.jpg" },
    "Firebrand": { ratio: 3, image: "images/FIREBRAND.jpg" },
    "Frank West": { ratio: 2, image: "images/FRANK WEST.jpg" },
    "Ghost Rider": { ratio: 1, image: "images/GHOST RIDER.jpg" },
    "Haggar": { ratio: 4, image: "images/HAGGAR.jpg" },
    "Hawkeye": { ratio: 4, image: "images/HAWKEYE.jpg" },
    "Hsien-Ko": { ratio: 1, image: "images/HSIEN-KO.jpg" },
    "Hulk": { ratio: 3, image: "images/HULK.jpg" },
    "Iron Fist": { ratio: 2, image: "images/IRON FIST.jpg" },
    "Iron Man": { ratio: 2, image: "images/IRON MAN.jpg" },
    "Jill": { ratio: 1, image: "images/JILL.jpg" },
    "Magneto": { ratio: 5, image: "images/MAGNETO.jpg" },
    "MODOK": { ratio: 3, image: "images/MODOK.jpg" },
    "Morrigan": { ratio: 7, image: "images/MORRIGAN.jpg" },
    "Nemesis": { ratio: 2, image: "images/NEMESIS.jpg" },
    "Nova": { ratio: 6, image: "images/NOVA.jpg" },
    "Phoenix": { ratio: 6, image: "images/PHOENIX.jpg" },
    "Phoenix Wright": { ratio: 1, image: "images/PHOENIX WRIGHT.jpg" },
    "Rocket Raccoon": { ratio: 3, image: "images/ROCKET RACCOON.jpg" },
    "Ryu": { ratio: 2, image: "images/RYU.jpg" },
    "Sentinel": { ratio: 4, image: "images/SENTINEL.jpg" },
    "She-Hulk": { ratio: 1, image: "images/SHE-HULK.jpg" },
    "Shuma-Gorath": { ratio: 3, image: "images/SHUMA-GORATH.jpg" },
    "Spencer": { ratio: 6, image: "images/SPENCER.jpg" },
    "Spider-Man": { ratio: 3, image: "images/SPIDER-MAN.jpg" },
    "Storm": { ratio: 2, image: "images/STORM.jpg" },
    "Strider Hiryu": { ratio: 5, image: "images/STRIDER HIRYU.jpg" },
    "Super-Skrull": { ratio: 3, image: "images/SUPER-SKRULL.jpg" },
    "Taskmaster": { ratio: 2, image: "images/TASKMASTER.jpg" },
    "Thor": { ratio: 2, image: "images/THOR.jpg" },
    "Trish": { ratio: 2, image: "images/TRISH.jpg" },
    "Tron Bonne": { ratio: 2, image: "images/TRON BONNE.jpg" },
    "Vergil": { ratio: 9, image: "images/VERGIL.jpg" },
    "Viewtiful Joe": { ratio: 2, image: "images/VIEWTIFUL JOE.jpg" },
    "Wesker": { ratio: 4, image: "images/WESKER.jpg" },
    "Wolverine": { ratio: 3, image: "images/WOLVERINE.jpg" },
    "X-23": { ratio: 2, image: "images/X-23.jpg" },
    "Zero": { ratio: 7, image: "images/ZERO.jpg" },
};

let playerTeams = {
    1: { slot1: null, slot2: null, slot3: null, teamRatio: 0, maxRatio: 10, addBan: null, subBan: null, pickedCharacters: new Set() },
    2: { slot1: null, slot2: null, slot3: null, teamRatio: 0, maxRatio: 10, addBan: null, subBan: null, pickedCharacters: new Set() }
};

let currentPlayer = 1;
let bansEnabled = false;

function createCharacterPool() {
    const poolDiv = document.querySelector('.character-pool');
    poolDiv.innerHTML = '';

    for (const charName in characterData) {
        const charButton = document.createElement('button');
        charButton.classList.add('character-button');
        charButton.dataset.character = charName;
        charButton.textContent = `${charName} (${characterData[charName].ratio})`;
        charButton.addEventListener('click', handleCharacterClick);
        poolDiv.appendChild(charButton);
    }
    updateVergilDisplay();
    updateBanUI();
}

function handleCharacterClick(event) {
    const character = event.currentTarget.dataset.character;
    const ctrlKey = event.ctrlKey;
    const shiftKey = event.shiftKey;
    const button = event.currentTarget;

    if (bansEnabled && (ctrlKey || shiftKey)) {
        if (ctrlKey) {
            setBan('add', currentPlayer, character);
        } else {
            setBan('sub', currentPlayer, character);
        }
    } else if (!button.classList.contains('disabled') && !button.classList.contains('banned')) {
        addCharacterToTeam(currentPlayer, character);
    }
}

function addCharacterToTeam(player, character) {
    const team = playerTeams[player];

    if (isCharacterBanned(character)) {
        return;
    }

    if (player === 1 && team.pickedCharacters.has(character)) {
        return;
    }

    for (let i = 1; i <= 3; i++) {
        if (!team[`slot${i}`]) {
            team[`slot${i}`] = character;
            team.teamRatio += characterData[character].ratio;
            if (player === 1) {
                team.pickedCharacters.add(character);
            }
            updateTeamDisplay(player);
            updateRatioDisplay(player);
            updateCharacterPool();
            break;
        }
    }
}

function setBan(type, player, character) {
    const team = playerTeams[player];

    if (type === 'add') {
        if (team.addBan === character) {
            team.addBan = null;
        } else {
            team.addBan = character;
        }
    } else {
        if (team.subBan === character) {
            team.subBan = null;
        } else {
            team.subBan = character;
        }
    }
    updateMaxRatio();
    updateBanDisplay(player);
    updateCharacterPool();
}

function isCharacterBanned(character) {
    if (!bansEnabled) {
        return character === "Vergil";
    }

    const player1Bans = playerTeams[1];
    const player2Bans = playerTeams[2];

    return player1Bans.addBan === character ||
           player1Bans.subBan === character ||
           player2Bans.addBan === character ||
           player2Bans.subBan === character;
}

function updateTeamDisplay(player) {
    const team = playerTeams[player];
    for (let i = 1; i <= 3; i++) {
        const slot = document.getElementById(`p${player}-slot${i}`);
        slot.innerHTML = '';

        if (team[`slot${i}`]) {
            const charName = team[`slot${i}`];
            const charData = characterData[charName];

            const img = document.createElement('img');
            img.src = charData.image;
            img.alt = charName;
            slot.appendChild(img);

            const textSpan = document.createElement('span');
            textSpan.classList.add('team-slot-text')
            textSpan.textContent = charName;
            slot.appendChild(textSpan);
        }
    }
}

function updateRatioDisplay(player) {
    const team = playerTeams[player];
    const ratioSpan = document.getElementById(`p${player}-team-ratio`);
    const ratioInfo = document.getElementById(`p${player}-ratio-info`);
    const maxRatioSpan = document.getElementById(`p${player}-max-ratio`);

    ratioSpan.textContent = team.teamRatio;
    maxRatioSpan.textContent = team.maxRatio;

    if (team.teamRatio > team.maxRatio) {
        ratioInfo.classList.add('exceeded');
    } else {
        ratioInfo.classList.remove('exceeded');
    }
}

function updateBanDisplay(player) {
    const team = playerTeams[player];
    const addBanSlot = document.getElementById(`p${player}-add-ban`);
    const subBanSlot = document.getElementById(`p${player}-sub-ban`);

    addBanSlot.textContent = team.addBan || '';
    subBanSlot.textContent = team.subBan || '';
}

function resetPlayer(player) {
    playerTeams[player].slot1 = null;
    playerTeams[player].slot2 = null;
    playerTeams[player].slot3 = null;
    playerTeams[player].teamRatio = 0;
    if (player === 1) {
        playerTeams[player].pickedCharacters.clear();
    }
    updateMaxRatio();
    updateTeamDisplay(player);
    updateRatioDisplay(player);
    updateCharacterPool();
}

function resetBans(player) {
    playerTeams[player].addBan = null;
    playerTeams[player].subBan = null;
    updateBanDisplay(player);
    updateMaxRatio();
    updateCharacterPool();
}

function setActivePlayer(player) {
    currentPlayer = player;
    document.querySelectorAll('.player-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(`player${player}`).classList.add('active');

    document.querySelectorAll('.player-button').forEach(button => {
        button.classList.remove('active');
    });

    document.getElementById(`player${currentPlayer}-button`).classList.add('active');
    updateCharacterPool();
}

function updateVergilDisplay() {
    const vergilButton = Array.from(document.querySelectorAll('.character-button'))
        .find(button => button.dataset.character === 'Vergil');

    if (vergilButton) {
        if (bansEnabled) {
            vergilButton.textContent = "Vergil (9)";
            vergilButton.classList.remove('disabled', 'banned');
        } else {
            vergilButton.textContent = "Vergil (X)";
            vergilButton.classList.add('disabled', 'banned');
        }
    }
}

function updateCharacterPool() {
    const characterButtons = document.querySelectorAll('.character-button');
    characterButtons.forEach(button => {
        const character = button.dataset.character;

        button.classList.remove('disabled', 'banned');

        if (isCharacterBanned(character)) {
            button.classList.add('banned');
        }
        if (!bansEnabled && character === "Vergil") {
            button.classList.add('disabled', 'banned');
        }

        if (character === 'Vergil' && !bansEnabled) {
            button.textContent = `${character} (X)`;
        } else {
            button.textContent = `${character} (${characterData[character].ratio})`;
        }

        if (!button.classList.contains('banned')) {
            disableByRatio(currentPlayer, character, button);
        }

        if (currentPlayer === 1 && playerTeams[1].pickedCharacters.has(character) && !playerTeams[1].slot3) {
            button.classList.add('disabled');
        }
    });
}

function updateBanUI() {
    const banSections = document.querySelectorAll('.ban-section');
    const banHeaders = document.querySelectorAll('.bans-header');
    banSections.forEach(section => {
        section.style.display = bansEnabled ? 'flex' : 'none';
    });
    banHeaders.forEach(header => {
        header.style.display = bansEnabled ? 'block' : 'none';
    });

    updateResetBansButtons();
    updateMaxRatio();
    updateCharacterPool();
}

function updateResetBansButtons() {
    const resetBansButtons = document.querySelectorAll('button.reset-button[onclick^="resetBans"]');
    resetBansButtons.forEach(button => {
        button.style.display = bansEnabled ? 'inline-block' : 'none';
    });
}

function updateMaxRatio() {
    for (let player = 1; player <= 2; player++) {
        const team = playerTeams[player];
        const otherPlayer = player === 1 ? 2 : 1;
        const otherTeam = playerTeams[otherPlayer];

        let maxRatio = 10;

        if (bansEnabled) {
            if (otherTeam.addBan) {
                maxRatio += 1;
            }
            if (team.subBan) {
                maxRatio -= 1;
            }
        }

        team.maxRatio = maxRatio;
        updateRatioDisplay(player);
    }
}

function disableByRatio(player, character, button) {
    const team = playerTeams[player];
    const charRatio = characterData[character].ratio;

    if (!team.slot1) {
        if (charRatio + 2 > team.maxRatio) {
            button.classList.add('disabled');
        }
    } else if (!team.slot2) {
        if (charRatio + team.teamRatio >= team.maxRatio) {
            button.classList.add('disabled');
        }
    } else if (!team.slot3) {
        if (charRatio + team.teamRatio > team.maxRatio) {
            button.classList.add('disabled');
        }
    } else {
        button.classList.add('disabled');
    }
}

document.getElementById('banToggle').addEventListener('change', function() {
    bansEnabled = this.checked;
    updateVergilDisplay();
    updateBanUI();
    resetBans(1);
    resetBans(2);
});

createCharacterPool();
updateTeamDisplay(1);
updateTeamDisplay(2);
updateRatioDisplay(1);
updateRatioDisplay(2);
updateBanUI();
