<template>
  <div class="QuizSettingsResult">
    <h2>Результаты засеивания</h2>
    <p>
      В 2018 году урожайность ржи была
      <strong>{{harvestRye}}</strong>
      центнера с гектара, пшеницы —
      <strong>{{sections[0].harvest}}</strong>,
      кукурузы —
      <strong>{{sections[3].harvest}}</strong>, рапса —
      <strong>{{sections[4].harvest}}</strong>, а гибридной ржи — аж
      <strong>{{sections[2].harvest}}</strong>
      .
      При идеальных условиях с такой структурой посевных площадей вы могли бы
      собрать
      <strong>{{this.totalHarvest}}</strong> урожая.
      Вашим планам могут помешать погода, бесхозяйственность, экономические
      трудности. Попробуйте сохранить хотя бы 9,5 млн тонн, как того потребовал
      президент. Если значение упадет ниже 6,5 млн тонн, игра для вас закончится.
    </p>
    <button @click="onStart()">Начать</button>
  </div>
</template>

<script>
export default {
  name: 'ResultSection',

  props: ['sections', 'totalHarvest'],

  computed: {
    harvestRye() {
      return this.sections[1].harvest;
    }
  },

  methods: {
    // Метод обрабатывает клик по кнопке начала игры
    onStart () {
      alert("дальше начинается игра");
    }
  }
};
</script>
