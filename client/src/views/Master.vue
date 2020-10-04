<template>
  <div>
    <h1>Master Page</h1>
    <p>Session ID : {{ sessionID }}</p>
    <clock />
    <div>
      <div>Game controls</div>
      <button>Show Votes</button>
      <button>Reset Votes</button>
    </div>

    <div>
      Now voting

      <ul>
        <li v-for="(status, name, index) in dammmyPlayersList" :key="index">
          {{ name }}................{{ status }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "Master",

  data: function() {
    return {
      dammmyPlayersList: {
        Alice: "voted",
        Bob: "waiting",
        John: "waiting",
        Mary: "voted",
        William: "voted"
      },
      sessionID: this.$route.params.id
    };
  }
};
</script>