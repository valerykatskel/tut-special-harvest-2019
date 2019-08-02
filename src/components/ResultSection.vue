<template>
  <div class="QuizSettingsResult">
    <h2>Результаты засеивания</h2>
    <p>
      В 2018 году урожайность ржи была
      <strong>{{this.sections[1].harvest}}</strong>
      центнера с гектара, пшеницы —
      <strong>{{sections[0].harvest}}</strong>,
      кукурузы —
      <strong>{{sections[3].harvest}}</strong>, рапса —
      <strong>{{sections[4].harvest}}</strong>, а гибридной ржи — аж
      <strong>{{sections[2].harvest}}</strong>
      .
      При идеальных условиях с такой структурой посевных площадей вы могли бы
      собрать <strong>{{this.totalHarvest}}</strong> урожая.
      Вашим планам могут помешать погода, бесхозяйственность, экономические
      трудности. Попробуйте сохранить хотя бы 9,5 млн тонн, как того потребовал
      президент. Если значение упадет ниже 6,5 млн тонн, игра для вас закончится.
    </p>
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

  props: ['sections', 'totalHarvest'],
};
</script>
