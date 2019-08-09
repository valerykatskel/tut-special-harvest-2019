<template>
  <div class="QuizSettingsResult">
    <h2>{{text.resultTitle}}</h2>
    <div v-html="transformText"></div>
  </div>
</template>

<script>
export default {
  name: 'ResultSection',

  methods: {
    centnerToTonText(val) {
      if (val > 0) {
        if (val < 1000) return `${val} центнеров`;

        let result = (val / 100).toFixed(2);

        if (result > 10000000)
          return `${(result / 1000000).toFixed(2)} млн тонн`;
        if (result > 10000) return `${(result / 1000).toFixed(2)} тысяч тонн`;
        return `${result} тонн`;
      } else return 'пока не собрали';
    },
  },

  computed: {


    transformText () {
      var re0 = /##harvestWheat##/gi;
      var re1 = /##harvestRye##/gi;
      var re2 = /##harvestHybridRye##/gi;
      var re3 = /##harvestCorn##/gi;
      var re4 = /##harvestRape##/gi;
      var re5 = /##harvest##/gi;
      let txt = this.text.resultText
      txt = txt.replace(re0, this.sections[0].harvest);
      txt = txt.replace(re1, this.sections[1].harvest);
      txt = txt.replace(re2, this.sections[2].harvest);
      txt = txt.replace(re3, this.sections[3].harvest);
      txt = txt.replace(re4, this.sections[4].harvest);
      txt = txt.replace(re5, this.totalHarvest);
      return txt;
    }
  },

  props: ['sections', 'totalHarvest', 'text'],
};
</script>
