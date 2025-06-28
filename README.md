
<h1 align="center">
  <br>
  <a href="https://romanlytvynua.github.io/Hostify/"><img src="https://github.com/user-attachments/assets/fc5b6ddc-6843-4b92-9be9-eae3fc818b52" width="200"></a>
  <br>
  Hostify
  <br>
</h1>

<p align="center">
  <a href="#description">Description</a> •
  <a href="#key-features">Key Features</a> •
  <a href="#how-to-use">How To Use</a> •
  <a href="#tools-used">Tools used</a>
</p>

## Description

<b>Hostify</b> is a web application that allows you to manage your mafia game seamlessly. It features basic utilities that are needed to host a professional mafia game. 
The tool is specifically tailored to correspond to the needs of the host, guided by the rules of the international iMafia mafia game federation (please, see [source](https://imafia.org/game-rules) for details).
<br>
Because of it being an SPA with no server-side, you to easily host and access it without any difficulties. Hostify is currently hosted on GitHub Pages and can be accessed by anyone via the [link](https://romanlytvynua.github.io/Hostify/).

## Key Features

- [x] <b>Strict guideline</b> - the flow of the game is strictly scripted, eliminating the human factor along with the mistakes and bias of the host.
- [x] <b>Game log</b> - upon finishing the game, the host can download the game log with all the game events. This can prove quite helpful during the game evaluation by the jury.
- [x] <b>Tournament presets</b> - game settings (list of the players, name, type, etc.) can be saved and later loaded as a preset, which is especially helpful when hosting different states of the same tournament.
- [x] <b>Music player</b> - manage the night background music straight from the app without any need for additional destruction.
- [x] <b>Dashboard</b> - assign and retract fouls, register and review expels all in one place.
- [ ] <b>Statistics</b> - the game events are analysed and various stats, like players' accuracy, are displayed, which aids the discussion of the jury.
- [ ] <b>Rating</b> - a facts-based leaderboard is generated. It should not be used as a primary basis for decision-making, but as a conclusion-supporting tool. 

## How To Use

Hostify is currently hosted on GitHub Pages and can be accessed by anyone via the [link](https://romanlytvynua.github.io/Hostify/). To host it localy, please follow the steps below: 

```bash
# Clone this repository
$ git clone https://github.com/RomanLytvynUA/Hostify.git

# Go into the repository
$ cd hostify

# Install dependencies
$ npm install

# Run the app
$ npm run dev
```

## Tools used

- [VueJs](https://vuejs.org/)
- [Bootstrap](https://getbootstrap.com/)
- [vue-confetti-explosion](https://github.com/valgeirb/vue-confetti-explosion)

