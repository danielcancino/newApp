import {Component, OnInit} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AlertController, LoadingController, NavController, NavParams, ViewController} from "ionic-angular";
import {LocalDataProvider} from "../../../providers/localdata";

@Component({
    selector: 'page-detail_modal',
    templateUrl: 'detail_modal.html'
})
export class DetailMPModal implements OnInit {

    form: FormGroup;
    parentModel: any = null;

    ///////////////////
    data: any = {
        oTable: <any> [],
        loading: null,
        idcuartel: null,
        productos: <any>  [],
        cuarteles: <any>[],
        variedades: <any> [],
        calibres: <any> [],
        envases: <any> [],
    };

    constructor(public navCtrl: NavController,
                public viewCtrl: ViewController,
                private fb: FormBuilder,
                private loadingCtrl: LoadingController,
                public localData: LocalDataProvider,
                public params: NavParams,
                public alertController: AlertController) {
        this.parentModel = params.get('parentModel');
        console.log(this.parentModel);
    }

    ngOnInit() {
        let seft = this;
        seft.initForm(() => {
            seft.getTable(seft.parentModel.idrecepcion);
        });
    }

    ionViewWillEnter() {
        let seft = this;
        ////////inv_articulo////
        this.localData._find("SELECT idarticulo,cod_articulo,descripcion FROM `inv_articulo` WHERE  idtipo_articulo = 1 OR idtipo_articulo = 8;", []).then((rows) => {
            seft.data.productos = rows;
        }).catch((e) => {
            console.log(e);
        });
        ////////cfg_cuartel////
        if (seft.parentModel.idpredio !== null) {
            seft.localData._find("SELECT idcuartel,descripcion FROM `cfg_cuartel` WHERE idpredio=? group by idcuartel;", [seft.parentModel.idpredio]).then((rows) => {
                seft.data.cuarteles = rows;
            }).catch((e) => {
                console.log(e);
            });
        }

        ////////cfg_calibre////
        if (seft.parentModel.idespecie !== null) {
            seft.localData._find("SELECT idcalibre,cod_calibre,descripcion FROM `cfg_calibre` WHERE  checkCalidad = 0 AND  idespecie = ?;", [seft.parentModel.idespecie]).then((rows) => {
                seft.data.calibres = rows;
            }).catch((e) => {
                console.log(e);
            });
        }

        seft.localData._find("SELECT idarticulo,cod_articulo,descripcion FROM `inv_articulo` WHERE  idtipo_articulo = 5;", []).then((rows) => {
            seft.data.envases = rows;
        }).catch((e) => {
            console.log(e);
        });

        seft.setNewLote();
        seft.form.patchValue({
            fecha_cosecha: new Date().toISOString(),
        });

    }



    /** Инициализация формы */
    private initForm(callback): void {
        this.form = this.fb.group({
            idcuartel: [null, [Validators.required]],
            lote: [null, [Validators.required]],
            idarticulo: [null, [Validators.required]],
            idvariedad: [null, [Validators.required]],
            idcalibre: [null, [Validators.required]],
            idarticulo_envase: [null, [Validators.required]],
            idarticulo_pallet: [null, []],
            fecha_cosecha: [null, [Validators.required]],
            cant_cajas_informadas: [null, [Validators.required]],
            cant_cajas: [null, [Validators.required]],
            kilos_brutos_informados: [null, [Validators.required]],
            kilos_brutos: [null, [Validators.required]],
            kilos_netos: [null, [Validators.required]],
            temperatura: [null, [Validators.required]],
        });
        if (typeof callback === "function") {
            callback();
        }
    }

    public onSubmit(): void {
        const controls = this.form.controls;
        Object.keys(controls).forEach(key => {
            controls[key].markAsTouched();
        });
        if (this.form.valid) {
            this.showLoading();
            this.add(this.form.value);
        } else {

            // validate all form fields
        }
    }

