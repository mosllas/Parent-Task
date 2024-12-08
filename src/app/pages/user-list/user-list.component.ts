import { Component } from '@angular/core';
import { PublicService } from '../../services/public.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SnackBarComponent } from '../../shared/snack-bar/snack-bar.component';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatSnackBarModule,
    MatDialogModule,
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css',
})
export class UserListComponent {
  currentPage: number = 1;
  itemsPerPage: number = 6;
  pages: number[] = [];
  paginatedusers: any[] = [];
  users: any;
  totlPages: any;
  selectedUser: any;
  selectedUserForEdit: any;
  EditForm: any;
  selectedRowindex: number = -1;
  selectedUserToView: any;

  constructor(
    private publicService: PublicService,
    private _snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {}
  ngOnInit(): void {
    this.getUsers();

    this.EditForm = this.fb.group({
      userName: [null, Validators.required],
      jobTitle: [null, Validators.required],
    });
  }
  // Getter for form controls
  get newEditFromControl() {
    return this.EditForm.controls;
  }

  getUsers(page = this.currentPage) {
    this.publicService.GetUsers(page).subscribe(
      (res: any) => {
        let result = res;
        this.users = res.data;

        this.totlPages = res?.total_pages;
        this.itemsPerPage = res?.per_page;
        this.updatePage(res.data);
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
  openSnackBar(message: string) {
    this._snackBar.openFromComponent(SnackBarComponent, {
      data: message,
      duration: 10000,
      panelClass: ['snackbar'],
      verticalPosition: 'bottom',
      horizontalPosition: 'end',
    });
  }

  // Update the current page of providers to display
  updatePage(providers: any) {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedusers = providers.slice(start, end);
  }
  onDelete(user: any) {
    this.selectedUser = user;
  }
  DeleteUser() {
    this.publicService.DeleteUser(this.selectedUser?.id).subscribe(
      (res: any) => {
            // let result = res;
        // this.users = res?.data;
        // this.totlPages = res?.total_pages;
        // this.itemsPerPage = res?.per_page;
        // this.updatePage(res.data);
        this.openSnackBar('User Deleted');
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

  onEdit(user: any) {
    this.selectedUserForEdit = user;
  }

  EditUserDetails() {
    const formValue = this.EditForm.value; // Get the value of the form group

    let modal = {
      name: formValue?.userName,
      job: formValue?.jobTitle,
    };

    this.publicService.EditUser(this.selectedUser?.id, modal).subscribe(
      (res: any) => {
            this.openSnackBar('User Edited sucessfylly');
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

  AddUserDetails() {
    const formValue = this.EditForm.value; // Get the value of the form group

    let modal = {
      name: formValue?.userName,
      job: formValue?.jobTitle,
    };

    this.publicService.AddUser(modal).subscribe(
      (res: any) => {
            this.openSnackBar('User Add sucessfylly');
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

  selectedRow(index: number , item:any) {
    if (this.selectedRowindex == index) {
      this.selectedRowindex = -1;
      this.selectedUserToView=null;
    } else {
      this.selectedRowindex = index;
      this.selectedUserToView=item;

    }
  }
  onPageChange(page: number): void {
    this.getUsers(page);
  }
  isPreviousDisabled(): boolean {
    return this.currentPage === 1;
  }

  isNextDisabled(): boolean {
    return this.currentPage === this.totlPages;
  }
}
