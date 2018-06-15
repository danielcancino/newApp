import {Component} from "@angular/core";
import {ActionSheetController, LoadingController, ModalController, NavController, NavParams} from "ionic-angular";
import {ProfilePage} from "../profilepage/profilepage";
import {AgregarMPModal} from "./modal_add/agregar_modal";
import {DetailMPModal} from "./modal_detail/detail_modal";
import {DashboardPage} from "../dashboard/dashboard";
import {LocalDataProvider} from "../../providers/localdata";
@Component({
    selector: 'page-recepcionmp',
    templateUrl: 'recepcion_mp.html'
})
export class RecepcionMP {

    data: any = {
        oTable: <any> []
    };

    constructor(public navCtrl: NavController,
                private loadingCtrl: LoadingController,
                public localData: LocalDataProvider,
                public params: NavParams,
                public actionsheetCtrl: ActionSheetController,
                private modalCtrl: ModalController) {
    }

    ngOnInit() {
        this.getTable();
    }

    private get(id: String) {
        this.showLoading();
        let addModal = this.modalCtrl.create(AgregarMPModal, {idrecepcion: id});
        setTimeout(() => {
            addModal.onDidDismiss(() => {
                this.getTable()
            });
            addModal.present().then(() => {
                this.data.loading.dismiss();
            }).catch((e) => {
                console.log('errorr get');
            });
        }, 500);

    }

    private delete(id) {
        this.showLoading();
        this.localData._executeSql("DELETE FROM `prod_recepcion` WHERE `idrecepcion`=?;", [id], () => {
            this.getTable();
            this.data.loading.dismiss();
        });
    }

    private  getTable() {
        let seft = this;
        seft.localData._find(this.localData.GetView('prod_v_recepcion') + " WHERE activo=1 AND tipo_recepcion='MP';", []).then((rows: Array<any>) => {
            seft.data.oTable = <any>  [];
            for (const value of rows) {
                seft.data.oTable.push({
                    idrecepcion: value.idrecepcion,
                    idserver: value.idserver,
                    cod_predio: value.desc_predio,
                    desc_predio: value.desc_predio,
                    guia: value.guia,
                    especie: value.desc_espe_full,
                    fecha_recepcion: value.fecha_recepcion_i
                });
            }
        }).catch((e) => {
            console.log(e);
        });


    }

    profileUser() {
        let profileModal = this.modalCtrl.create(ProfilePage);
        profileModal.present();
    }

    open_add() {
        let addModal = this.modalCtrl.create(AgregarMPModal);
        addModal.onDidDismiss(() => {
            this.getTable()
        });
        addModal.present();
    }

    open_detail() {
        let datailModal = this.modalCtrl.create(DetailMPModal);
        datailModal.onDidDismiss(() => {

        });
        datailModal.present();
    }

    dashboard() {
        let addModal = this.modalCtrl.create(DashboardPage);
        addModal.onDidDismiss(() => {
            this.getTable()
        });
        addModal.present();

    }

    openMenu(recepcion) {
        let seft = this;
        let arrbuttons = [];
        arrbuttons.push({
            text: 'Editar',
            icon: 'create',
            handler: () => {
                seft.get(recepcion.idrecepcion);
            }
        });
        console.log(recepcion.idserver);
        if (recepcion.idserver==0) {
            arrbuttons.push({
                text: 'Eliminar',
                role: 'destructive',
                icon: 'close-circle',
                handler: () => {
                    seft.delete(recepcion.idrecepcion);
                }
            });
        }
        arrbuttons.push({
            text: 'Cancel',
            role: 'cancel', // will always sort to be on the bottom
            // icon: !this.platform.is('ios') ? 'close' : null,
            icon: 'close',
            handler: () => {
                console.log('Cancel clicked');
            }
        });
        let actionSheet = this.actionsheetCtrl.create({
            title: ' Guía : ' + recepcion.guia,
            cssClass: 'action-sheets-basic-page',
            buttons: arrbuttons
        });
        actionSheet.present();
    }


    showLoading() {
        this.data.loading = this.loadingCtrl.create({
            content: 'Cargando...',
            dismissOnPageChange: true
        });
        this.data.loading.present();
    }

}
