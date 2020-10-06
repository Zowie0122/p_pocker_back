<template>
  <div>
    <b-list-group>
      <b-list-group-item
        v-for="(info, index) in votes_info"
        :key="index"
        v-bind:style="{ color: info.colorCode }"
        class="lead"
      >
        <strong> {{ info.name }}................[{{ info.status }}] </strong>
      </b-list-group-item>
    </b-list-group>
  </div>
</template>

<script>
export default {};
</script>

<script>
export default {
  name: "PlayerList",
  props: {
    votes_info: Array,
  },
};
</script>
