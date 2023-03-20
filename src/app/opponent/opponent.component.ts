import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-opponent',
  templateUrl: './opponent.component.html',
  styleUrls: ['./opponent.component.css']
})
export class OpponentComponent {
  @Input() move: string;
}
