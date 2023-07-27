<script setup lang="ts">
  const allRooms = shallowRef<Classroom[]>([])
  const getImgUrl = (i: number) => {
    return allRooms.value[i].clsr_bg
  };
  onMounted(async() => {
    let roomList = await api.classroom.getAll();
    allRooms.value = roomList;
    console.log('roomList' + JSON.stringify(roomList));
  })
</script>

<template>
  <!-- <video class="video-background" autoplay loop muted>
    <source src="../../assets/hero-bg.mp4" type="video/mp4">
  </video> -->
  <!-- <a-badge-ribbon text="1" color="#ff4655">
    <a-card title="已使用" size="small" />
  </a-badge-ribbon> -->
  <a-carousel arrows dots-class="slick-dots slick-thumb">
    <template #customPaging="props">
      <a>
        <img :src="getImgUrl(props.i)" />
      </a>
    </template>
    <div v-for="item in allRooms.length" :key="item" class="clsrContainer">
      <div class="clsrName" :class="{ active: allRooms[item - 1].clsr_occupy }">{{ allRooms[item - 1].clsr_name }}</div>
      <img :src="getImgUrl(item - 1)" />
    </div>
  </a-carousel>
</template>

<style lang="less" scoped>
.video-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.clsrContainer {
  position: relative;
}
.clsrName {
  color: #ece8e1;
  font-size: 50px;
  font-weight: bold;
  transition: transform 0.2s linear;
  position: absolute;
  margin-left: 225px;
  margin-top: 405px;
}
.active {
  color: #ff4655;
}
.ant-carousel :deep(.slick-dots) {
  position: relative;
  height: auto;
}
.ant-carousel :deep(.slick-slide img) {
  border: 5px solid rgba(255, 255, 255, 0.3); ;
  display: block;
  margin: auto;
  max-width: 70%;
  height: 500px;
}
.ant-carousel :deep(.slick-arrow) {
  display: none !important;
}
.ant-carousel :deep(.slick-thumb) {
  bottom: 0px;
}
.ant-carousel :deep(.slick-thumb li) {
  width: 60px;
  height: 45px;
}
.ant-carousel :deep(.slick-thumb li img) {
  width: 100%;
  height: 100%;
  filter: grayscale(100%);
  display: block;
}
.ant-carousel :deep .slick-thumb li.slick-active img {
  filter: grayscale(0%);
}
</style>