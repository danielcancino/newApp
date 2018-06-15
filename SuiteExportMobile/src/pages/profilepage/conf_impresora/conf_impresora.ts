import {Component, OnInit} from "@angular/core";
import {AlertController, LoadingController, NavController, ToastController, ViewController} from "ionic-angular";
import {ZebraPrinter} from "../../../../plugins/zebra-printer/native/index";
import {LocalDataProvider} from "../../../providers/localdata";


@Component({
    selector: 'page-confimpresora',
    templateUrl: 'conf_impresora.html'
})
export class ConfImpresora implements OnInit {

    loading: any;
    dispositivos = [];
    selecteddevice;
    status = false;
    ajustes = {
        lateral: "0",
        superior: "0"
    };

    constructor(public navCtrl: NavController,
                public viewCtrl: ViewController,
                public alertController: AlertController,
                public localData: LocalDataProvider,
                private toastCtrl: ToastController,
                private loadingCtrl: LoadingController,
                protected zebraPrinter: ZebraPrinter) {

    }

    ngOnInit(): void {
        this.getDevices();
    }

    getDevices() {
        this.zebraPrinter.discover().then(result => {
            this.dispositivos = result;
            this.status = false;
        }).catch(err => {
            this.dispositivos = [];
            console.error(err);
            this.status = false;
            this.presentToast("Error obteniendo los dispositivos");
        });
    }

    testPrint() {
        this.showLoading();
        let _th = this;

        _th.localData._find("SELECT code FROM `cfg_v_conf_print`;", []).then((rows) => {
        console.log(rows);
        }).catch((e) => {
            console.log(e);
        });




        let printabletest = "^XA^FO20,20^A0N,25,25^FDPrueba de impresion realizada con exito.^FS^XZ";
        _th.zebraPrinter.isConnected().then((r) => {
            if (r) {
                _th.zebraPrinter.print(printabletest).then(result => {
                    console.log(result);
                    console.log(_th);
                    _th.loading.dismiss();
                    _th.status = true;
                    _th.presentToast("Prueba realizada con éxito");
                }).catch(err => {
                    console.log(err);
                    _th.loading.dismiss();
                    _th.presentToast("No se ha podido realizar la impresión");
                });
            } else {
                _th.zebraPrinter.connect(_th.selecteddevice.address).then((result) => {
                    console.log(result);
                    _th.zebraPrinter.print(printabletest).then(result => {
                        console.log(result);
                        _th.loading.dismiss();
                        _th.status = true;
                        _th.presentToast("Prueba realizada con éxito");
                    }).catch(err => {
                        console.log(err);
                        _th.loading.dismiss();
                        _th.presentToast("No se ha podido realizar la impresión");
                    });
                }).catch(err => {
                    console.log(err);
                    _th.loading.dismiss();
                    _th.presentToast("No se ha podido establecer la conexión");
                });
            }
        }).catch(err => {
            console.log(err);
            _th.loading.dismiss();
            _th.presentToast("No se ha podido establecer la conexión");
        });
    }

    doRefresh(e) {
        setTimeout(() => {
            this.zebraPrinter.discover().then(result => {
                this.dispositivos = result;
                e.complete();
            }).catch(err => {
                e.complete();
                this.dispositivos = [];
                console.error(err);
                this.presentToast("Error obteniendo los dispositivos");
            });
        }, 500);
    }

    save() {
        this.localData.getStorage().set("impresora_mac", this.selecteddevice.address);
        this.localData.getStorage().set("impresora_name", this.selecteddevice.name);
        this.localData.getStorage().set("impresora_lat", this.ajustes.lateral);
        this.localData.getStorage().set("impresora_sup", this.ajustes.superior);
        this.presentToast("Se ha guardado con éxito");
        this.dismiss();
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
