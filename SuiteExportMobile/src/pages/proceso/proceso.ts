import {Component} from '@angular/core';
import {ModalController, NavController} from 'ionic-angular';
import {ProfilePage} from "../profilepage/profilepage";

@Component({
    selector: 'page-proceso',
    templateUrl: 'proceso.html'
})
export class Proceso {

    constructor(public navCtrl: NavController,
                private modalCtrl: ModalController) {

    }

    profileUser() {
        let profileModal = this.modalCtrl.create(ProfilePage);
        profileModal.present();
    }
}
