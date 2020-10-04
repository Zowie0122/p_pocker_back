<template>
  <div>
    <h1>Player Page</h1>
    <p>Session ID : {{ sessionID }}</p>
    <clock />

    <div>
      Now voting
      <ul>
        <li v-for="(status, name, index) in dammmyPlayersList" :key="index">
          {{ name }}................{{ status }}
        </li>
      </ul>
    </div>

    <div>
      Your Vote:
      <ul>
        <li v-for="(card, index) in dammyCardDeck" :key="index">
          {{ card }}
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
      dammyCardDeck: ["no vote", "A", "B", "C", "D", "E", "F", "?"],
      sessionID: this.$route.params.id
    };
  }
};
</script>