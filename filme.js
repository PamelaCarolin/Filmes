// Arrays de filmes e séries (exemplos de 30 filmes/séries iniciais)
const movies = [
    { title: "Inception", poster: "https://image.tmdb.org/t/p/w500/qmDpIHrmpJINaRKAfWQfftjCdyi.jpg" },
    { title: "Interstellar", poster: "https://image.tmdb.org/t/p/w500/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg" },
    { title: "The Matrix", poster: "https://image.tmdb.org/t/p/w500/9Kjxr4VCU0Y4DAuXkzR2moAy7DK.jpg" },
    // ... adicione mais filmes aqui até completar 30
];

const series = [
    { title: "The Witcher", poster: "https://image.tmdb.org/t/p/w500/zrPpUlehQaBf8YX2NrVrKK8IEpf.jpg" },
    { title: "Stranger Things", poster: "https://image.tmdb.org/t/p/w500/x2LSRK2Cm7MZhjluni1msVJ3wDF.jpg" },
    { title: "Breaking Bad", poster: "https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg" },
    // ... adicione mais séries aqui até completar 30
];

let currentIndex = 0;
let user1Likes = [];
let user2Likes = [];
let isUser1Turn = true;
let currentSelection = [];
let matchSessionId = null;
let matchList = [];

const moviePoster = document.getElementById("movie-poster");
const movieTitle = document.getElementById("movie-title");
const dislikeBtn = document.getElementById("dislike-btn");
const likeBtn = document.getElementById("like-btn");
const matchResults = document.getElementById("match-results");
const matchListElement = document.getElementById("match-list");
const selectionContainer = document.getElementById("selection-container");
const matchContainer = document.getElementById("match-container");
const shareContainer = document.getElementById("share-container");
const shareLinkInput = document.getElementById("share-link");
const copyLinkBtn = document.getElementById("copy-link-btn");

// Função para iniciar a seleção de filmes ou séries
function startSelection(type) {
    currentSelection = type === 'movies' ? movies.slice() : series.slice(); // Faz uma cópia da lista
    selectionContainer.style.display = 'none';
    matchContainer.style.display = 'block';
    shareContainer.style.display = 'block';
    matchSessionId = generateSessionId();
    shareLinkInput.value = `${window.location.origin}?session=${matchSessionId}&type=${type}`;
    showNextMovie();
}

// Função para mostrar o próximo filme/série
function showNextMovie() {
    if (currentIndex < currentSelection.length) {
        moviePoster.src = currentSelection[currentIndex].poster;
        movieTitle.textContent = currentSelection[currentIndex].title;
    } else {
        checkMatchThreshold();
    }
}

// Função para processar a escolha do usuário
function processChoice(liked) {
    if (isUser1Turn) {
        if (liked) user1Likes.push(currentSelection[currentIndex].title);
    } else {
        if (liked) user2Likes.push(currentSelection[currentIndex].title);
        currentIndex++;
    }

    isUser1Turn = !isUser1Turn;

    if (isUser1Turn) {
        showNextMovie();
    }
}

// Função para verificar se há pelo menos 10 matches
function checkMatchThreshold() {
    matchList = user1Likes.filter(movie => user2Likes.includes(movie));

    if (matchList.length >= 10 || currentSelection.length === 0) {
        showResults();
    } else {
        loadMoreMovies();
    }
}

// Função para carregar mais 30 filmes/séries
function loadMoreMovies() {
    const newBatch = [
        // Adicione mais filmes ou séries aqui, conforme o tipo
        // { title: "Novo Filme", poster: "link para o poster" }
    ];

    if (newBatch.length > 0) {
        currentSelection = currentSelection.concat(newBatch);
        showNextMovie();
    } else {
        showResults();
    }
}

// Função para mostrar os resultados
function showResults() {
    if (matchList.length > 0) {
        matchResults.style.display = "block";
        matchList.forEach(match => {
            let listItem = document.createElement("li");
            listItem.textContent = match;
            matchListElement.appendChild(listItem);
        });
    } else {
        movieTitle.textContent = "Nenhum Match encontrado :(";
        moviePoster.src = "";
        dislikeBtn.style.display = "none";
        likeBtn.style.display = "none";
    }
}

// Função para copiar o link de compartilhamento
copyLinkBtn.addEventListener("click", () => {
    shareLinkInput.select();
    document.execCommand("copy");
    alert("Link copiado para a área de transferência!");
});

// Função para gerar um ID de sessão único
function generateSessionId() {
    return Math.random().toString(36).substr(2, 9);
}

// Configurar os botões de seleção
document.getElementById("movie-btn").addEventListener("click", () => startSelection('movies'));
document.getElementById("series-btn").addEventListener("click", () => startSelection('series'));

// Configurar os botões de escolha
dislikeBtn.addEventListener("click", () => processChoice(false));
likeBtn.addEventListener("click", () => processChoice(true));

// Mostrar o primeiro filme/série
if (window.location.search) {
    const params = new URLSearchParams(window.location.search);
    const session = params.get('session');
    const type = params.get('type');
    if (session && type) {
        matchSessionId = session;
        startSelection(type);
    }
}

