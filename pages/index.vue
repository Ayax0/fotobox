<script lang="ts" setup>
const video = ref<HTMLVideoElement>();
const stream = ref<MediaStream>();

const { counter, pause, resume, reset, isActive } = useInterval(1000, {
	controls: true,
	immediate: false,
});

onMounted(async () => {
	stream.value = await navigator.mediaDevices.getUserMedia({
		audio: false,
		video: true,
	});

	document.addEventListener("keydown", (event) => {
		if (event.code === "Enter") resume();
	});
});

watch(counter, (value) => {
	if (!isActive) return;
	if (value < 3) return;

	pause();
	reset();

	capture();
});

function capture() {
	if (!video.value || !stream.value) return;

	const canvas = document.createElement("canvas");
	const ctx = canvas.getContext("2d");

	const settings = stream.value.getTracks()[0].getSettings();
	canvas.width = settings.width || 1920;
	canvas.height = settings.height || 1080;

	if (!ctx) return;
	ctx.drawImage(video.value, 0, 0, canvas.width, canvas.height);
	canvas.toBlob(async (blob) => {
		if (!blob) return;

		const body = new FormData();
		body.append("file", blob);

		const response = await $fetch("/api/image", { method: "POST", body });
		navigateTo(`/view/${response.filename}`);
	});
}
</script>

<template>
	<div v-if="isActive" class="countdown">
		{{ 3 - counter }}
	</div>
  <div class="wrapper">
    <video ref="video" :srcObject="stream" autoplay style="border: 1px solid red;"></video>
  </div>
</template>

<style lang="scss">
.wrapper {
  width: 100svw;
  height: 100svh;
  overflow: hidden;

  display: flex;
  justify-content: center;
  align-items: center;

  video {
    max-width: 100%;
    max-height: 100%;
  }
}

.countdown {
	position: absolute;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;

	display: flex;
	justify-content: center;
	align-items: center;

	font-size: 40vh;
	font-weight: bold;
	background: rgba(0,0,0,0.5);
}
</style>