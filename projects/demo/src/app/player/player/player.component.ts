import { Component } from '@angular/core';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
  standalone: false,
})
export class PlayerComponent {
  files = [
    'assets/files/1.ogg.mp3',
    encodeURIComponent(
      'assets/files/e18e30a849764f7ebdb733217e28ca89#recorded_voice_5757.ogg',
    ),
    'assets/files/Meysam Ebrahimi - Eshgh (320).mp3',
    'assets/files/Mehdi Ahmadvand - Zang Bezani (320).mp3',
    // 'assets/files/Voice_565590.mp3',
    // 'https://pendargan.ir/appapi/FileStorage_CDN/FileStorage%5C14%5CFrom_5648%5CVoter_565590%5Ccdb915108de14025863cfd7dff3f7f47%23Voice_565590.mp3',
    'assets/files/Free_Test_Data_1MB_MP3.mp3',
    'assets/files/Free_Test_Data_100KB_MP3.mp3',
    'assets/files/Free_Test_Data_500KB_MP3.mp3',
  ];
}
