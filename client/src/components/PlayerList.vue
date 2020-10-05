<template>
  <div>
    <ul>
      <li
        v-for="(info, index) in votesInfo"
        :key="index"
        v-bind:style="{ color: info.colorCode }"
      >
        {{ info.name }}................[{{ info.status }}]
      </li>
    </ul>
  </div>
</template>

<script>
export default {};
</script>
