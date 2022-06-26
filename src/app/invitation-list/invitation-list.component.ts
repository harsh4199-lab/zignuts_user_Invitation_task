import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HelperFunctionsService } from '../services/helper-functions.service';
import invitation from '../../../src/assets/js/invitations.json';
import updatedInvitationList from '../../../src/assets/js/invitations_update.json';

@Component({
  selector: 'app-invitation-list',
  templateUrl: './invitation-list.component.html',
  styleUrls: ['./invitation-list.component.scss']
})
export class InvitationListComponent implements OnInit {

  userInvitationsList: any = [];
  userName = "";
  updatedInvitationListArray = updatedInvitationList.invites;
  isUserLogout = false;

  constructor(private router: Router, private helperService: HelperFunctionsService, private toastr: ToastrService) { }

  ngOnInit(): void {
    let user: any = this.helperService.getLoginUserDetails(undefined);
    let userId: any;
    if (user == undefined) {
      userId = sessionStorage.getItem("userId");
    }
    else {
      userId = user.user_id;
    }
    this.getUserInvitationList(userId)
    setTimeout(() => {
      this.updateInvitationList(userId)
    }, 5000);
  }

  getUserInvitationList(userId: any) {
    let userInvitationsList: any = invitation.invites.filter((item: any) => item.user_id == parseInt(userId));
    this.userName = userInvitationsList[0].sender_id;
    userInvitationsList.forEach((item: any) => {
      item.invite_time = this.convertNumberToFormatedTime(item.invite_time);
      item.invite = item.invite.replace("\\n", ". ");
    })
    this.userInvitationsList = userInvitationsList;
  }

  convertNumberToFormatedTime(number:any){
    if(!isNaN(number)){
      let unix_timestamp = number;
      var date = new Date(unix_timestamp * 1000);
      var hours = "0" + date.getHours();
      var minutes = "0" + date.getMinutes();
      var seconds = "0" + date.getSeconds();
      var formattedTime = hours.substr(-2) + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
      return formattedTime;
    }
    return number;
  }

  updateInvitationList(userId: any) {
  if (this.isUserLogout) {
      return;
    }
    let time = 0;
    let updatedInvitation: any = this.updatedInvitationListArray.shift();
    updatedInvitation.invite_time = this.convertNumberToFormatedTime(updatedInvitation.invite_time);
    updatedInvitation.invite = updatedInvitation.invite.replace("\\n", ". ");

    let index = this.userInvitationsList.findIndex((item: any) => item.invite_id == updatedInvitation.invite_id);
    if (index != -1) {
      time = 5000;
      if (updatedInvitation.user_id != userId) {
        this.userInvitationsList.splice(index, 1);
      }
      else {
        this.userInvitationsList.splice(index, 1, updatedInvitation);
      }
      this.toastr.info(`updated invitation Id:${updatedInvitation.invite_id}`, "Updated", { timeOut: 2500 });
    }
    else if (updatedInvitation.user_id == userId) {
      time = 5000;
      this.userInvitationsList.push(updatedInvitation);
      this.toastr.info(`added invitation Id:${updatedInvitation.invite_id}`, "Added", { timeOut: 2500 });
    }

    if (this.updatedInvitationListArray.length) {
      setTimeout(() => {
        this.updateInvitationList(userId)
      }, time)
    }
    else {
      this.toastr.success(`All data has been updated`, "success", { timeOut: 5000 });
    }
  }

  logOut() {
    this.isUserLogout = true;
    this.router.navigate(["/"]);
    sessionStorage.clear();
  }

}
