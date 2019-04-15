import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { ApiService } from './api.service';
import { ConfigService } from './config.service';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders, HttpResponse, HttpRequest, HttpEventType, HttpParams } from '@angular/common/http';
import { Authority } from '../shared/models/authority.model.';

@Injectable()
export class AuthorityService {

  currentUser;
  constructor(
    private apiService: ApiService,
    private config: ConfigService
  ) { }

  getAll() {
    return this.apiService.get(this.config.authorities_url);
  }

  remove(authority: Authority): Observable<any> {
    return this.apiService.delete(this.config.authority_url + `/${authority.id}`, authority).map(() => {
      console.log("Remove success");
    });
  }

  edit(id: number, authority: Authority): Observable<any> {
    return this.apiService.put(this.config.authority_url + `/${id}`, authority).map(() => {
      console.log("Edit success");
    });
  }

  findById(id: number): Observable<any> {
    return this.apiService.get(this.config.authority_url + `/${id}`);
  }

  findByName(name: string): Observable<any> {
    return this.apiService.get(this.config.authority_url + `/${name}`);
  }
}
