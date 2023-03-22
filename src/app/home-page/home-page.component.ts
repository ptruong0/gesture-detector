import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { NgToastService } from 'ng-angular-popup';
import { PredictionEvent } from '../prediction-event';

const moves = ['R', 'P', 'S', 'RR', 'PP', 'SS'];
const gestureToMove: { [key: string]: string } = {
  'Closed Hand': 'R',
  'Open Hand': 'P',
  'Hand Pointing': 'S',
  'Two Closed Hands': 'RR',
  'Two Open Hands': 'PP',
  'Two Hands Pointing': 'SS'
}
const moveToText: { [key: string]: string } = {
  'R': 'Rock', 'P': 'Paper', 'S': 'Scissors', 'RR': 'Double Rock', 'PP': 'Double Paper', 'SS': 'Double Scissors'
}

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})

export class HomePageComponent implements OnInit {
  // settings
  @ViewChild("autoplayToggle") autoplayRef: MatSlideToggle;
  autoplay: boolean = false;
  @ViewChild("opponentDoublesToggle") oppDoublesRef: MatSlideToggle;
  opponentDoubles: boolean = true;

  gesture: string = "";  // gesture stored

  running: boolean = false;   // shows Play button when false, announcement text when true
  announceText: string = "";  // display winners, ties, etc

  // display player and opponent moves
  playerMove: string = "";
  opponentMove: string = "";

  // scores
  playerScore: number = 0;
  opponentScore: number = 0;

  constructor(private toast: NgToastService) { }

  ngOnInit(): void {
  }

  toggleAutoplay() {
    this.autoplay = !this.autoplay;
    this.autoplayRef.checked = this.autoplay;
  }
  
  toggleOppDoubles() {
    this.opponentDoubles = !this.opponentDoubles;
    this.oppDoublesRef.checked = this.opponentDoubles;
  }

  prediction(event: PredictionEvent) {
    this.gesture = event.getPrediction();

    // update text display for player's move
    if (this.gesture in gestureToMove) {
      this.playerMove = moveToText[gestureToMove[this.gesture]];
    } else {
      this.playerMove = 'None';
    }

    // if gesture is pinch, turn on/off autoplay
    if (this.gesture == 'Hand Pinching') {
      this.toggleAutoplay();
    }

    // if gesture is one open one closed, enable/disable opponent doubles
    if (this.gesture == 'One Open Hand, One Closed Hand') {
      this.toggleOppDoubles();
    }

    // if gesture is a swipe with open hands, reset score
    if (this.gesture == 'Swipe') {
      this.playerScore = 0;
      this.opponentScore = 0;
      this.toast.info({detail:'Score reset', summary: 'Swipe motion detected', position:'br', duration: 5000});
    }
  }

  // helper to wait n seconds
  async delay(duration: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, duration);
    });
  }

  async start() {
    // countdown before playing
    this.running = true;
    this.announceText = "Rock";
    await this.delay(500);
    this.announceText = "Paper";
    await this.delay(500);
    this.announceText = "Scissors";
    await this.delay(500);
    this.announceText = "Shoot!";
    await this.delay(200);

    var tryAgain = false;
    // check if gestures registered
    if (this.gesture.length > 0) {
      var winnerText = this.play();
      if (winnerText == 'Tie' || winnerText == 'No move registered, try again.') {
        tryAgain = true;    // automatically play another round
      } 
      await this.delay(800);
      this.announceText = winnerText;
    } else {
      await this.delay(800);
      this.announceText = 'No move registered. Make sure you start the camera.'
    }

    await this.delay(4000);

    // play another round
    if (this.autoplay || tryAgain) {
      this.start();
    } else {
      this.running = false;
    }
  }

  play() {
    // generate opponent's move
    if (this.gesture in gestureToMove) {
      const player = gestureToMove[this.gesture];
      // randomly generate opponent's move (only 3 possible if opponent doubles are disabled)
      const opponent = moves[Math.floor(Math.random() * (this.opponentDoubles ? 6 : 3))];

      this.opponentMove = moveToText[opponent];   // update text display for opponent's move

      // same move
      if (player.includes('R') && opponent.includes('R') ||
        player.includes('P') && opponent.includes('P') ||
        player.includes('S') && opponent.includes('S')) {
        return 'Tie';
      } 
      // player wins  
      else if (player.includes('R') && opponent.includes('S') ||
        player.includes('P') && opponent.includes('R') ||
        player.includes('S') && opponent.includes('P')) {
        if (player == 'RR' || player == 'PP' || player == 'SS') {
          this.playerScore += 2;
          return 'Player wins! (DOUBLE POINTS)';
        } else {
          this.playerScore++;
          return 'Player wins!';
        }
      } 
      // opponent wins
      else {
        if (opponent == 'RR' || opponent == 'PP' || opponent == 'SS') {
          this.opponentScore += 2;
          return 'Opponent wins! (DOUBLE POINTS)';
        } else {
          this.opponentScore++;
          return 'Opponent wins!';
        }
      }
    } 
    // no move registered 
    return 'No move registered, try again.';
  }
}
