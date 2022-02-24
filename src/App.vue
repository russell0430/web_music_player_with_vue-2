<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script>
export default {
  name: "app",
  data() {
    return {
      test: "",
    };
  },
  created() {
    
    // this.$axios.get("/search?keywords= 邓紫棋").then((res) => {
    //   console.log(res);
    // }).catch(err=>console.log(err));
  },
};
</script>

<style lang="scss">
</style>
