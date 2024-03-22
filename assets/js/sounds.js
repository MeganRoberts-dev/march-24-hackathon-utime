// create object to store all current players
var players = {};

// default sounds to initialize webpage
var videoData = {
    'Music Lofi': 'Ah7i5EFVDqA',
    'Soft Piano Music': 'cHKHv3ZHTkM',
    'Birds': 'bKmmcKWMDfM',
    'Fireplace': '3_gdxb7AyGo',
    'Cat Purring': 'SR5L2BSYNuE',
    'Lake Waters': 'zdGs4pvgR9M',
};

var isMuted = false;

// optional sounds provided as dropdown
var dropDownData = {
    'Music Lofi': 'Ah7i5EFVDqA',
    'Music Alpha Waves': 'WPni755-Krg',
    'Piano Music': 'cHKHv3ZHTkM',
    'Smooth Jazz': '13jhFFYCWVU',
    'Uplifting Playlist': 'CpNBODqTA34',
    'Yoga ': 'G7WnJ1qBwCA',
    'Yoga 2 ': 'FTqrQsSIKR0',
    'Rain': 'J4d-a7dVtiQ',
    'Thunderstorm': 'mPZkdNFkNps',
    'Winter Storm': 'sGkh1W5cbH4',
    'Snow Fall Forrest': 'vz91QpgUjFc',
    'Birds': 'bKmmcKWMDfM',
    'Fireplace': '3_gdxb7AyGo',
    'Brown Noise': 'RqzGzwTY-6w',
    'Ceiling Fan': 'Xkx6Y0nYAYw',
    'Aircraft Cabin': 'co7KgV2edvI',
    'Train Ride': 'pqfQhPM8reU',
    'Coffee House': 'FTWd28r472c',
    'Traffic': 'fh3EdeGNKus',
    'Cat Purring': 'SR5L2BSYNuE',
    'Lake Waters': 'zdGs4pvgR9M',
    'Soft Brook': 'IvjMgVS6kng',
    'Wind Chimes': 'T_wKO6XdEh8',
    'Night Ambience': 'g1w3IT5WnYw',
    'Night Lake': 'ih4_1FyVjaY',
    'Forrest': 'xNN7iTA57jM',
    'Keyboard AMSR': '-2RiNR2fqRY',
    'Bedtime Story': 'V4fBgXgxjjg',
    'Sleep Hypnosis': 'Sh-YrLYC7p8',
};

const initialX = 20; // X position offset for the first player
const initialY = 70; // Y position offset for the first player
const playerSpacing = 90; // Vertical spacing between players