    private add(p) {
        this.localData.getStorage().get('idusuario').then((idusuario) => {
            let str = "?,";
            let sql = "INSERT INTO `prod_recepcion_detalle` (\
            `idrecepcion`, \
            `lote`, \
            `idarticulo`, \
            `idcalibre`, \
            `idcuartel`, \
            `idvariedad`, \
            `fecha_cosecha`, \
            `cant_cajas`, \
            `kilos_brutos`, \
            `kilos_netos`, \
            `cant_cajas_informadas`, \
            `kilos_brutos_informados`, \
            `idarticulo_envase`, \
            `idcreador`, \
            `fecha_creacion`, \
            `activo`, \
            `temperatura`, \
            `idarticulo_pallet`, \
            `app` \
            ) VALUES ";
            let values = [];
            values.push(this.parentModel.idrecepcion);
            values.push(p.lote);
            values.push(p.idarticulo);
            values.push(p.idcalibre);
            values.push(p.idcuartel);
            values.push(p.idvariedad);
            values.push(p.fecha_cosecha);
            values.push(p.cant_cajas);
            values.push(p.kilos_brutos);
            values.push(p.kilos_netos);
            values.push(p.cant_cajas_informadas);
            values.push(p.kilos_brutos_informados);
            values.push(p.idarticulo_envase);
            values.push(idusuario);
            values.push(new Date().toISOString());
            values.push(1);
            values.push(p.temperatura);
            values.push(p.idarticulo_pallet);
            values.push(1);
            sql += "(" + str.repeat(19).slice(0, -1) + "),";
            sql = sql.slice(0, -1);
            this.localData._executeSql(sql, values, (last_id) => {
                console.log(last_id + '=>save detail');
                this.data.loading.dismiss();
                this.getTable(this.parentModel.idrecepcion);
                this.form.reset()
                this.setNewLote();
            });
        });
    }

    private  getTable(id) {
        let seft = this;
        seft.localData._find(this.localData.GetView('prod_v_recepcion_detalle') + " WHERE activo=1 AND idrecepcion = ?  group by idrecepcion_detalle;", [id]).then((rows: Array<any>) => {
            seft.data.oTable = <any>  [];
            for (const value of rows) {
                seft.data.oTable.push({
                    idrecepcion_detalle: value.idrecepcion_detalle,
                    tarja: value.lote,
                    variedad: value.desc_variedad,
                    cajas: value.cant_cajas,
                    kilos_netos: value.kilos_brutos,
                    cod_articulo: value.cod_articulo,
                    cuartel: value.desc_cuartel
                });
            }
        }).catch((e) => {
            console.log(e);
        });

    }


    public quitar(id) {
        let confirm = this.alertController.create({
            title: 'Eliminar Lote',
            message: '¿Está  seguro que desea Quitar este detalle?',
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
                        this.delete(id);

                    }
                }
            ]
        });
        confirm.present();
    }

    private delete(id) {
        let seft = this;
        this.showLoading();
        this.localData._executeSql("DELETE FROM `prod_recepcion_detalle` WHERE `idrecepcion_detalle`=?;", [id], () => {
            seft.getTable(seft.parentModel.idrecepcion);
            this.data.loading.dismiss();
        });
    }

    private setNewLote() {
        let seft = this;
        seft.localData._find("SELECT count(lote)+1 as lotem FROM `prod_recepcion_detalle` WHERE  idrecepcion = ?;", [seft.parentModel.idrecepcion]).then((rows) => {
            let lote = seft.parentModel.serie_lote + '-' + seft.zfill(rows[0].lotem, 4);
            seft.form.patchValue({
                lote: lote
            });
        }).catch((e) => {
            console.log(e);
        });
    }

////////////////////////////////////////////////////////////////////////////
    dismiss() {
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
                        this.viewCtrl.dismiss();

                    }
                }
            ]
        });
        confirm.present();
    }

    triggerCuartel(id) {
        ////////cfg_variedad////
        if (this.parentModel.idespecie !== null) {
            if (id !== null) {
                this.localData._find("SELECT \
                    `cfg_variedad`.`idvariedad`, \
                    `cfg_variedad`.`codigo`, \
                    `cfg_variedad`.`variedad` \
                FROM (`cfg_cuartel` \
                JOIN `cfg_variedad` ON ((`cfg_variedad`.`idvariedad` = `cfg_cuartel`.`idvariedad`))) \
                WHERE `cfg_cuartel`.`idcuartel`=? AND `cfg_cuartel`.`idespecie`=?", [id, this.parentModel.idespecie]).then((rows) => {
                    this.data.variedades = rows;
                }).catch((e) => {
                    console.log(e);
                });
            }
        }

    }

    zfill(number, width) {
        let numberOutput = Math.abs(number);
        /* Valor absoluto del número */
        let length = number.toString().length;
        /* Largo del número */
        let zero = "0";
        /* String de cero */

        if (width <= length) {
            if (number < 0) {
                return ("-" + numberOutput.toString());
            } else {
                return numberOutput.toString();
            }
        } else {
            if (number < 0) {
                return ("-" + (zero.repeat(width - length)) + numberOutput.toString());
            } else {
                return ((zero.repeat(width - length)) + numberOutput.toString());
            }
        }
    }

    showLoading() {
        this.data.loading = this.loadingCtrl.create({
            content: 'Cargando...',
            dismissOnPageChange: true
        });
        this.data.loading.present();
    }

}