<script lang="ts" setup>
const { image } = useRoute().params;
const timeout = ref<NodeJS.Timeout>();

async function print() {
	await $fetch(`/api/image/${image}`, { method: "POST" });
}

useEventListener("keydown", (event) => {
	if (event.code === "Enter" && !timeout.value)
		timeout.value = setTimeout(print, 3000);
});

useEventListener("keyup", (event) => {
	if (event.code === "Enter" && timeout.value) {
		clearTimeout(timeout.value);
		timeout.value = undefined;

		navigateTo("/");
	}
});

onBeforeUnmount(() => {
	if (timeout.value) clearTimeout(timeout.value);
});
</script>

<template>
  <div v-if="timeout" class="loader"></div>
  <div class="wrapper">
    <NuxtImg :src="image.toString()" provider="ipx" width="800" />
    <div style="height: 1rem;"></div>
    <div>Knopf gedrückt halten um zu drucken</div>
    <div>Knopf kurz drücken um es nochmal zu versuchen</div>
  </div>
</template>

<style lang="scss" scoped>
.wrapper {
  width: 100svw;
  height: 100svh;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  font-size: 4vh;

  img {
    width: 80vw;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  }
}

.loader {
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 100vh;
  
  animation-name: loader;
  animation-duration: 3s;
  animation-timing-function: linear;

  background: rgba(255,255,255,0.5);
}

@keyframes loader {
  from { width: 0; }
  to { width: 100vw; }
}
</style>