// ensure youtube api loaded before adding default player list
function onYouTubeIframeAPIReady() {
    console.log("YouTube API is ready.");
    let playersToPosition = []; 
    const storedPlayersData = localStorage.getItem('playersData');
    if (storedPlayersData) {
        const loadedPlayers = JSON.parse(storedPlayersData);
        Object.values(loadedPlayers).forEach((player, index) => {
            addPlayer(player.name, player.videoId);
            // Prepare for positioning
            playersToPosition.push({ position: player.position, index });
        });
    } else {
        // build list of players from default list
        Object.entries(videoData).forEach(([playerName, videoId], index) => {
            addPlayer(playerName, videoId);
            // Default players
            playersToPosition.push({ index });
        });
    }

    // Position players
    playersToPosition.forEach(({ position, index }) => {
        const container = document.getElementById('container-player' + (index + 1));
        if (position && position.top && position.left) {
            container.style.top = position.top;
            container.style.left = position.left;
        } else {
            // Position players in a column by default with initialX, initialY, and playerSpacing
            container.style.top = `${initialY + (index * playerSpacing)}px`;
            container.style.left = `${initialX}px`; 
        }
    });
}
// main function to add a sound player to the page
function addPlayer(playerName, videoId) {
    var playerCount = Object.keys(players).length + 1;
    var playerId = 'player' + playerCount;

    var container = document.createElement('div');
    container.classList.add('player-container');
    container.classList.add('frosted-glass-effect');
    container.setAttribute('id', 'container-' + playerId);

    var nameLabel = document.createElement('p');
    nameLabel.textContent = playerName;
    nameLabel.classList.add("sound-name");
    container.appendChild(nameLabel);

    var playerDiv = document.createElement('div');
    playerDiv.id = playerId;
    container.appendChild(playerDiv);

    var controlsDiv = document.createElement('div');
    controlsDiv.classList.add('controls');

    var playButton = document.createElement('button');
    playButton.classList.add('playButton');
    playButton.setAttribute('data-player', playerId);
    playButton.innerHTML = '<i class="fas fa-play"></i>';
    playButton.disabled = true;

    var gearButton = document.createElement('button');
    gearButton.classList.add('gearButton');
    gearButton.setAttribute('data-player', playerId);
    gearButton.innerHTML = '<i class="fas fa-cog"></i>';

    var volumeSlider = document.createElement('input');
    volumeSlider.type = 'range';
    volumeSlider.classList.add('volume-slider');
    volumeSlider.setAttribute('data-player', playerId);
    volumeSlider.min = '0';
    volumeSlider.max = '100';
    volumeSlider.value = '100';
    volumeSlider.style.width = '80px';

    var colorSlider = document.createElement('input');
    colorSlider.type = 'range';
    colorSlider.classList.add('color-slider');
    colorSlider.min = '0';
    colorSlider.max = '255';
    colorSlider.value = '255';
    colorSlider.style.width = '80px';
    colorSlider.style.display = 'none';
    colorSlider.setAttribute('data-player', playerId);

    colorSlider.addEventListener('input', function() {
        var value = 255 - this.value;
        container.style.backgroundColor = `rgba(${value}, ${value}, ${value}, 0.1)`;
    
        // toggle dark mode for max slider value
        var textColor = this.value == '255' ? 'rgb(0, 0, 0)' : 'rgb(255, 255, 255)';
        container.style.color = textColor;
    
        // buttons to toggle
        var playButton = container.querySelector('.playButton i');
        var gearButton = container.querySelector('.gearButton i');
        
        // Set the color
        if (playButton) playButton.style.color = textColor;
        if (gearButton) gearButton.style.color = textColor;
      
    });

    var deleteButton = document.createElement('button');
    deleteButton.classList.add('deleteButton');
    deleteButton.setAttribute('data-player', playerId);
    deleteButton.innerHTML = '<i class="fas fa-times-circle"></i>';
    deleteButton.style.display = 'none';
    deleteButton.onclick = function() {
        document.getElementById('playersContainer').removeChild(container);
        delete players[playerId];
    };

    controlsDiv.appendChild(playButton);
    controlsDiv.appendChild(gearButton);
    controlsDiv.appendChild(volumeSlider);
    controlsDiv.appendChild(colorSlider);
    controlsDiv.appendChild(deleteButton);
    
    container.appendChild(playerDiv);
    container.appendChild(controlsDiv);

    document.getElementById('playersContainer').appendChild(container);

    makeDraggable(container);

    players[playerId] = { name: playerName, videoId: videoId, player: createPlayer(playerId, videoId) };
}


