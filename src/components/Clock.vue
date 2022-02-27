<template>
  <div class="clock-wrap">
    <div class="clock">
      <div class="wrap">
        <div class="ring"></div>
        <div class="panel"></div>
        <div ref="hour" class="hour"></div>
        <div ref="minute" class="minute"></div>
        <div ref="second" class="second"></div>
        <div class="pin"></div>
        <div class="mynum">
          <span style="--i: 1">7</span>
          <span style="--i: 2">8</span>
          <span style="--i: 3">9</span>
          <span style="--i: 4">10</span>
          <span style="--i: 5">11</span>
          <span style="--i: 6">12</span>
          <span style="--i: 7">1</span>
          <span style="--i: 8">2</span>
          <span style="--i: 9">3</span>
          <span style="--i: 10">4</span>
          <span style="--i: 11">5</span>
          <span style="--i: 12">6</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      inc: 1000
    };
  },
  mounted() {
    this.myclock()
    setInterval(this.myclock, this.inc);
  },
  methods: {
    myclock() {
      const mydate = new Date();
      const hours = ((mydate.getHours() + 11) % 12) + 1;
      const minutes = mydate.getMinutes();
      const seconds = mydate.getSeconds();
      const hdegree = hours * 30;
      const mdegree = minutes * 6;
      const sdegree = seconds * 6;
      this.$refs.hour.style.transform = `rotate(${hdegree}deg)`;
      this.$refs.minute.style.transform = `rotate(${mdegree}deg)`;
      this.$refs.second.style.transform = `rotate(${sdegree}deg)`;
    }
  }
};
</script>
<style scoped lang="scss">
.clock {
  position: relative;
  border-radius: 100%;
  box-shadow: 0px 3px 20px 0px rgb(0 0 0 / 30%),
    inset 6px 9px 10px 10px rgb(0 0 0 / 30%);
  .wrap {
    width: 250px;
    height: 250px;
    border-radius: 100%;

    .ring {
      position: absolute;
      width: 100%;
      height: 100%;
      border: 20px solid #ffffff;
      border-radius: 100%;
      box-sizing: border-box;
      border-left: 20px solid #c160ff;
      border-right: 20px solid #fd7013;
      box-shadow: inset 2px -1px 9px #00000024;
      // animation: ringmove 10s infinite alternate;
    }
    // @keyframes ringmove {
    //   50% {
    //     border-radius: 38% 62% 29% 71% / 41% 59% 41% 59%;
    //   }
    //   to {
    //     border-radius: 56% 44% 59% 41% / 50% 47% 53% 50%;
    //   }
    // }

    .panel {
      position: absolute;
      height: 180px;
      width: 180px;
      background-color: #f06966;
      box-shadow: 1px 1px 3px #23202070, inset 1px 1px 9px #f4f4f4;
      margin: auto;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      border-radius: 100%;
    }
    .panel:after {
      content: 'TIME';
      position: absolute;
      top: 48px;
      left: 0;
      right: 0;
      bottom: 0;
      color: silver;
      font-size: 11px;
      text-align: center;
    }

    .string1 {
      transform: rotate(45deg);
    }
    .string2 {
      transform: rotate(135deg);
    }
    .string3 {
      transform: rotate(0deg);
      border-bottom: 200px solid black;
      border-top: 0;
    }
    .hour,
    .minute,
    .second {
      position: absolute;
      background-color: #f0d879;
      margin: auto;
      left: 0;
      right: 0;
      transform-origin: bottom center;
    }
    .hour {
      height: 50px;
      width: 5px;
      top: 75px;
      border-radius: 10px;
      background-color: #b9edf8;
    }
    .minute {
      height: 65px;
      width: 3.5px;
      top: 60px;
      border-radius: 10px;
      background-color: #e6e6e6;
    }
    .second {
      height: 70px;
      width: 2px;
      top: 55px;
      border-radius: 3px;
    }
    .pin {
      position: absolute;
      width: 5px;
      height: 5px;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      margin: auto;
      background-color: orange;
      border: 2px solid white;
      border-radius: 100%;
    }
    .mynum {
      font-family: 'verdana';
      font-size: 1.2em;
      color: white;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
      span {
        position: absolute;
        transform: rotate(calc(var(--i) * 30deg)) translate(0px, 75px);
      }
    }
  }
}

@keyframes myanim1 {
  to {
    transform: rotate(360deg);
  }
}
</style>
