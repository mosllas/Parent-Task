import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root', // This ensures the service is globally available
})
export class PublicService {
  private baseUrl = 'https://reqres.in/';
  private loginUrl = this.baseUrl + 'api/login';
  private usersUrl = this.baseUrl + 'api/users?page=';
  private deleteusersUrl = this.baseUrl + 'api/users/';
  private editusersUrl = this.baseUrl + 'api/users/';
  private addusersUrl = this.baseUrl + 'api/users';

  constructor(private http: HttpClient) {}

  Login(model: any): Observable<any> {
    return this.http.post<any>(this.loginUrl, model);
  }
  GetUsers(model: any): Observable<any> {
    return this.http.get<any>(this.usersUrl + model);
  }
  DeleteUser(model: any): Observable<any> {
    return this.http.delete<any>(this.deleteusersUrl + model);
  }

  EditUser(id: any, modal: any): Observable<any> {
    return this.http.put<any>(this.editusersUrl + id, modal);
  }
  AddUser( modal: any): Observable<any> {
    return this.http.post<any>(this.addusersUrl , modal);
  }
}
