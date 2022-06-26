import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HelperFunctionsService {
  userDetails:any = undefined;
  constructor() { }

  getLoginUserDetails(user:any){
    if(user){
      this.userDetails = user;
    }
    return this.userDetails;
  }
}
