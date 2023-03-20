import { Component, OnInit } from '@angular/core';
import { PredictionEvent } from '../prediction-event';

const moves = ['Rock', 'Paper', 'Scissors'];
const gestureToMove: {[key: string]: string} = {
  "Closed Hand": 'Rock',
  'Open Hand': 'Paper',
  'Hand Pointing': 'Scissors'
}

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})

export class HomePageComponent implements OnInit {
  gesture: string = "";

  playerMove: string = "";
  opponentMove: string = "";

  playerScore: number = 0;
  opponentScore: number = 0;

  running: boolean = false;
  announceText: string = "";

  async delay(duration: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, duration);
    });
  }

  async start() {
    this.running = true;
    this.announceText = "Rock";
    await this.delay(500);
    this.announceText = "Paper";
    await this.delay(500);
    this.announceText = "Scissors";
    await this.delay(500);
    this.announceText = "Shoot!";
    await this.delay(200);

    if (this.gesture.length > 0) {
      var winner = this.play();
      if (winner) {
        if (winner == 'Tie') {
          this.announceText = 'Tie!';
        } else {
          this.announceText = `${winner} wins!`;
        }
      } else {
        this.announceText = 'No move registered, try again.'
      }
    }
    
    await this.delay(5000);

    this.running = false;
  }

  constructor() { }

  ngOnInit(): void {
  }

  prediction(event: PredictionEvent){
    this.gesture = event.getPrediction();
  }

  play() {
    // generate opponent's move
    if (this.gesture in gestureToMove) {
      this.playerMove = gestureToMove[this.gesture];
      this.opponentMove = moves[Math.floor(Math.random() * 3)];
      

      if (this.playerMove == this.opponentMove) {
        // try again
        return 'Tie';
      } else if (this.playerMove == 'Rock' && this.opponentMove == 'Scissors' || this.playerMove == 'Paper' && this.opponentMove == 'Rock' || this.playerMove == 'Scissors' && this.opponentMove == 'Paper') {
        // player wins
        this.playerScore++;
        return 'Player';
      } else {
        // opponent wins
        this.opponentScore++;
        return 'Opponent';
      }
    } else {
      // no move registered 
      // try again
      this.running = false;
      this.start();
    }
    return null;
  }

}
