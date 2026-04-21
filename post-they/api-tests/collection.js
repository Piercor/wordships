import postCreateGame from "./requests/post-createGame.js";
import postJoinGame from "./requests/post-joinGame.js";
import getGameInfo from "./requests/get-gameInfo.js";
import getPlayerInfo from "./requests/get-playerInfo.js";
import postGuessLetter from "./requests/post-guessLetter.js";
import postGuessWord from "./requests/post-guessWord.js";


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
  postGuessWord
];