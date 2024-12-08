import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';
import { PublicService } from '../../services/public.service';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let publicServiceMock: jasmine.SpyObj<PublicService>;
  let snackBarMock: jasmine.SpyObj<MatSnackBar>;

  beforeEach(async () => {
    publicServiceMock = jasmine.createSpyObj('PublicService', ['Login']);
    snackBarMock = jasmine.createSpyObj('MatSnackBar', ['openFromComponent']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, HttpClientModule, MatDialogModule],
      declarations: [LoginComponent],
      providers: [
        { provide: PublicService, useValue: publicServiceMock },
        { provide: MatSnackBar, useValue: snackBarMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the login form with required controls', () => {
    expect(component.loginForm).toBeDefined();
    expect(component.loginForm.get('userName')).toBeTruthy();
    expect(component.loginForm.get('password')).toBeTruthy();
  });

  it('should make form invalid if fields are empty', () => {
    component.loginForm.setValue({ userName: null, password: null });
    expect(component.loginForm.valid).toBeFalse();
  });

  it('should make form valid if fields are filled', () => {
    component.loginForm.setValue({ userName: 'test@example.com', password: '123456' });
    expect(component.loginForm.valid).toBeTrue();
  });

  it('should call the Login method of PublicService on successful login', () => {
    const mockResponse = { token: 'mockToken' };
    publicServiceMock.Login.and.returnValue(of(mockResponse));

    component.loginForm.setValue({ userName: 'test@example.com', password: '123456' });
    component.login();

    expect(publicServiceMock.Login).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: '123456',
    });
    expect(sessionStorage.getItem('token')).toEqual('mockToken');
  });

  it('should show snackbar message on login error', () => {
    const mockError = {
      error: {
        error: 'Invalid login credentials',
      },
    };
    publicServiceMock.Login.and.returnValue(throwError(mockError));

    component.loginForm.setValue({ userName: 'wrong@example.com', password: 'wrongpassword' });
    component.login();

    expect(publicServiceMock.Login).toHaveBeenCalled();
    expect(snackBarMock.openFromComponent).toHaveBeenCalledWith(jasmine.any(Function), {
      data: 'Invalid login credentials',
      duration: 10000,
      panelClass: ['snackbar'],
      verticalPosition: 'bottom',
      horizontalPosition: 'end',
    });
  });

  it('should show a generic error message if the login error response is undefined', () => {
    publicServiceMock.Login.and.returnValue(throwError({}));

    component.loginForm.setValue({ userName: 'wrong@example.com', password: 'wrongpassword' });
    component.login();

    expect(snackBarMock.openFromComponent).toHaveBeenCalledWith(jasmine.any(Function), {
      data: 'An Error Occurred',
      duration: 10000,
      panelClass: ['snackbar'],
      verticalPosition: 'bottom',
      horizontalPosition: 'end',
    });
  });
});
