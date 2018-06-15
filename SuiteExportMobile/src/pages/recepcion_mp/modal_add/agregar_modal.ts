import {Component, OnInit} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {
    AlertController,
    LoadingController,
    ModalController,
    NavController,
    NavParams,
    ViewController
} from "ionic-angular";
import {DetailMPModal} from "../modal_detail/detail_modal";
import {LocalDataProvider} from "../../../providers/localdata";
import moment from "moment";

// example date http://plnkr.co/edit/MHjUdC?p=preview
// example https://stackblitz.com/edit/angular-forms-validation?file=app%2Fapp.component.ts

@Component({
    selector: 'page-agregar_modal',
    templateUrl: 'agregar_modal.html'
})
export class AgregarMPModal implements OnInit {
    form: FormGroup;

    ///////////////////
    data: any = {
        oTable: <any> [],
        idrecepcion: null,
        loading: null,
        serie_lote: null,
        idbodega: null,
        idtemporada: null,
        predios: <any> [],
        especies: <any> [],
        transportes: <any> [],
        handlerNext: false
    };


    constructor(public navCtrl: NavController,
                private fb: FormBuilder,
                public viewCtrl: ViewController,
                public localData: LocalDataProvider,
                private modalCtrl: ModalController,
                public params: NavParams,
                private loadingCtrl: LoadingController,
                public alertController: AlertController) {
        this.data.idrecepcion = params.get('idrecepcion');

    }

    ngOnInit() {
        this.initForm();
    }

    ionViewWillEnter() {
        let id = this.data.idrecepcion;

        ////////cfg_predio////
        this.localData._find("SELECT idpredio,idbodega,cod_predio,descripcion FROM `cfg_predio` WHERE productor=1;", []).then((rows) => {
            this.data.predios = rows;
        }).catch((e) => {
            console.log(e);
        });

        ////////cfg_especie////
        // this.localData.getStorage().get('current_bodega').then(() => {
        this.localData._find("SELECT idespecie,cod_especie,descripcion FROM `cfg_especie`;", []).then((rows) => {
            this.data.especies = rows;
        }).catch((e) => {
            console.log(e);
        });
        ////////cfg_entidad////
        this.localData._find("SELECT identidad,codigo_entidad,nombre FROM `cfg_entidad` WHERE  empresa_transporte=1;", []).then((rows) => {
            this.data.transportes = rows;
        }).catch((e) => {
            console.log(e);
        });
        this.localData.getStorage().get('current_temporada').then((idtemporada) => {
            this.data.idtemporada = idtemporada;
            this.localData.getStorage().get('current_bodega').then((idbodega) => {
                this.data.idbodega = idbodega;
            });
        });

        if (id) {
            this.editar(id);
        } else {
            this.form.patchValue({
                fecha_guia_despacho: new Date().toISOString(),
                fecha_recepcion: new Date().toISOString(),
                hora_recepcion: moment().format()
            });
        }
    }

    /** Инициализация формы */
    private initForm(): void {
        this.form = this.fb.group({
            idpredio: [null, [Validators.required]],
            guia: [null, [Validators.required]],
            idespecie: [null, [Validators.required]],
            fecha_guia_despacho: [null, [Validators.required]],
            fecha_recepcion: [null, [Validators.required]],
            hora_recepcion: [null, [Validators.required]],
            identidad_transporte: [null, [Validators.required]],
            chofer: [null, [Validators.required]],
            camion: [null, [Validators.required]],
            patente_carro: [null, []],
            observacion: [null, []],
            // name: [null, [
            //     Validators.required,
            //     Validators.pattern(/^[A-z0-9]*$/),
            //     Validators.minLength(3)],
            //     [this.nameAsyncValidator.bind(this)]
            // ],
            // password: [null, [
            //     Validators.required,
            //     this.passwordValidator]
            // ]
        });
    }

    public onSubmit(): void {
        const controls = this.form.controls;
        Object.keys(controls).forEach(key => {
            controls[key].markAsTouched();
        });
        if (this.form.valid) {
            this.showLoading();
            this.guardar(this.form.value);
        } else {
            // let datailModal = this.modalCtrl.create(DetailMPModal, {parentModel: this.form});
            // datailModal.present();
            // validate all form fields
        }
    }

