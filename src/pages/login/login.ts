import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ViewChild } from '@angular/core';
import { Slides } from 'ionic-angular';
import { AlertController, LoadingController } from 'ionic-angular';
import { UsuarioProvider } from '../../providers/usuario/usuario';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  @ViewChild(Slides) slides: Slides;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public usuarioProv: UsuarioProvider) {
  }

  ionViewDidLoad() {
    this.slides.paginationType = 'progress';
    this.slides.lockSwipes(true);
    this.slides.freeMode = false;
  }

  mostrarInput() {
    let alert = this.alertCtrl.create({
      title: 'Introducir código de taxista',
      inputs: [
        {
          name: 'codigo',
          placeholder: 'Código'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Login',
          handler: data => {
            this.verificarCodigo( data.codigo );
          }
        }
      ]
    });
    alert.present();
  }

  ingresar() {
    this.navCtrl.setRoot('HomePage');
  }

  verificarCodigo( codigo: string ) {
    let loading = this.loadingCtrl.create({
      content: 'Verificando código...'
    });
    loading.present();
    this.usuarioProv.verificaUsuario( codigo )
      .then( existe => {
        loading.dismiss();
        if( existe ) {
          this.slides.lockSwipes(false);
          this.slides.freeMode = true;
          this.slides.slideNext();
          this.slides.lockSwipes(true);
          this.slides.freeMode = false;
        }
        else {
          this.alertCtrl.create({
            title: 'Código incorrecto',
            subTitle: 'Hable con el administrador o pruebe de nuevo',
            buttons: ['Aceptar']
          }).present();
        }
      });
  }

}
