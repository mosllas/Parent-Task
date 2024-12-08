import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let routerMock: jasmine.SpyObj<Router>;

  beforeEach(() => {
    // Mock the Router service
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: Router, useValue: routerMock },
      ],
    });

    guard = TestBed.inject(AuthGuard);
  });

  it('should allow navigation if user is authenticated', () => {
    spyOn(sessionStorage, 'getItem').and.returnValue('mockToken'); // Simulate a valid token in sessionStorage

    const result = guard.canActivate({} as any, {} as any);

    expect(result).toBeTrue(); // Guard should allow navigation
    expect(routerMock.navigate).not.toHaveBeenCalled(); // No redirection should occur
  });

  it('should deny navigation and redirect to /login if user is not authenticated', () => {
    spyOn(sessionStorage, 'getItem').and.returnValue(null); // Simulate no token in sessionStorage

    const result = guard.canActivate({} as any, {} as any);

    expect(result).toBeFalse(); // Guard should deny navigation
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']); // Should redirect to /login
  });
});
