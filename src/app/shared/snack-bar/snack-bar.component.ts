import { Component, OnInit, Inject } from '@angular/core';
import {
  MatSnackBarRef,
  MAT_SNACK_BAR_DATA,
} from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-snack-bar',
  standalone:true,
  templateUrl: './snack-bar.component.html',
  styleUrls: ['./snack-bar.component.css'],
})
export class SnackBarComponent implements OnInit {
  constructor(
    public snackBarRef: MatSnackBarRef<SnackBarComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: any
  ) {}

  ngOnInit(): void {}

  dismiss() {
    this.snackBarRef.dismiss();
  }
}
