<template>
  <div>
    {{ time }}
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
        var cd = new Date();
        this.time =
          this.zeroPadding(cd.getHours(), 2) +
          ":" +
          this.zeroPadding(cd.getMinutes(), 2);
      };

      setInterval(getTime, 1000);
      getTime();
    },

    zeroPadding: function(num, digit) {
      var zero = "";
      for (var i = 0; i < digit; i++) {
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