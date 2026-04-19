import postCreateGame from "./requests/post-createGame.js";
import postJoinGame from "./requests/post-joinGame.js";
import getGameInfo from "./requests/get-gameInfo.js";
import getPlayerInfo from "./requests/get-playerInfo.js";
import postGuessLetter from "./requests/post-guessLetter.js";
import postPlaceWords from "./requests/post-placeWords.js";
import getGameReady from "./requests/get-gameReady.js";
import postPlaceWordsInvalid from "./requests/post-placeWords-invalid.js";

export const name = 'Wordships';

export function preRequest() {
  pm.variables.set('baseUrl', 'http://localhost:5001');
}

export const order = [
  postCreateGame,
  postJoinGame,
  getGameInfo,
  getPlayerInfo,
  postGuessLetter,
  postPlaceWords,
  postPlaceWordsInvalid,
  getGameReady
];