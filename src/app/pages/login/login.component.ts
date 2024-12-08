import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'; // Add this
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { PublicService } from '../../services/public.service'; // Adjust path as necessary
import { SnackBarComponent } from '../../shared/snack-bar/snack-bar.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatSnackBarModule,
    MatDialogModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private publicService: PublicService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      userName: [null, Validators.required],
      password: [null, Validators.required],
    });
  }

  login(): void {
    const formValue = this.loginForm.value; // Get the value of the form group

    let loginObject = {
      email: formValue.userName,
      password: formValue.password,
    };
    this.publicService.Login(loginObject).subscribe(
      (res: any) => {
            let result = res;
        sessionStorage.setItem('token', res?.token);
      },

      (err) => {
            if (err?.error?.error) {
          this.openSnackBar(err?.error?.error);
        } else {
          this.openSnackBar('An Error Occurred');
        }
      }
    );
  }

  // Getter for form controls
  get newloginFromControl() {
    return this.loginForm.controls;
  }

  openSnackBar(message: string) {
    this._snackBar.openFromComponent(SnackBarComponent, {
      data: message,
      duration: 10000,
      panelClass: ['snackbar'],
      verticalPosition: 'bottom',
      horizontalPosition: 'end',
    });
  }
}