    private  guardar(p) {
        let id = this.data.idrecepcion;
        let str = "?,";
        this.localData.getStorage().get('idusuario').then((idusuario) => {
            if (id == null) {
                let sql = "INSERT INTO `prod_recepcion` (\
                `tipo_recepcion`,\
                `idtemporada`,\
                `idbodega`,\
                `idpredio`,\
                `guia`,\
                `fecha_guia_despacho`,\
                `fecha_recepcion`,\
                `identidad_transporte`,\
                `chofer`,\
                `patente_camion`,\
                `patente_carro`,\
                `idespecie`,\
                `observaciones`,\
                `idcreador`,\
                `fecha_creacion`,\
                `activo`\
                ) VALUES ";
                let values = [];
                values.push('MP');
                values.push(this.data.idtemporada);
                values.push(this.data.idbodega);
                values.push(p.idpredio);
                values.push(p.guia);
                values.push(p.fecha_guia_despacho);
                values.push(p.fecha_recepcion);
                values.push(p.identidad_transporte);
                values.push(p.chofer);
                values.push(p.camion);
                values.push(p.patente_carro);
                values.push(p.idespecie);
                values.push(p.observaciones);
                values.push(idusuario);
                values.push(new Date().toISOString());
                values.push(1);
                sql += "(" + str.repeat(values.length).slice(0, -1) + "),";
                sql = sql.slice(0, -1);
                this.localData._executeSql(sql, values, (last_id) => {
                    console.log(last_id + '=>save');
                    this.data.loading.dismiss();
                    Object.defineProperty(this.form, 'idrecepcion', {
                        value: last_id,
                        writable: true
                    });
                    this.set_serie_lote(p.idpredio, p.guia);
                    let datailModal = this.modalCtrl.create(DetailMPModal, {parentModel: this.form});
                    datailModal.present();
                });

            } else {
                let sql = "UPDATE `prod_recepcion` SET\
                    `guia` = ?,\
                    `fecha_guia_despacho` = ?,\
                    `fecha_recepcion` = ?,\
                    `identidad_transporte` = ?,\
                    `chofer` = ?,\
                    `patente_camion` = ?,\
                    `patente_carro` = ?,\
                    `idespecie` = ?,\
                    `idmodificador` = ?,\
                    `fecha_edicion` = ?,\
                    `observaciones` = ?\
                WHERE  `idrecepcion` = '" + id + "';";
                let values = [];
                values.push(p.guia);
                values.push(p.fecha_guia_despacho);
                values.push(p.fecha_recepcion);
                values.push(p.identidad_transporte);
                values.push(p.chofer);
                values.push(p.camion);
                values.push(p.patente_carro);
                values.push(p.idespecie);
                values.push(idusuario);
                values.push(new Date().toISOString());
                values.push(p.observaciones);
                sql += "(" + str.repeat(values.length).slice(0, -1) + "),";
                sql = sql.slice(0, -1);
                this.localData._executeSql(sql, values, () => {
                    Object.defineProperty(this.form, 'idrecepcion', {
                        value: id,
                        writable: true
                    });
                    Object.defineProperty(this.form, 'touched', {
                        value: false,
                        writable: true
                    });
                    this.set_serie_lote(p.idpredio, p.guia);
                    this.data.loading.dismiss();
                    if (this.data.handlerNext) {
                        let datailModal = this.modalCtrl.create(DetailMPModal, {parentModel: this.form});
                        datailModal.present();
                    }
                });
            }
        });
    }

    private  editar(id: string) {
        this.showLoading();
        this.localData._find("SELECT * FROM `prod_recepcion` WHERE idrecepcion = ?;", [id]).then((rows: Array<any>) => {
            for (const value of rows) {
                this.form.patchValue({
                    idpredio: value.idpredio,
                    guia: value.guia,
                    idespecie: value.idespecie,
                    fecha_guia_despacho: value.fecha_guia_despacho,
                    fecha_recepcion: value.fecha_recepcion,
                    hora_recepcion: value.fecha_recepcion,
                    identidad_transporte: value.identidad_transporte,
                    chofer: value.chofer,
                    camion: value.patente_camion,
                    patente_carro: value.patente_carro,
                    observacion: value.observaciones,
                });
            }
            this.data.loading.dismiss();
        }).catch((e) => {
            console.log(e);
        });

    }

    private  set_serie_lote(id: string, guia: string) {
        let _cod = null;
        for (const value of this.data.predios) {
            if (value.idpredio == id) {
                _cod = value.cod_predio
            }
        }

        Object.defineProperty(this.form, 'serie_lote', {
            value: _cod + '-' + guia,
            writable: false
        });
    }


////////////////////////////////////////////////////////////////////////////
    dismiss() {
        if (this.form.touched) {
            let confirm = this.alertController.create({
                title: 'Confirmación',
                message: '¿Está  seguro que desea cerrar sin guardar?',
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
                            this.form.reset()
                            this.viewCtrl.dismiss();
                        }
                    }
                ]
            });
            confirm.present();
        } else {
            this.form.reset()
            this.viewCtrl.dismiss();
        }

    }

    handlerNext(bool) {
        this.data.handlerNext = bool;
    }

    showLoading() {
        this.data.loading = this.loadingCtrl.create({
            content: 'Cargando...',
            dismissOnPageChange: true
        });
        this.data.loading.present();
    }

}