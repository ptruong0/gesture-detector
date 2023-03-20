import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})
export class TimerComponent {
  @Input() text: string;
  @Input() running: boolean;

  @Output() onStart: EventEmitter<any> = new EventEmitter();


  constructor() { }

  ngOnInit(): void {
  }
  
  
}
