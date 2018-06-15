import {Component} from '@angular/core';
import {AlertController, LoadingController, NavController, ToastController} from 'ionic-angular';
// import {APIProvider} from "../../providers";
import {LocalDataProvider} from "../../providers/localdata";
import {Login} from "../login/login";
import {TabsPage} from "../tabs/tabs";

@Component({
    selector: 'page-configuracion',
    templateUrl: 'configuracion.html'
})
export class Configuracion {

    loading: any;

    confdata: any = {
        idempresa: '',
        idtemporada: '',
        idbodega: ''
    };

    empresas: any;
    temporadas: any;
    bodegas: any;

    constructor(public navCtrl: NavController,
                // private api: APIProvider,
                private localdata: LocalDataProvider,
                private toastCtrl: ToastController,
                private loadingCtrl: LoadingController,
                public alertController: AlertController) {

        localdata.getStorage().get('data_empresas').then((empresas) => {
            this.empresas = JSON.parse(empresas);
        });
    }

    parseTyB() {
        this.showLoading();
        this.localdata.getStorage().get('data_temporadas').then((temporadas) => {
            console.log(temporadas);
            let temp = JSON.parse(temporadas);
            this.temporadas = temp[this.confdata.idempresa];

            this.localdata.getStorage().get('data_bodegas').then((bodegas) => {
                let bods = JSON.parse(bodegas);
                this.bodegas = [];
                for (let b of bods) {
                    if (b.idempresa == this.confdata.idempresa) {
                        this.bodegas.push(b);
                    }
                }
                this.loading.dismiss();
            });
        });
    }

    accept() {
        this.localdata.getStorage().set('configured', 2);
        this.localdata.getStorage().set('current_empresa', this.confdata.idempresa);
        for (let emp of this.empresas) {
            if (emp.idempresa == this.confdata.idempresa) {
                this.localdata.getStorage().set('current_empresa_data', JSON.stringify(emp));
            }
        }
        this.localdata.getStorage().set('current_temporada', this.confdata.idtemporada);
        for (let temp of this.temporadas) {
            if (temp.idtemporada == this.confdata.idtemporada) {
                this.localdata.getStorage().set('current_temporada_data', JSON.stringify(temp));
            }
        }
        this.localdata.getStorage().set('current_bodega', this.confdata.idbodega);
        for (let bod of this.bodegas) {
            if (bod.idbodega == this.confdata.idbodega) {
                this.localdata.getStorage().set('current_bodega_data', JSON.stringify(bod));
            }
        }
        this.navCtrl.setRoot(TabsPage);

    }

    close() {
        let confirm = this.alertController.create({
            title: 'Confirmación',
            message: '¿Está realmente seguro que desea cancelar la configuración?',
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
                        this.localdata.getStorage().clear();
                        this.navCtrl.setRoot(Login);
                    }
                }
            ]
        });
        confirm.present();
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