// create a new YT player
function createPlayer(elementId, videoId) {
    return new YT.Player(elementId, {
        height: '0',
        width: '0',
        videoId: videoId,
        playerVars: {
            autoplay: 0,
            controls: 0,
            showinfo: 0,
            rel: 0,
            modestbranding: 1
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

// only enable play pause buttons once YT player is ready
function onPlayerReady(event) {
    document.querySelectorAll('.playButton, .gearButton').forEach(button => button.disabled = false);
}

// Event delegation for play and volume controls
document.addEventListener('click', function(event) {
    if (event.target.closest('.playButton')) {
        var button = event.target.closest('.playButton');
        var playerId = button.getAttribute('data-player');
        togglePlayPause(playerId);
    } else if (event.target.closest('.gearButton')) {
        var gearButton = event.target.closest('.gearButton');
        var playerId = gearButton.getAttribute('data-player');
        var colorSlider = document.querySelector(`.color-slider[data-player="${playerId}"]`);
        var volumeSlider = document.querySelector(`.volume-slider[data-player="${playerId}"]`);
        var deleteButton = document.querySelector(`button.deleteButton[data-player="${playerId}"]`);
        // toggle visibility of buttons
        colorSlider.style.display = colorSlider.style.display === 'block' ? 'none' : 'block';
        volumeSlider.style.display = volumeSlider.style.display === 'block' ? 'none' : 'block';
        deleteButton.style.display = deleteButton.style.display === 'block' ? 'none' : 'block';
    }
});

// closeall players controls at once
document.getElementById('closeAllBtn').addEventListener('click', function() {
    // Iterate over each gear button to simulate a click or directly toggle the visibility of associated controls.
    document.querySelectorAll('.gearButton').forEach(gearButton => {
        var playerId = gearButton.getAttribute('data-player');
        
        // set individual controls
        var colorSlider = document.querySelector(`.color-slider[data-player="${playerId}"]`);
        var volumeSlider = document.querySelector(`.volume-slider[data-player="${playerId}"]`);
        var deleteButton = document.querySelector(`button.deleteButton[data-player="${playerId}"]`);
        
        colorSlider.style.display = 'none';
        volumeSlider.style.display = 'none';
        deleteButton.style.display = 'none';
    });
});

// user changes volume slider
document.addEventListener('input', function(event) {
    if (event.target.classList.contains('volume-slider')) {
        var slider = event.target;
        var playerId = slider.getAttribute('data-player');
        var player = players[playerId].player; // Access the YT.Player instance
        player.setVolume(slider.value);
    }
});

// user clicks play or pause sound from specific player
function togglePlayPause(playerId) {
    var player = players[playerId].player;
    var state = player.getPlayerState();
    var icon = document.querySelector(`button[data-player="${playerId}"] i`);
    if (state === YT.PlayerState.PLAYING || state === YT.PlayerState.BUFFERING) {
        player.pauseVideo();
        icon.classList.remove('fa-pause');
        icon.classList.add('fa-play');
    } else {
        player.playVideo();
        icon.classList.remove('fa-play');
        icon.classList.add('fa-pause');
    }
}

// toggle display of play pause buttons
function onPlayerStateChange(event) {
    var playerKey = Object.keys(players).find(key => players[key].player === event.target);
    var icon = document.querySelector(`button[data-player="${playerKey}"] i`);
    if (event.data === YT.PlayerState.PLAYING) {
        icon.classList.remove('fa-play');
        icon.classList.add('fa-pause');
    } else {
        icon.classList.remove('fa-pause');
        icon.classList.add('fa-play');
    }
}

// detect click on add sound button
document.getElementById('addPlayerBtn').addEventListener('click', function() {
    document.getElementById('addPlayerModal').style.display = 'block';
    populateDropdown(); // build dropdown
    });

// Function to populate the dropdown
function populateDropdown() {
    var dropdown = document.getElementById('videoDropdown');
    
    // Clear existing options
    while (dropdown.firstChild) {
        dropdown.removeChild(dropdown.firstChild);
    }

    // Add a default option
    var defaultOption = document.createElement('option');
    defaultOption.text = 'Click to Select';
    dropdown.appendChild(defaultOption);

    // Populate with new options
    Object.keys(dropDownData).forEach(function(key) {
        var option = document.createElement('option');
        option.text = key;
        option.value = dropDownData[key];
        dropdown.appendChild(option);
    });
}

// populate modal sound name fields when drop down is selected
document.getElementById('videoDropdown').addEventListener('change', function() {
    // Get selected video ID and Sound Name
    var videoId = this.value; 
    var soundName = this.options[this.selectedIndex].text;
    
    // Populate the Sound Name and Video ID fields
    document.getElementById('playerName').value = soundName;
    document.getElementById('videoId').value = videoId;
});

// detect click on cancel button in modal
document.getElementById('cancelAddPlayer').addEventListener('click', function() {
    document.getElementById('addPlayerModal').style.display = 'none';
});

// user clicked add sound button
document.getElementById('addPlayerSubmit').addEventListener('click', function() {
    var playerName = document.getElementById('playerName').value.trim();
    var videoId = document.getElementById('videoId').value.trim();

    if (playerName && videoId) {
        addPlayer(playerName, videoId);
        savePlayersData();
        //reset and hide modal
        document.getElementById('addPlayerModal').style.display = 'none';
        document.getElementById('playerName').value = '';
        document.getElementById('videoId').value = '';
    } else {
        alert('Please fill in both fields.');
    }
});

// add overall controls for all sounds

// stop all sound players
document.getElementById('stopAllBtn').addEventListener('click', function() {
    Object.values(players).forEach(player => {
        player.player.pauseVideo();
    });
});

// mute active players and toggle back on if needed.
document.getElementById('muteAllBtn').addEventListener('click', function() {
    // toggel mute state for all players
    isMuted = !isMuted;

    // toggle the button 
    this.innerHTML = isMuted ? '<i class="fas fa-volume-mute"></i>' : '<i class="fas fa-volume-up"></i>';

    // Apply mute or unmute
    Object.values(players).forEach(player => {
        if (isMuted) {
            player.player.mute();
        } else {
            player.player.unMute();
            // delay volume restoration after unmuting
            setTimeout(() => {
                var overallVolume = document.getElementById('overallVolumeControl').value;
                player.player.setVolume(overallVolume);
            }, 100);
        }
    });
});

// toggle timer on / off
document.getElementById('timerBtn').addEventListener('click', function() {
    var timerDiv = document.getElementById('draggable-timer');
    var isVisible = !timerDiv.classList.contains('d-none');
    
    if (isVisible) {
        timerDiv.classList.add('d-none');
    } else {
        timerDiv.classList.remove('d-none');
    }
});

// make a player draggable
function makeDraggable(element) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

    element.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        // dont drag when adjusting volume
        if (e.target.closest('.volume-slider, .color-slider')) {
            //  control -> don't drag
            e.stopPropagation();
        } else {
            // Prepare to drag the whole container
            e.preventDefault();
            // Get the mouse cursor position
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            // Call function when cursor moves:
            document.onmousemove = elementDrag;
        }
    }

    function elementDrag(e) {
        e.preventDefault(); 
        // Calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // Set the element's new position:
        element.style.top = (element.offsetTop - pos2) + "px";
        element.style.left = (element.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        // Stop drag when mouse button released:
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

// make add sound modal draggable
document.addEventListener('DOMContentLoaded', (event) => {
    const modal = document.getElementById('addPlayerModal');
    let isDragging = false, x = 0, y = 0, dx = 0, dy = 0;

    modal.addEventListener('mousedown', (e) => {
        isDragging = true;
        x = e.clientX;
        y = e.clientY;
        document.addEventListener('mousemove', mouseMove);
        document.addEventListener('mouseup', () => {
            document.removeEventListener('mousemove', mouseMove);
            isDragging = false;
        }, { once: true });
    });

    function mouseMove(e) {
        if (!isDragging) return;
        dx = e.clientX - x;
        dy = e.clientY - y;
        x = e.clientX;
        y = e.clientY;
        modal.style.top = (modal.offsetTop + dy) + 'px';
        modal.style.left = (modal.offsetLeft + dx) + 'px';
    }
});


// Make all player containers draggable
document.querySelectorAll('.player-container').forEach(makeDraggable);

// save current players to local machine for later retreival
function savePlayersData() {
    // object to hold player data
    const simplifiedPlayersData = {};

    // Iterate over the players object
    Object.keys(players).forEach(key => {
        const player = players[key];
        simplifiedPlayersData[key] = {
            name: player.name,
            videoId: player.videoId
        };
    });

    // Convert the simplified object to a string and save it to localStorage
    const playersDataString = JSON.stringify(simplifiedPlayersData);
    localStorage.setItem('playersData', playersDataString);
}


// #########################  ADD TIMER TEST ####################
document.addEventListener('DOMContentLoaded', function() {
    let timerDiv = document.getElementById('draggable-timer');
    makeDraggable(timerDiv);
    setupTimerControl();
});

let timerInterval;
let timerRunning = false;
let seconds = 0;

function setupTimerControl() {
    let startStopBtn = document.getElementById('start-stop-btn');
    let timer = document.getElementById('timer');

    function formatTime(sec) {
        let minutes = Math.floor(sec / 60);
        let seconds = sec % 60;
        minutes = String(minutes).padStart(2, '0');
        seconds = String(seconds).padStart(2, '0');
        return `${minutes}:${seconds}`;
    }

    startStopBtn.addEventListener('click', function() {
        let icon = startStopBtn.querySelector('i');
        if (!timerRunning) {
            //start
            timerInterval = setInterval(function() {
                seconds++;
                timer.innerText = formatTime(seconds);
            }, 1000);
            icon.classList.remove('fa-play');
            icon.classList.add('fa-stop');
            timerRunning = true;
        } else {
            //stop
            clearInterval(timerInterval);
            if (icon.classList.contains('fa-stop')) {
                icon.classList.remove('fa-stop');
                icon.classList.add('fa-sync-alt');
            } else {
                //reset
                seconds = 0;
                timer.innerText = formatTime(seconds);
                icon.classList.remove('fa-sync-alt');
                icon.classList.add('fa-play');
                timerRunning = false;
            }
        }
    });
}