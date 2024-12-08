import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { loginGuard } from './login-guard.guard';

describe('loginGuard', () => {
  let guard: loginGuard;
  let routerMock: jasmine.SpyObj<Router>;

  beforeEach(() => {
    // Create a mock router
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        loginGuard,
        { provide: Router, useValue: routerMock },
      ],
    });

    guard = TestBed.inject(loginGuard);
  });

  it('should allow activation if the user is authenticated', () => {
    spyOn(sessionStorage, 'getItem').and.returnValue('mockToken'); // Simulate a token in sessionStorage

    const result = guard.canActivate({} as any, {} as any);

    expect(result).toBeTrue(); // Expect guard to allow activation
    expect(routerMock.navigate).not.toHaveBeenCalled(); // Ensure no redirection
  });

  it('should deny activation and redirect to login if the user is not authenticated', () => {
    spyOn(sessionStorage, 'getItem').and.returnValue(null); // Simulate no token in sessionStorage

    const result = guard.canActivate({} as any, {} as any);

    expect(result).toBeFalse(); // Expect guard to deny activation
    expect(routerMock.navigate).toHaveBeenCalledWith(['']); // Ensure redirection to login
  });
});
