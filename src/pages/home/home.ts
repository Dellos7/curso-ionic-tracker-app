import { Component } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';
import { UbicacionProvider } from '../../providers/ubicacion/ubicacion';
import { UsuarioProvider } from '../../providers/usuario/usuario';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  user: any = {};

  constructor(public navCtrl: NavController,
              public ubicacionSvc: UbicacionProvider,
              public usuarioSvc: UsuarioProvider) {
  }

  ionViewDidLoad() {
    this.ubicacionSvc.iniciarGeolocalizacion();
    this.ubicacionSvc.obtenerTaxista().then( taxista => {
      taxista.valueChanges()
        .subscribe( data => {
          this.user = data;
        });
    });
  }

  logout() {
    this.ubicacionSvc.detenerGeolocalizacion();
    this.usuarioSvc.borrarUsuario();
    this.navCtrl.setRoot('LoginPage');
  }

}
