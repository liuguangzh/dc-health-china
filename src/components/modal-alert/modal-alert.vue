<template>
  <div>
    <Modal v-model="alertModal" :closable="false">
      <p slot="header" style="text-align: center;font-size: 24px;color: red">系统提示</p>
      <p style="color: red">系统正在执行中，请稍后.....</p>
      <p slot="footer"></p>
    </Modal>
  </div>
</template>

<script>
  export default {
    name: "ModalAlert",
    data() {
      return {
        alertModal: false
      }
    },
    methods: {
      show: function () {
        this.alertModal = true;
      },
      hide: function () {
        this.alertModal = false;
      }
    }
  }
</script>

<style scoped>

</style>
