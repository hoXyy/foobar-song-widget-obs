<template>
  <div class="overflow-hidden min-h-screen flex justify-left" v-if="playbackState != 'stopped'">
    <div className="flex items-start justify-end">
      <div
        class="bg-[#000000cc] relative inline-flex flex-col overflow-hidden text-white border border-white border-opacity-20 shadow"
        style="transition: 'width 1s linear'">
        <div className="inline-flex items-center py-2 pl-2 pr-4">
          <div class="absolute bg-center filter blur-sm bg-contain inset-0 w-full h-full z-[-1]"
            :style="{background: `linear-gradient(to right, rgba(255, 255, 255, 0), rgba(0, 0, 0, 0.2) 50%)${song.albumart}, url(${song.albumart})`}" />
          <div className="w-24 h-24 mr-4 mx-auto" v-if="song.albumart" :key="song.albumart">
            <img class="object-contain h-full" :src="song.albumart" />
          </div>


          <div id="songinfo" class="w-72 overflow-hidden" ref="songinfo">
            <h1 class="text-2xl mb-1 whitespace-nowrap text-clip" :key="song.title" ref="songtitle"><b>{{ song.title
            }}</b></h1>
            <h2 className="text-gray-100 text-lg whitespace-nowrap" :key="song.artist" ref="songartist">{{ song.artist }}</h2>
          </div>
        </div>
        <div className="max-w-full h-1 bg-[#a503fc]"
          :style="{width: `${((progress.position || 0) / progress.length) * 100}%`, transition: 'width 1s linear'}" />
      </div>
    </div>
  </div>

</template>

<script>
import { mapMutations, mapState } from "vuex";
import gsap from 'gsap';

export default {
  name: "App",
  data() {
    return {
      scrollSongAnim: undefined,
      scrollArtistAnim: undefined
    }
  },
  methods: {
    ...mapMutations([
      "setSong",
      "setProgress",
      "setPlaybackState",
    ]),
    async refreshData() {
      const raw = await fetch("http://localhost:8880/api/player?columns=%artist%,%title%");
      raw.json().then(async (result) => {
        const song = {
          artist: result.player.activeItem.columns[0],
          title: result.player.activeItem.columns[1],
        }
        const album = await fetch(`http://localhost:8880/api/artwork/${result.player.activeItem.playlistId}/${result.player.activeItem.index}`);
        if (album.status === (404 || 400)) {
          song.albumart = undefined;
        } else {
          song.albumart = `http://localhost:8880/api/artwork/${result.player.activeItem.playlistId}/${result.player.activeItem.index}`;
        }
        this.setSong(song);
        const progress = {
          position: result.player.activeItem.position,
          length: result.player.activeItem.duration,
        }
        this.setProgress(progress);
        this.setPlaybackState(result.player.playbackState);
      });
    },
    scrollSongName() {
      return this.$refs.songtitle.offsetWidth < this.$refs.songtitle.scrollWidth;
    },
    scrollSongArtist() {
      return this.$refs.songartist.offsetWidth < this.$refs.songartist.scrollWidth;
    },
    isJsonObject(strData) {
      try {
        JSON.parse(strData);
      } catch (e) {
        return false;
      }
      return true;
    }
  },
  computed: {
    ...mapState([
      'playbackState',
      'song',
      'progress'
    ])
  },
  watch: {
    song: {
      handler() {
        this.$nextTick(() => {
          // scroll song
          let scrollSong = this.scrollSongName();
          if (scrollSong) {
            this.$data.scrollSongAnim = gsap.timeline({ repeat: -1, }).set(this.$refs.songtitle, { xPercent: 140 }).to(this.$refs.songtitle, { duration: 20, xPercent: -140, ease: 'none' });
          } else if (!scrollSong) {
            if (this.$data.scrollSongAnim) {
              this.$data.scrollSongAnim.remove();
            }
          }

          // scroll artist
          let scrollArtist = this.scrollSongArtist();
          if (scrollArtist) {
            this.$data.scrollArtistAnim = gsap.timeline({ repeat: -1, }).set(this.$refs.songartist, { xPercent: 120 }).to(this.$refs.songartist, { duration: 20, xPercent: -120, ease: 'none' });
          } else if (!scrollArtist) {
            if (this.$data.scrollArtistAnim) {
              this.$data.scrollArtistAnim.remove();
            }
          }
        })
      },
      deep: true
    }
  },
  mounted() {
    this.refreshData();
    setInterval(() => {
      this.refreshData();
    }, 1000)
    this.$nextTick(() => {
      this.$nextTick(() => {
        // scroll song
        let scrollSong = this.scrollSongName();
        if (scrollSong) {
          this.$data.scrollSongAnim = gsap.timeline({ repeat: -1, }).set(this.$refs.songtitle, { xPercent: 140 }).to(this.$refs.songtitle, { duration: 20, xPercent: -140, ease: 'none' });
        } else if (!scrollSong) {
          if (this.$data.scrollSongAnim) {
            this.$data.scrollSongAnim.remove();
          }
        }

        // scroll artist
        let scrollArtist = this.scrollSongArtist();
        if (scrollArtist) {
          this.$data.scrollArtistAnim = gsap.timeline({ repeat: -1, }).set(this.$refs.songartist, { xPercent: 120 }).to(this.$refs.songartist, { duration: 20, xPercent: -120, ease: 'none' });
        } else if (!scrollArtist) {
          if (this.$data.scrollArtistAnim) {
            this.$data.scrollArtistAnim.remove();
          }
        }
      })
    })
  }
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&family=Noto+Sans+KR:wght@400;700&family=Noto+Sans+TC:wght@400;700&family=Noto+Sans:wght@400;700&display=swap');

#app {
  font-family: "Noto Sans", "Noto Sans JP", "Noto Sans KR", "Noto Sans TC", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: white;
}
</style>
