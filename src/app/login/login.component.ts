import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import userData from '../../../src/assets/js/users.json'
import { HelperFunctionsService } from '../services/helper-functions.service';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  userEmail = "";
  userPassword = "";

  constructor(private router: Router, private helperService: HelperFunctionsService, private toastr: ToastrService) { }

  ngOnInit(): void {
  }

  logIn() {
    let user = userData.users.find((item: any) => item.email == this.userEmail && item.password == this.userPassword);
    if (user) {
      this.toastr.success("You have loged in successfully", "Success", { timeOut: 1500 });
      this.helperService.getLoginUserDetails(user);
      this.encryptPassword(this.userPassword);
      this.router.navigate(["/invitation-list"]);
      sessionStorage.setItem("userId", user.user_id.toString());
    }
    else {
      this.toastr.error("Invalid username or password", "Error", { timeOut: 1500 });
    }
  }

  encryptPassword(password: any) {
    var key = CryptoJS.enc.Utf8.parse("8080808080808080");
    var iv = CryptoJS.enc.Utf8.parse("8080808080808080"); 
    var encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(password), key,
      {
        keySize: 128 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });
    sessionStorage.setItem("userPassword", encrypted.toString());
  }

  showPassword = false;
  togglePasswordMode(){
    this.showPassword = !this.showPassword;
  }

}
