import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserListComponent } from './user-list.component';
import { PublicService } from '../../services/public.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;
  let publicServiceMock: jasmine.SpyObj<PublicService>;
  let snackBarMock: jasmine.SpyObj<MatSnackBar>;

  beforeEach(async () => {
    publicServiceMock = jasmine.createSpyObj('PublicService', [
      'GetUsers',
      'DeleteUser',
      'EditUser',
      'AddUser',
    ]);
    snackBarMock = jasmine.createSpyObj('MatSnackBar', ['openFromComponent']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [UserListComponent],
      providers: [
        { provide: PublicService, useValue: publicServiceMock },
        { provide: MatSnackBar, useValue: snackBarMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getUsers', () => {
    it('should fetch users and update paginated users on success', () => {
      const mockResponse = {
        data: [{ id: 1, name: 'John' }, { id: 2, name: 'Doe' }],
        total_pages: 1,
        per_page: 2,
      };
      publicServiceMock.GetUsers.and.returnValue(of(mockResponse));

      component.getUsers();

      expect(publicServiceMock.GetUsers).toHaveBeenCalledWith(component.currentPage);
      expect(component.users).toEqual(mockResponse.data);
      expect(component.paginatedusers).toEqual(mockResponse.data);
      expect(component.totlPages).toEqual(mockResponse.total_pages);
    });

    it('should show an error message if fetching users fails', () => {
      publicServiceMock.GetUsers.and.returnValue(throwError({ error: { error: 'Error message' } }));

      component.getUsers();

      expect(snackBarMock.openFromComponent).toHaveBeenCalledWith(jasmine.any(Function), {
        data: 'Error message',
        duration: 10000,
        panelClass: ['snackbar'],
        verticalPosition: 'bottom',
        horizontalPosition: 'end',
      });
    });
  });

  describe('DeleteUser', () => {
    it('should delete user and show a success message', () => {
      publicServiceMock.DeleteUser.and.returnValue(of({}));

      component.selectedUser = { id: 1 };
      component.DeleteUser();

      expect(publicServiceMock.DeleteUser).toHaveBeenCalledWith(1);
      expect(snackBarMock.openFromComponent).toHaveBeenCalledWith(jasmine.any(Function), {
        data: 'User Deleted',
        duration: 10000,
        panelClass: ['snackbar'],
        verticalPosition: 'bottom',
        horizontalPosition: 'end',
      });
    });

    it('should show an error message if deleting user fails', () => {
      publicServiceMock.DeleteUser.and.returnValue(throwError({ error: { error: 'Error message' } }));

      component.selectedUser = { id: 1 };
      component.DeleteUser();

      expect(snackBarMock.openFromComponent).toHaveBeenCalledWith(jasmine.any(Function), {
        data: 'Error message',
        duration: 10000,
        panelClass: ['snackbar'],
        verticalPosition: 'bottom',
        horizontalPosition: 'end',
      });
    });
  });

  describe('EditUserDetails', () => {
    it('should edit user and show a success message', () => {
      publicServiceMock.EditUser.and.returnValue(of({}));

      component.EditForm.setValue({ userName: 'John', jobTitle: 'Developer' });
      component.selectedUser = { id: 1 };
      component.EditUserDetails();

      expect(publicServiceMock.EditUser).toHaveBeenCalledWith(1, {
        name: 'John',
        job: 'Developer',
      });
      expect(snackBarMock.openFromComponent).toHaveBeenCalledWith(jasmine.any(Function), {
        data: 'User Edited sucessfylly',
        duration: 10000,
        panelClass: ['snackbar'],
        verticalPosition: 'bottom',
        horizontalPosition: 'end',
      });
    });

    it('should show an error message if editing user fails', () => {
      publicServiceMock.EditUser.and.returnValue(throwError({ error: { error: 'Error message' } }));

      component.EditForm.setValue({ userName: 'John', jobTitle: 'Developer' });
      component.selectedUser = { id: 1 };
      component.EditUserDetails();

      expect(snackBarMock.openFromComponent).toHaveBeenCalledWith(jasmine.any(Function), {
        data: 'Error message',
        duration: 10000,
        panelClass: ['snackbar'],
        verticalPosition: 'bottom',
        horizontalPosition: 'end',
      });
    });
  });

  describe('AddUserDetails', () => {
    it('should add user and show a success message', () => {
      publicServiceMock.AddUser.and.returnValue(of({}));

      component.EditForm.setValue({ userName: 'Jane', jobTitle: 'Tester' });
      component.AddUserDetails();

      expect(publicServiceMock.AddUser).toHaveBeenCalledWith({
        name: 'Jane',
        job: 'Tester',
      });
      expect(snackBarMock.openFromComponent).toHaveBeenCalledWith(jasmine.any(Function), {
        data: 'User Add sucessfylly',
        duration: 10000,
        panelClass: ['snackbar'],
        verticalPosition: 'bottom',
        horizontalPosition: 'end',
      });
    });

    it('should show an error message if adding user fails', () => {
      publicServiceMock.AddUser.and.returnValue(throwError({ error: { error: 'Error message' } }));

      component.EditForm.setValue({ userName: 'Jane', jobTitle: 'Tester' });
      component.AddUserDetails();

      expect(snackBarMock.openFromComponent).toHaveBeenCalledWith(jasmine.any(Function), {
        data: 'Error message',
        duration: 10000,
        panelClass: ['snackbar'],
        verticalPosition: 'bottom',
        horizontalPosition: 'end',
      });
    });
  });

  describe('Pagination', () => {
    it('should fetch users for the specified page', () => {
      spyOn(component, 'getUsers');
      component.onPageChange(2);

      expect(component.getUsers).toHaveBeenCalledWith(2);
    });

    it('should disable "Previous" button on the first page', () => {
      component.currentPage = 1;
      expect(component.isPreviousDisabled()).toBeTrue();
    });

    it('should disable "Next" button on the last page', () => {
      component.currentPage = component.totlPages = 3;
      expect(component.isNextDisabled()).toBeTrue();
    });
  });
});
