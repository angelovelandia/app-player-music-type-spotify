import { Component } from '@angular/core';
import { Howl } from 'howler';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {

  private mp3!: Howl;
  private interval: any;
  isPlaying: boolean = false;
  progress: number = 0;
  songActive: number = 0;

  songs = [
    {
      title: 'Chamber Of Reflection',
      artist: 'Mac DeMarco',
      cover: 'assets/img/Chamber_Of_Reflection.jpg',
      src: 'assets/audio/Chamber_Of_Reflection.mp3',
    },
    {
      title: 'LUNA BALA - Slowed',
      artist: 'Mac DeMarco',
      cover: 'assets/img/LUNA_BALA_(Slowed).jpg',
      src: 'assets/audio/LUNA_BALA_(Slowed).mp3',
    }
  ];

  constructor() {
    this.loadSong();
  }

  loadSong() {
    if (this.mp3) {
      this.mp3.unload();
    }
    this.mp3 = new Howl({
      src: [this.songs[this.songActive].src],
      html5: true,
      onend: () => {
        this.isPlaying = false;
        clearInterval(this.interval);
        this.progress = 0;
      }
    });
  }

  playMusic() {
    if (this.isPlaying) {
      this.isPlaying = false;
      this.mp3.pause();
      return clearInterval(this.interval);
    }
    this.isPlaying = true;
    this.mp3.play();
    return this.trackProgress();
  }

  trackProgress() {
    this.interval = setInterval(() => {
      const seek = this.mp3.seek() as number;
      const duration = this.mp3.duration();
      this.progress = (seek / duration) * 100;
    }, 500);
  }

  seekTo(value: number | { lower: number; upper: number }) {
    let numericValue: number;
    if (typeof value === 'number') {
      numericValue = value;
    } else {
      numericValue = value.lower;
    }

    if (this.mp3) {
      const duration = this.mp3.duration();
      this.mp3.seek((numericValue / 100) * duration);
    } else {
      console.error('Error: MP3 Object not exist');
    }
  }

  prevSong() {
    this.songActive = this.songActive - 1;
    if (this.songActive <= this.songs.length) {
      this.songActive = 0;
    }
    if (this.mp3) {
      this.mp3.unload();
      this.isPlaying = false;
      this.progress = 0;
      clearInterval(this.interval);
    }
  }

  nextSong() {
    this.songActive = this.songActive + 1;
    if (this.songActive >= this.songs.length) {
      this.songActive = this.songs.length - 1;
    }
    if (this.mp3) {
      this.mp3.unload();
      this.isPlaying = false;
      this.progress = 0;
      clearInterval(this.interval);
    }
  }

  ngOnDestroy() {
    clearInterval(this.interval);
    if (this.mp3) {
      this.mp3.unload();
    }
  }
}
