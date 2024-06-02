<template>
  <div>
    <!-- <video ref="videoPlayer" controls autoplay></video> -->
    <img src="http://0.0.0.0:8001/video_feed" alt="camera" class="image-show">
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import axios from "axios";

export default defineComponent({
  name: "VideoPlayer",
  mounted() {
    // this.loadVideo();
  },
  methods: {
    async loadVideo() {
      try {
        // const videoElement = this.$refs.videoPlayer as HTMLVideoElement;
        const response = await axios.get("http://0.0.0.0:8001/video_feed"); // Thay đổi URL nếu cần
        console.log("here this");
        console.log(response);
        // const stream = response.data;
        // videoElement.srcObject = new MediaStream([stream]);
      } catch (error) {
        console.error("Failed to load video:", error);
      }
    },
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/* Add your CSS styles here */
.image-show {
  width: 80%;
}
</style>
