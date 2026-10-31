// State Game
let boardState = Array(9).fill(null); 
let currentPlayer = '';
let phase = 'COIN_FLIP'; // COIN_FLIP -> PLACEMENT -> MOVEMENT
let p1StonesPlaced = 0;
let p2StonesPlaced = 0;
let selectedDotIndex = null;

const turnIndicator = document.getElementById('turnIndicator');
const phaseIndicator = document.getElementById('phaseIndicator');
const dots = document.querySelectorAll('.dot');

// Gerak mengikuti garis papan: horizontal/vertikal, dengan diagonal hanya lewat tengah.
const VALID_MOVES = {
  0: [1, 3, 4],
  1: [0, 2, 4],
  2: [1, 4, 5],
  3: [0, 4, 6],
  4: [0, 1, 2, 3, 5, 6, 7, 8],
  5: [2, 4, 8],
  6: [3, 4, 7],
  7: [4, 6, 8],
  8: [4, 5, 7]
};

const WIN_COMBOS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Horizontal
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Vertikal
  [0, 4, 8], [2, 4, 6]             // Diagonal
];

// --- 1. LOGIKA UNDIAN KOIN ---
const coinModal = document.getElementById('coinModal');
const coinResult = document.getElementById('coinResult');
const btnStart = document.getElementById('btnStartGame');
const btnHeads = document.getElementById('btnHeads');
const btnTails = document.getElementById('btnTails');

let p1Name = 'Player 1';
let p2Name = 'Player 2';

function syncPlayerNames() {
  const input1 = document.getElementById('inputP1').value.trim();
  const input2 = document.getElementById('inputP2').value.trim();
  p1Name = input1 !== '' ? input1 : 'Player 1';
  p2Name = input2 !== '' ? input2 : 'Player 2';
}

btnHeads.addEventListener('click', () => tossCoin('Gambar'));
btnTails.addEventListener('click', () => tossCoin('Angka'));

btnStart.addEventListener('click', () => {
  if (phase !== 'COIN_FLIP') return;

  coinModal.style.display = 'none';
  phase = 'PLACEMENT';
  updateUI();
});

// --- UPDATE FUNGSI TOSS COIN ---
function tossCoin(p1Choice) {
  syncPlayerNames();

  const isHeads = Math.random() < 0.5;
  const resultText = isHeads ? 'Gambar' : 'Angka';

  if (p1Choice === resultText) {
    currentPlayer = 'p1';
    coinResult.innerText = `Koin di ${resultText}. ${p1Name} (Biru) jalan duluan.`;
  } else {
    currentPlayer = 'p2';
    coinResult.innerText = `Koin di ${resultText}. ${p2Name} (Abu) jalan duluan.`;
  }

  btnHeads.style.display = 'none';
  btnTails.style.display = 'none';
  btnStart.style.display = 'block';
}

// --- 2. LOGIKA GAMEPLAY ---
dots.forEach(dot => {
  dot.addEventListener('click', (e) => {
    const index = parseInt(e.target.getAttribute('data-index'));

    if (phase === 'PLACEMENT') {
      handlePlacement(index);
    } else if (phase === 'MOVEMENT') {
      handleMovement(index);
    }
  });
});

function handlePlacement(index) {
  if (boardState[index] !== null) return; // Kalo titik udah ada batunya, abaikan

  boardState[index] = currentPlayer;
  
  if (currentPlayer === 'p1') p1StonesPlaced++;
  else p2StonesPlaced++;

  // Cek apakah semua 6 batu udah ditaruh
  if (p1StonesPlaced === 3 && p2StonesPlaced === 3) {
    phase = 'MOVEMENT';
    selectedDotIndex = null;
  }
  
  checkWin();
  switchTurn();
}

function handleMovement(index) {
  // Kalau klik batu punya sendiri -> Tandain (Select)
  if (boardState[index] === currentPlayer) {
    selectedDotIndex = index;
    updateUI();
    return;
  }

  // Kalau klik titik kosong dan udah milih batu sebelumnya
  if (boardState[index] === null && selectedDotIndex !== null) {
    // Validasi: Apakah titik tujuan bersebelahan 1 langkah dari posisi batu saat ini?
    if (VALID_MOVES[selectedDotIndex].includes(index)) {
      // Pindahkan batu
      boardState[index] = currentPlayer;
      boardState[selectedDotIndex] = null;
      selectedDotIndex = null;
      
      checkWin();
      switchTurn();
    }
  }
}

function switchTurn() {
  if (phase === 'GAMEOVER') return;
  currentPlayer = currentPlayer === 'p1' ? 'p2' : 'p1';
  updateUI();
}

// --- UPDATE FUNGSI CEK MENANG ---
function checkWin() {
  for (let combo of WIN_COMBOS) {
    const [a, b, c] = combo;
    if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
      phase = 'GAMEOVER';
      // Panggil nama custom pas menang
      const winnerName = boardState[a] === 'p1' ? p1Name : p2Name;
      turnIndicator.innerText = `${winnerName} MENANG!`;
      turnIndicator.style.color = boardState[a] === 'p1' ? '#00bcd4' : '#8e8e8e';
      phaseIndicator.innerText = "Anda kalah";
      return;
    }
  }
}

// --- UPDATE FUNGSI UPDATE UI (Highlight Valid Move) ---
function updateUI() {
  if (phase === 'GAMEOVER') return;

  // Tunjukin giliran siapa pake custom username
  const currentName = currentPlayer === 'p1' ? p1Name : p2Name;
  turnIndicator.innerText = `Giliran: ${currentName}`;
  turnIndicator.style.color = currentPlayer === 'p1' ? '#00bcd4' : '#8e8e8e';
  
  if (phase === 'PLACEMENT') phaseIndicator.innerText = `Taruh Batu (Sisa P1: ${3-p1StonesPlaced} | P2: ${3-p2StonesPlaced})`;
  else if (phase === 'MOVEMENT') phaseIndicator.innerText = "Pilih batu anda, terus geser 1 langkah.";

  dots.forEach((dot, idx) => {
    // Reset semua class
    dot.className = 'dot';
    
    // Terapin warna batu
    if (boardState[idx] === 'p1') dot.classList.add('p1');
    else if (boardState[idx] === 'p2') dot.classList.add('p2');

    // Terapin efek selected pas batu diklik
    if (idx === selectedDotIndex) {
      dot.classList.add('selected');
    }

    // --- LOGIC HIGHLIGHT ---
    // Kalo lagi fase MOVEMENT, ada batu yang dipilih, dan titik ini valid & kosong
    if (phase === 'MOVEMENT' && selectedDotIndex !== null) {
      if (VALID_MOVES[selectedDotIndex].includes(idx) && boardState[idx] === null) {
        dot.classList.add('valid-move');
      }
    }
  });
}