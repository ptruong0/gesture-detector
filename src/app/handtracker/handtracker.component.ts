import { Component, ElementRef, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import * as handTrack from 'handtrackjs';
import { PredictionEvent } from '../prediction-event';

@Component({
  selector: 'app-handtracker',
  templateUrl: './handtracker.component.html',
  styleUrls: ['./handtracker.component.css']
})
export class HandtrackerComponent implements OnInit {
  @Input() move: string;

  @Output() onPrediction = new EventEmitter<PredictionEvent>();
  @ViewChild('htvideo') video: ElementRef;

  /* 
  SAMPLERATE determines the rate at which detection occurs (in milliseconds)
  500, or one half second is about right, but feel free to experiment with faster
  or slower rates
  */
  SAMPLERATE: number = 500;

  detectedGesture: string = "None"
  width: string = "400"
  height: string = "400"

  // keep track of previous gesture and position to detect displacement ("motion") of a gesture
  prevGesture: string = "None";
  prevPos: number = 0;

  private model: any = null;
  private runInterval: any = null;

  //handTracker model
  private modelParams = {
    flipHorizontal: true, // flip e.g for video
    maxNumBoxes: 20, // maximum number of boxes to detect
    iouThreshold: 0.5, // ioU threshold for non-max suppression
    scoreThreshold: 0.6, // confidence threshold for predictions.
  };

  constructor() {
  }

  ngOnInit(): void {
    handTrack.load(this.modelParams).then((lmodel: any) => {
      this.model = lmodel;
      console.log("loaded");
    });
  }

  ngOnDestroy(): void {
    this.model.dispose();
  }

  startVideo(): Promise<any> {
    return handTrack.startVideo(this.video.nativeElement).then(function (status: any) {
      return status;
    }, (err: any) => { return err; })
  }

  startDetection() {
    this.startVideo().then(() => {
      //The default size set in the library is 20px. Change here or use styling
      //to hide if video is not desired in UI.
      this.video.nativeElement.style.height = "300px"

      console.log("starting predictions");
      this.runInterval = setInterval(() => {
        this.runDetection();
      }, this.SAMPLERATE);
    }, (err: any) => { console.log(err); });
  }

  stopDetection() {
    console.log("stopping predictions");
    clearInterval(this.runInterval);
    handTrack.stopVideo(this.video.nativeElement);
  }

  /*
    runDetection demonstrates how to capture predictions from the handTrack library.
    It is not feature complete! Feel free to change/modify/delete whatever you need
    to meet your desired set of interactions
  */
  runDetection() {
    if (this.model != null) {
      let predictions = this.model.detect(this.video.nativeElement).then((predictions: any) => {
        if (predictions.length <= 0) return;

        let openhands = 0;
        let closedhands = 0;
        let pointing = 0;
        let pinching = 0;

        let preds = [];   // predictions array but excludes face
        for (let p of predictions) {
          //uncomment to view label and position data
          console.log(p.label + " at X: " + p.bbox[0] + ", Y: " + p.bbox[1] + " at X: " + p.bbox[2] + ", Y: " + p.bbox[3]);

          if (p.label == 'open') openhands++;
          else if (p.label == 'closed') closedhands++;
          else if (p.label == 'point') pointing++;
          else if (p.label == 'pinch') pinching++;
          else continue;

          preds.push(p);
        }

        if (openhands > 1) this.detectedGesture = "Two Open Hands";
        else if (openhands == 1) this.detectedGesture = "Open Hand";

        if (closedhands > 1) this.detectedGesture = "Two Closed Hands";
        else if (closedhands == 1) this.detectedGesture = "Closed Hand";

        if (pointing > 1) this.detectedGesture = "Two Hands Pointing";
        else if (pointing == 1) this.detectedGesture = "Hand Pointing";

        if (pinching > 1) this.detectedGesture = "Two Hands Pinching";
        else if (pinching == 1) this.detectedGesture = "Hand Pinching";

        if (openhands == 1 && closedhands == 1) this.detectedGesture = "One Open Hand, One Closed Hand";

        if (openhands == 0 && closedhands == 0 && pointing == 0 && pinching == 0)
          this.detectedGesture = "None";

        // don't detect two of these controls consecutively 
        // or else toggles will turn on and off too fast
        if (this.prevGesture == "One Open Hand, One Closed Hand" && this.prevGesture == this.detectedGesture) {
          this.prevGesture = "None";
          this.detectedGesture = "None";
        }
        if (this.prevGesture == "Hand Pinching" && this.prevGesture == this.detectedGesture) {
          this.prevGesture = "None";
          this.detectedGesture = "None";
        }

        if (preds.length == 1) {
          const currentPos = preds[0].bbox[0];
          // swipe detected if open hands detected twice in a row
          // and distance between two is above a threshold 
          if (this.detectedGesture == "Open Hand" && this.prevGesture == this.detectedGesture) {
            if (Math.abs(currentPos - this.prevPos) > 150) {
              this.detectedGesture = "Swipe";
              this.prevGesture = "None";
            }
          } else {
            this.prevGesture = this.detectedGesture;
          }
          this.prevPos = currentPos;
        } else {
          this.prevGesture = this.detectedGesture;
        }

        this.onPrediction.emit(new PredictionEvent(this.detectedGesture))
      }, (err: any) => {
        console.log("ERROR")
        console.log(err)
      });
    } else {
      console.log("no model")
    }
  }
}
