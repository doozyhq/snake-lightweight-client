<template>
  <div class="game">
    <h1>Welcome {{ displayName || '' }}</h1>
    <div class="game-content">
      <div class="game-content-share" v-if="embed !== 'true'">
        <SocialSharingBlock/>
      </div>
      <div class="game-content-params" v-if="!isLoadingGame">
        <div v-if="embed !== 'true'">
          <div>
            <span>Game ID: {{ game.id }}</span>
            <span class="game-item-delete" v-if="game.count === 0" @click="deleteGame">delete</span>
          </div>
          <div>Map size: {{ game.width }}x{{ game.height }}</div>
          <div>Players: {{ game.count }}/{{ game.limit }}</div>
          <div>Messages: {{ game.rate }} per sec</div>
        </div>

        <div>
          <h3>Game rules</h3>
          <ul>
            <li>You control a snake</li>
            <li>You need to grow the biggest snake</li>
            <li>You can eat apples, mice, watermelons, smaller snakes and dead snakes</li>
            <li>If you hit a wall, your snake will die and you will start over</li>
          </ul>

          <h3>Controls</h3>
          <p>Use arrow keys or w/a/s/d to turn</p>
        </div>

        <div class="align-center">
          <div class="game-item-play" v-if="game.limit > game.count">
            <router-link class="game-item-play-link" :to="{ name: 'play', params: { id: game.id }}">Play</router-link>
          </div>

          <div>Current players: {{ game.count }}/{{ game.limit }}</div>
        </div>
      </div>
      <div v-else>Loading</div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import converter from "number-to-words";
import store from "@/store";
import router from "@/router";
import { DELETE_GAME, FETCH_GAME, UPDATE_GAME } from "@/store/actions.type";
import SocialSharingBlock from "@/components/SocialSharingBlock";

export default {
  name: "game",
  components: {
    SocialSharingBlock
  },
  computed: {
    ...mapGetters(["game", "isLoadingGame"]),
    name: function() {
      return "Game " + converter.toWords(this.game.id);
    },
    displayName: function() {
      return this.$route.query.displayName;
    },
    embed: function() {
      return this.$route.query.embed;
    }
  },
  methods: {
    updateGame() {
      store.dispatch(UPDATE_GAME, this.game.id);
    },
    deleteGame() {
      store.dispatch(DELETE_GAME, this.game.id);
      router.push("/games");
    }
  },
  beforeRouteEnter(to, from, next) {
    Promise.all([store.dispatch(FETCH_GAME, to.params.id)]).then(() => {
      next();
    });
  },
  mounted() {
    this.gameUpdateInterval = setInterval(() => {
      this.updateGame();
    }, 10000);
  },
  beforeDestroy() {
    clearInterval(this.gameUpdateInterval);
  }
};
</script>
<style lang="scss">
.game {
  font-family: Classic, sans-serif;
  letter-spacing: 2px;

  h1 {
    text-align: center;
    font-size: 3rem;
  }

  .game-content {
    max-width: 790px;
    margin: 0 auto;

    .game-content-share {
      margin: 20px 0px;
    }

    .game-content-params {
      display: grid;
      grid-template-columns: repeat(2, 1fr);

      & > div {
        margin: 10px;

        span + span {
          margin-left: 15px;
        }
      }

      .game-item-delete {
        color: #944;
        cursor: pointer;
        font-weight: bolder;
      }

      .game-item-delete:hover {
        color: #f77;
      }

      .game-item-play {
        margin: 60px 0px;

        .game-item-play-link {
          font-size: 3rem;
          font-weight: bold;
          text-decoration: none;
          padding: 15px 30px;
          background: #a11;
          color: #fff;
        }

        .game-item-play-link:hover {
          background: #fff;
          color: #a11;
        }
      }
    }
  }
}
.align-center {
  align-items: center;
  display: flex;
  flex-direction: column;
}
</style>
