import {Component, OnInit} from "@angular/core";
import {DomSanitizer} from "@angular/platform-browser";
import {AlertController, ModalController, NavController, ViewController} from "ionic-angular";
import {LocalDataProvider} from "../../providers/localdata";
import {Login} from "../login/login";
import {ConfImpresora} from "./conf_impresora/conf_impresora";

@Component({
    selector: 'page-profilepage',
    templateUrl: 'profilepage.html'
})
export class ProfilePage implements OnInit {

    data: Object = <any>Object;
    impresora:String = "-";

    constructor(public navCtrl: NavController,
                public viewCtrl: ViewController,
                public localdata: LocalDataProvider,
                public alertController: AlertController,
                private modalCtrl: ModalController,
                public sanitization: DomSanitizer) {
    }

    ngOnInit(): void {
        this.localdata.getStorage().get('current_empresa_data').then((datae) => {
            let emp = JSON.parse(datae);
            Object.defineProperty(this.data, 'empresa', {
                value: emp.razon_social,
                writable: true
            });
            this.localdata.getStorage().get('current_temporada_data').then((datat) => {
                let temp = JSON.parse(datat);
                Object.defineProperty(this.data, 'temporada', {
                    value: temp.temporada,
                    writable: true
                });
                this.localdata.getStorage().get('current_bodega_data').then((datab) => {
                    let bod = JSON.parse(datab);
                    Object.defineProperty(this.data, 'bodega', {
                        value: bod.cod_bodega + ' - ' + bod.descripcion,
                        writable: true
                    });
                    this.localdata.getStorage().get('full_name').then((datab) => {
                        Object.defineProperty(this.data, 'user', {value: datab, writable: true});
                    });
                    this.localdata.getStorage().get('email').then((datab) => {
                        Object.defineProperty(this.data, 'email', {value: datab, writable: true});
                    });
                    this.localdata.getStorage().get('profile_name').then((datab) => {
                        Object.defineProperty(this.data, 'profile_name', {value: datab, writable: true});
                    });
                    this.localdata.getStorage().get("impresora_mac").then((datab) => {
                        Object.defineProperty(this.data, 'impresora_mac', {value: datab, writable: true});
                    });
                    this.localdata.getStorage().get("impresora_name").then((datab) => {
                        Object.defineProperty(this.data, 'impresora_name', {value: datab, writable: true});
                    });;

                    this.localdata.getStorage().get('imagen').then((str) => {
                        let img: any = null;
                        if ((str !== null) && (str !== '')) {
                            img = this.sanitization.bypassSecurityTrustStyle(`url(${str})`);
                        } else {
                            img = this.sanitization.bypassSecurityTrustStyle(`url(../../assets/imgs/user.png)`);
                        }
                        Object.defineProperty(this.data, 'imagen', {value: img, writable: true});
                    });

                });
            });
        });
    }

    configurarImpresora(){
        let confModal = this.modalCtrl.create(ConfImpresora);
        confModal.present();
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

    close() {
        let confirm = this.alertController.create({
            title: 'Confirmación',
            message: '¿Está realmente seguro que desea cerrar la sesión?, Se procederá a cerrar la sesión y se perderán todos los datos del dispositivo que no esten sincronizados con el servidor',
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
                        this.dismiss();

                        this.navCtrl.setRoot(Login);
                    }
                }
            ]
        });
        confirm.present();
    }
}
