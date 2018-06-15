import {Component, OnInit} from "@angular/core";
import {AlertController, LoadingController, NavController, ToastController, ViewController} from "ionic-angular";
import {LocalDataProvider} from "../../providers/localdata";
import {APIProvider} from "../../providers/api";

@Component({
    selector: 'page-dashboard',
    templateUrl: 'dashboard.html'
})
export class DashboardPage implements OnInit {

    loading: any;

    constructor(public navCtrl: NavController,
                public viewCtrl: ViewController,
                public apiProvider: APIProvider,
                public localdata: LocalDataProvider,
                public alertController: AlertController,
                private toastCtrl: ToastController,
                private loadingCtrl: LoadingController) {

    }

    ngOnInit(): void {

    }

    download() {
        let confirm = this.alertController.create({
            title: 'Confirmación',
            message: '¿Está seguro que desea sobreescribir todos los datos sincronizados?',
            buttons: [
                {
                    role: 'cancel',
                    text: 'Cancelar',
                    handler: () => {
                    }
                },
                {
                    text: 'Aceptar',
                    handler: () => {
                        this.showLoading();
                        try {
                            this.apiProvider.reSync().then((result) => {
                                this.loading.dismiss();
                                if (result) {
                                    this.presentToast("Se ha sincronizado correctamente");
                                } else {
                                    this.presentToast("A ocurrido un error sincronizando code:x1");
                                }
                            }, (err) => {
                                console.log(err);
                                this.loading.dismiss();
                                this.presentToast("A ocurrido un error sincronizando code:x2");
                            });
                        } catch (e) {
                            console.log(e);
                            this.loading.dismiss();
                            this.presentToast("A ocurrido un error sincronizando code:x3");
                        }
                    }
                }
            ]
        });
        confirm.present();

    }

    upload() {
        let confirm = this.alertController.create({
            title: 'Confirmación',
            message: '¿Está seguro que desea enviar?',
            buttons: [
                {
                    role: 'cancel',
                    text: 'Cancelar',
                    handler: () => {
                    }
                },
                {
                    text: 'Aceptar',
                    handler: () => {
                        this.showLoading();
                        try {
                            this.apiProvider.sendSync().then((result) => {
                                this.loading.dismiss();
                                if (result) {
                                    this.presentToast("Se ha sincronizado correctamente");
                                } else {
                                    this.presentToast("A ocurrido un error sincronizando code:x4");
                                }
                            }, (err) => {
                                console.log(err);
                                this.loading.dismiss();
                                this.presentToast("A ocurrido un error sincronizando code:x5");
                            });
                        } catch (e) {
                            console.log(e);
                            this.loading.dismiss();
                            this.presentToast("A ocurrido un error sincronizando code:x6");
                        }
                    }
                }
            ]
        });
        confirm.present();
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

    showLoading() {
        this.loading = this.loadingCtrl.create({
            content: 'Espere...',
            dismissOnPageChange: true
        });
        this.loading.present();
    }

    presentToast(msg) {
        let toast = this.toastCtrl.create({
            message: msg,
            duration: 3000,
            position: 'bottom',
            dismissOnPageChange: true
        });

        toast.onDidDismiss(() => {
        });

        toast.present();
    }
}
