<template>
  <div class="inventory-item" @click="selectItem">
    <img
      v-if="item.image_url"
      :src="`http://localhost:3000${item.image_url}`"
      alt="item image"
    />
    <h3>{{ item.name }}</h3>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  methods: {
    selectItem() {
      this.$emit("select", this.item);
    },
  },
};
</script>

<style scoped>
.inventory-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 150px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  cursor: pointer;
}

.inventory-item img {
  max-width: 100px;
  height: auto;
  margin-bottom: 10px;
}

.inventory-item h3 {
  font-size: 16px;
  text-align: center;
}
</style>
