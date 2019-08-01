<template>
  <!-- {{this.section.label}} -->
  <div class="field-type-wrapper">
    <p class="field-type">
      {{this.section.label}}: {{(this.section.value/10).toFixed(2)}}%
      <span>урожайность: {{this.section.harvest}} ц/га</span>
      <span>урожай: {{this.harvest}}</span>
    </p>
    <div class="b-range-slider">
      <!-- <input 
        type="range" 
        :rangeId="this.rangeId"
        :class="getSliderClass()"
        min="0" 
        max="1000" 
        step="1"
        :name="this.section.name"
        :value="this.section.value"
        @input="onInputRange($event)"
      /> -->
      <range-slider
        :rangeId="this.rangeId"
        :class="getSliderClass()"
        min="0" 
        max="1000" 
        step="1"
        :name="this.section.name"
        :value="this.section.value"
        @input="onInputRange($event)"
      ></range-slider>
    </div>
  </div>
</template>

<script>
import RangeSlider from 'vue-range-slider';
import 'vue-range-slider/dist/vue-range-slider.css';

export default {
  name: 'HarvestField',

  components: {
    RangeSlider
  },

  props: ['section', 'harvest', 'rangeId'],

  computed: {
    harvestRye() {
      return this.section.harvest;
    }
  },

  methods: {
    // Метод обрабатывает клик по кнопке начала игры
    onStart () {
      alert("дальше начинается игра");
    },

    onInputRange (value) {
      let data = {
        rangeId: this.rangeId,
        newValue: value,
        oldValue: this.section.value
      }
      this.$emit('range-changed', data)
    },

    getSliderClass () {
      return `slider slider--${this.section.name}`;
    },

  },
};
</script>
<style>
.slider {
  margin: 20px 0 0 0;
  width: 100%;
}
.b-range-slider {
  padding: 0 10px;
}
.range-slider .range-slider-knob {
  width: 16px;
  height: 16px;
}
.range-slider.slider.slider--wheat .range-slider-inner .range-slider-fill {
  background-color: #8f2901;
}
.range-slider.slider.slider--rye .range-slider-inner .range-slider-fill {
  background-color: #d56844;
}
.range-slider.slider.slider--hybridRye .range-slider-inner .range-slider-fill {
  background-color: #ffaf3a;
}
.range-slider.slider.slider--corn .range-slider-inner .range-slider-fill {
  background-color: #e0cd64;
}
.range-slider.slider.slider--rape .range-slider-inner .range-slider-fill {
  background-color: #458865;
}
</style>

