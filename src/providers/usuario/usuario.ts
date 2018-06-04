import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Storage } from '@ionic/storage';
import { Subscription } from 'rxjs';

@Injectable()
export class UsuarioProvider {

  codigo: string;
  user: any = {};
  private doc: Subscription;

  constructor( public afDB: AngularFirestore, public storage: Storage ) {
    
  }

  verificaUsuario( codigo: string ) {

    codigo = codigo.toLocaleLowerCase();

    return new Promise( (resolve, reject) => {
      this.doc = this.afDB.doc(`/usuarios/${codigo}`)
        .valueChanges().subscribe( data => {
          if( data ) {
            this.codigo = codigo;
            this.user = data;
            this.guardarStorage();
            resolve(true);
          }
          else {
            resolve(false);
          }
        });
    });
  }

  obtenerCodigo(): Promise<string> {
    return new Promise( (resolve, reject) => {
      if( this.codigo ) {
        resolve(this.codigo);
      }
      else {
        this.cargarStorage()
          .then( existe => {
            resolve(this.codigo);
          });
      }
    });
  }

  guardarStorage() {
    this.storage.set('codigo', this.codigo);
  }

  cargarStorage() {
    return new Promise( (resolve, reject) => {
      this.storage.get( 'codigo' ).then( codigo => {
        if( codigo ) {
          this.codigo = codigo;
          resolve(true);
        }
        else {
          resolve(false);
        }
      });
    });
  }

  borrarUsuario() {
    this.codigo = null;
    this.storage.remove('codigo').then( _ => {
      try {
        this.doc.unsubscribe();
      }
      catch(e) {
        console.log(JSON.stringify(e));
      }
    });
  }

}
