<template>
  <div class="modal-overlay">
    <div class="modal">
      <button class="close-button" @click="$emit('close')">&times;</button>
      <h2>{{ item.name }}</h2>
      <img
        v-if="item.image_url"
        :src="`http://localhost:3000/uploads/${item.image_url}`"
        alt="item image"
      />
      <p>{{ item.details }}</p>
      <button @click="deleteItem">Удалить</button>
    </div>
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
    deleteItem() {
      this.$emit("delete", this.item.id);
    },
  },
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  width: 300px;
  text-align: center;
  position: relative;
}

.modal img {
  max-width: 100%;
  height: auto;
  margin-bottom: 10px;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  font-size: 20px;
  cursor: pointer;
}

button {
  padding: 10px 20px;
  margin-top: 10px;
  cursor: pointer;
}
</style>
