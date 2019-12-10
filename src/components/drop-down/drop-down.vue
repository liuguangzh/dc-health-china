<template>
  <DropDown>
    <Button>
      {{displayName}}
      <Icon type="ios-arrow-down"></Icon>
    </Button>
  </DropDown>
</template>

<script>
  export default {
    name: "CustomDropDown",
    props: {
      items: {
        type: Array,
        required: true
      },
      displayName: {
        type: String,
        default: '下拉管理'
      }
    }
  }
</script>

<style scoped>

</style>
