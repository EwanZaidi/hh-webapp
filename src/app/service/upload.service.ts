import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { Upload } from '../upload.model';
import {AngularFirestore} from 'angularfire2/firestore';

@Injectable()
export class UploadService {

  constructor(private fs: AngularFirestore) { }

  uploadImage(image: Upload, player_id,tid) {
    let pid = player_id;
    const storageRef = firebase.storage().ref();
    // let uploadTask = storageRef.child(`${this.basePath}/`+this.userId+`/${this.childPath}/`+text+'.png');
    // uploadTask.putString(image, 'base64', {contentType: 'image/png'}).then((snapshot) => {
    //   this.db.list(`${this.basePath}/`+this.userId+`/${this.childPath}`).push({
    //     image_caption: 'My Caption',
    //     image_name: text + '.png',
    //     image_url: snapshot.downloadURL,
    //     uploaded_on: firebase.database.ServerValue.TIMESTAMP
    //   })
    // })

    let uploadTask = storageRef.child(`teams/${tid}/surat/${player_id}`).put(image.file);

    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, (snapshot) => {
      image.progress = (uploadTask.snapshot.bytesTransferred / uploadTask.snapshot.totalBytes) * 100;
      image.display = Math.round(image.progress);
    },

      (err) => {
        // console.log(err);
      },

      (): any => {
        image.image_url = uploadTask.snapshot.downloadURL;
        image.image_name = image.file.name;
        image.image_caption = "My Caption";
        image.uploaded_on = firebase.database.ServerValue.TIMESTAMP;
        // if (image.display) { delete image.display };
        // if (image.progress) { delete image.progress };
        this.saveFileData(image,pid,tid)
      })
  }

  private saveFileData(image: Upload, pid,tid) {

    this.fs.collection('teams').doc(tid).collection('players').doc(pid).update({
      surat : image.image_url
    })
    // console.log("File saved:" + image.image_url)
  }

}
