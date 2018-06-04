import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { UsuarioProvider } from '../usuario/usuario';
import { Subscription } from 'rxjs/Subscription';

@Injectable()
export class UbicacionProvider {

  taxista: AngularFirestoreDocument<any>;
  private watch: Subscription;

  constructor( private geolocation: Geolocation,
                public usuarioSvc: UsuarioProvider,
                private afDB: AngularFirestore ) {
    this.obtenerTaxista();
  }

  obtenerTaxista(): Promise<AngularFirestoreDocument<any>> {
    return new Promise( (resolve, reject) => {
      if( this.taxista ) {
        resolve(this.taxista);
      }
      else {
        this.usuarioSvc.obtenerCodigo()
          .then( codigo => {
            this.taxista = this.afDB.doc(`/usuarios/${codigo}`);
            resolve(this.taxista);
          });
      }
    });
  }

  iniciarGeolocalizacion() {
    if( !this.taxista ) {
      this.obtenerTaxista().then( _ => {
        this._iniciarGeolocalizacion();
      });
    }
    else {
      this._iniciarGeolocalizacion();
    }

  }

  private _iniciarGeolocalizacion() {
    this.geolocation.getCurrentPosition().then((resp) => {

      if( resp && resp.coords ) {
        this.taxista.update({
          lat: resp.coords.latitude,
          lng: resp.coords.longitude,
          clave: this.usuarioSvc.codigo
        });
      }

      this.watch = this.geolocation.watchPosition()
        .subscribe((data) => {
          if( data && data.coords ) {
            this.taxista.update({
              lat: data.coords.latitude,
              lng: data.coords.longitude,
              clave: this.usuarioSvc.codigo
            });
          }
      });

     }).catch((error) => {
       console.log('Error getting location', error);
     });
  }

  detenerGeolocalizacion() {
    this.taxista = null;
    try {
      this.watch.unsubscribe();
    }
    catch(e) {
      console.log(JSON.stringify(e));
    }
  }

}
