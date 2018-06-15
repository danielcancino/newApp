import {animate, Component, keyframes, state, style, transition, trigger} from "@angular/core";
import {LoadingController, NavController, ToastController} from "ionic-angular";
import {APIProvider} from "../../providers";
import {LocalDataProvider} from "../../providers/localdata";
import {Configuracion} from "../configuracion/configuracion";

@Component({
    selector: 'page-login',
    templateUrl: 'login.html',
    animations: [

        //For the logo
        trigger('flyInBottomSlow', [
            state('in', style({
                transform: 'translate3d(0,0,0)'
            })),
            transition('void => *', [
                style({transform: 'translate3d(0,2000px,0'}),
                animate('1000ms ease-in-out')
            ])
        ]),

        //For the login form
        trigger('bounceInBottom', [
            state('in', style({
                transform: 'translate3d(0,0,0)'
            })),
            transition('void => *', [
                animate('1000ms 0ms ease-in', keyframes([
                    style({transform: 'translate3d(0,2000px,0)', offset: 0}),
                    style({transform: 'translate3d(0,-20px,0)', offset: 0.9}),
                    style({transform: 'translate3d(0,0,0)', offset: 1})
                ]))
            ])
        ]),

        //For login button
        trigger('fadeIn', [
            state('in', style({
                opacity: 1
            })),
            transition('void => *', [
                style({opacity: 0}),
                animate('1000ms 1100ms ease-in')
            ])
        ])
    ]
})
export class Login {

    loading: any;
    loginData: any = {
        email: '',
        password: ''
    };


    constructor(public navCtrl: NavController,
                private api: APIProvider,
                private localdata: LocalDataProvider,
                private toastCtrl: ToastController,
                private loadingCtrl: LoadingController) {

    }

    login() {
        this.showLoading();
        this.api.login(this.loginData).then((data: any) => {
            console.log(data);
            if (parseInt(data.response) === 1) {
                this.localdata.getStorage().set('apellido', data.data.apellido);
                this.localdata.getStorage().set('email', data.data.email);
                this.localdata.getStorage().set('full_name', data.data.full_name);
                this.localdata.getStorage().set('idperfil', data.data.idperfil);
                this.localdata.getStorage().set('idusuario', data.data.idusuario);
                this.localdata.getStorage().set('imagen', data.data.imagen);
                this.localdata.getStorage().set('nombre', data.data.nombre);
                this.localdata.getStorage().set('profile_name', data.data.profile_name);
                this.localdata.getStorage().set('imagen', data.data.imagen);
                this.localdata.getStorage().set('rut', data.data.rut);
                this.localdata.getStorage().set('onlogin', 2);

                this.localdata.getStorage().set('data_empresas', JSON.stringify(data.data.sis_empresas));
                this.localdata.getStorage().set('data_temporadas', JSON.stringify(data.data.sis_temporada));
                this.localdata.getStorage().set('data_bodegas', JSON.stringify(data.data.cfg_bodega));


                this.loading.dismiss();
                this.navCtrl.setRoot(Configuracion);
            } else {
                this.loading.dismiss();
                this.presentToast(data.data.error);
            }
        }, (err) => {
            this.loading.dismiss();
            this.presentToast("Usuario o contraseña incorrectos. ");
            console.log(err);
        });
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
