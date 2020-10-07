<template>
  <div>
    <h1 class="timer p-4">
      {{ time }}
    </h1>
  </div>
</template>

<script>
export default {
  name: "Clock",
  data: function() {
    return {
      time: ""
    };
  },
  methods: {
    updateTime: function() {
      const getTime = () => {
        let cd = new Date();
        this.time =
          this.zeroPadding(cd.getHours(), 2) +
          ":" +
          this.zeroPadding(cd.getMinutes(), 2);
      }

      setInterval(getTime, 1000);
      getTime();
    },

    zeroPadding: function(num, digit) {
      let zero = "";
      for (let i = 0; i < digit; i++) {
        zero += "0";
      }
      return (zero + num).slice(-digit);
    }
  },
  mounted: function() {
    this.updateTime();
  }
};
</script>

<style scoped>
.timer {
  text-align: end;
  color: #c62a88;
  font-size: 3wh;
}
</style>
