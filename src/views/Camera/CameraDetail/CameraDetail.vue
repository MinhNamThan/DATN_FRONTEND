<template>
  <div class="camera-detail">
    <div class="d-flex">
      <div style="position: relative; width: fit-content">
        <img
          :src="`${props.CameraCurrent.box.link}?url=${props.CameraCurrent.url}&username=${props.CameraCurrent.box.username}&password=${props.CameraCurrent.box.password}`"
          alt="Camera Image"
          width="80%"
          class="img-camera"
          id="img-camera"
          ref="imgeRef"
          @load="prepareCanvas"
        />
        <canvas
          style="position: absolute; left: 0; top: 0"
          ref="canvasRef"
          id="canvas"
          class="canvas"
          @mousedown="mouseDown"
        ></canvas>
      </div>
      <div class="d-flex flex-column justify-content-center ml-n5">
        <a-button
          type="primary"
          style="width: 150px; height: 50px; font-size: 24px"
          @click="selectPersonCropTool"
          class="mb-2"
        >
          Rect
        </a-button>
        <a-button
          type="primary"
          style="width: 150px; height: 50px; font-size: 24px"
          @click="selectPersonMaskTool"
          class="mb-2"
        >
          Mask
        </a-button>
        <a-button
          type="primary"
          style="width: 150px; height: 50px; font-size: 24px"
          @click="onUpdate"
          class="mb-2"
        >
          Save
        </a-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, nextTick, defineEmits } from "vue";
import { type DrawTool, RectDrawTool, PolygonDrawTool } from "@/tools/draw";
import { notification } from "ant-design-vue";
import { useCameraStore } from "@/store";

const canvasRef = ref<HTMLCanvasElement | null>(null);
let context: CanvasRenderingContext2D;
let canvas: HTMLCanvasElement;
let drawTool: DrawTool | undefined;
const loading = ref(false);
const cameraStore = useCameraStore();

async function prepareCanvas() {
  await nextTick();
  canvasRef.value?.classList.remove("canvas-visible");
  console.log(canvasRef.value);
  canvas = canvasRef.value!;
  context = canvas.getContext("2d")!;
  let image = document.getElementById("img-camera") as HTMLImageElement;
  canvas.width = image.width;
  canvas.height = image.height;
  const list =
    JSON.parse(props.CameraCurrent.points).length >= 4
      ? JSON.parse(props.CameraCurrent.points)
      : [];
  drawTool =
    JSON.parse(props.CameraCurrent.points).length > 4
      ? new PolygonDrawTool(context, canvas, list, true)
      : (drawTool = new RectDrawTool(context, canvas, list, true));
  drawTool.start();
}

function selectPersonCropTool() {
  canvasRef.value?.classList.add("canvas-visible");

  if (drawTool) {
    drawTool.done();
  }

  const list =
    JSON.parse(props.CameraCurrent.points).length == 4
      ? JSON.parse(props.CameraCurrent.points)
      : [];
  drawTool = new RectDrawTool(context, canvas, list, true);
  drawTool.start();
}

function selectPersonMaskTool() {
  canvasRef.value?.classList.add("canvas-visible");

  if (drawTool) {
    drawTool.done();
  }

  console.log(JSON.parse(props.CameraCurrent.points).length > 4);
  const list =
    JSON.parse(props.CameraCurrent.points).length > 4
      ? JSON.parse(props.CameraCurrent.points)
      : [];
  console.log(list);
  drawTool = new PolygonDrawTool(context, canvas, list, true);
  drawTool.start();
}

const props = defineProps({
  CameraCurrent: {
    type: Object,
    required: true,
  },
});

function mouseDown(e: MouseEvent) {
  let client = canvas.getBoundingClientRect();
  let x = e.clientX - client.left;
  let y = e.clientY - client.top;

  if (e.button == 0) {
    if (drawTool) {
      drawTool.push(x, y);
    }
  } else if (e.button == 2) {
    console.log("right click");
    if (drawTool) {
      drawTool.pop();
    }
  }
}

const emit = defineEmits<{
  (e: "success"): void;
}>();
async function onUpdate() {
  loading.value = true;
  console.log(drawTool?.getPoints());
  cameraStore
    .updateCamera(
      props.CameraCurrent.id as unknown as number,
      props.CameraCurrent.name as unknown as string,
      props.CameraCurrent.url as unknown as string,
      props.CameraCurrent.detected as unknown as boolean,
      JSON.stringify(drawTool?.getPoints())
    )
    .then(async () => {
      emit("success");
      if (drawTool) {
        drawTool.done();
        drawTool = undefined;
      }
    })
    .catch((e) => {
      notification.error({
        message: e.data?.detail || "Không thành công",
      });
    })
    .finally(() => (loading.value = false));
}
</script>

<style scoped>
.img-camera {
  border-radius: 10px;
  display: block;
}
.camera {
  font-size: 18px;
}
</style>
