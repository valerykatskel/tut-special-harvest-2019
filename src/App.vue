<template>
  <div id="app">
    <result-section :sections="this.sections" v-if="showResult"/>

    <div class="sections" v-show="!showResult">
      <h1>Для начала решите, чем засеете поля страны</h1>
      <div class="sections-settings">
        <div class="fields-settings">
          <p>Общая площадь полей: {{totalFields}} га.</p>
          <p>Всего засеяно: {{total}}% | Осталось засеять: {{remaining}}%</p>

          <!-- пшеница -->
          <p class="field-type">
            Пшеница: {{(sections[0].value/10).toFixed(2)}}%
            <span>урожайность: {{sections[0].harvest}} ц/га</span>
            <span>урожай: {{getHarvest(0)}}</span>
          </p>
          <div class="b-range-slider">
            <input 
              type="range" 
              class="slider slider--hybridRye"
              min="0" 
              max="1000" 
              step="10" 
              name="weat" 
              v-model.number="valueWeat"
              @input="setPercents(0)"
            />
            <!-- <vue-slider :min="0" :max="1000" step="10" name="weat" v-model.number="valueWeat"/> -->
            <!-- <range-slider
              class="slider slider--weat"
              min="0"
              max="1000"
              step="10"
              name="weat"
              v-model.number="valueWeat"
              @input="setPercents(0)"
            ></range-slider> -->
          </div>

          <!-- рожь -->
          <p class="field-type">
            Рожь: {{(sections[1].value/10).toFixed(2)}}%
            <span>урожайность: {{sections[1].harvest}} ц/га</span>
            <span>урожай: {{getHarvest(1)}}</span>
          </p>

          <div class="b-range-slider">
            <!-- <range-slider
              class="slider slider--rye"
              min="0"
              max="1000"
              step="10"
              name="rye"
              v-model.lazy="valueRye"
            ></range-slider> -->
            <input
              type="range"
              class="slider slider--rye"
              min="0"
              max="1000"
              step="10"
              name="rye"
              v-model.lazy="valueRye"
              @input="setPercents(1)"
            />
          </div>

          <!-- гибридная рожь -->
          <p class="field-type">
            Гибридная рожь: {{(sections[2].value/10).toFixed(2)}}%
            <span>урожайность: {{sections[2].harvest}} ц/га</span>
            <span>урожай: {{getHarvest(2)}}</span>
          </p>

          <div class="b-range-slider">
            <!-- <range-slider
              class="slider slider--hybridRye"
              min="0"
              max="1000"
              step="10"
              name="hybridRye"
              v-model.number="valueHybridRye"
            ></range-slider> -->
            <input
              type="range"
              class="slider slider--hybridRye"
              min="0"
              max="1000"
              step="10"
              name="hybridRye"
              v-model.number="valueHybridRye"
            />
          </div>

          <!-- кукуруза -->
          <p class="field-type">
            Кукуруза: {{(sections[3].value/10).toFixed(2)}}%
            <span>урожайность: {{sections[3].harvest}} ц/га</span>
            <span>урожай: {{getHarvest(3)}}</span>
          </p>

          <div class="b-range-slider">
            <!-- <range-slider
              class="slider slider--corn"
              min="0"
              max="1000"
              step="10"
              name="corn"
              v-model.number="valueCorn"
            ></range-slider> -->
            <input
              type="range"
              class="slider slider--corn"
              min="0"
              max="1000"
              step="10"
              name="corn"
              v-model.number="valueCorn"
            />
          </div>

          <!-- рапс -->
          <p class="field-type">
            Рапс: {{(sections[4].value/10).toFixed(2)}}%
            <span>урожайность: {{sections[4].harvest}} ц/га</span>
            <span>урожай: {{getHarvest(4)}}</span>
          </p>

          <div class="b-range-slider">
            <!-- <range-slider
              class="slider slider--rape"
              min="0"
              max="1000"
              step="10"
              name="rape"
              v-model.number="valueRape"
            ></range-slider> -->
            <input
              type="range"
              class="slider slider--rape"
              min="0"
              max="1000"
              step="10"
              name="rape"
              v-model.number="valueRape"
            />
          </div>
        </div>
        <div class="fields-chart">
          <vc-donut
            background="white"
            foreground="grey"
            :size="250"
            unit="px"
            :thickness="60"
            :sections="sections"
            :total="1000"
            :start-angle="0"
            @section-click="handleSectionClick"
          >
            <h1>100%</h1>
          </vc-donut>
        </div>
      </div>
      <div class="buttons-section">
        <button class="button button--sow" :disabled="disableButton" @click="onSow()">Засеять</button>
        <a
          href="#"
          class="button--sow-random"
          @click.prevent="setPercentsRandom()"
        >Разделить поля абы как</a>
      </div>
    </div>
  </div>
</template>

<script>
import random from "random";
import RangeSlider from "vue-range-slider";
import ResultSection from "./components/ResultSection.vue";
// you probably need to import built-in style
import "vue-range-slider/dist/vue-range-slider.css";

export default {
  name: "App",
  components: {
    RangeSlider,
    ResultSection,
  },
  data () {
    return {
      slider: {
        lineHeight: 10,
        processStyle: {
          backgroundColor: "red"
        }
      },
      statusActiveRange: 0,
      statusNeedChangedRange: 0,
      valueWeat: 200,
      valueRye: 200,
      valueHybridRye: 200,
      valueCorn: 200,
      valueRape: 200,
      showResult: false,
      totalFields: 6173000, // общая площать всех полей, доступных для засева (га)
      sections: [
        {
          label: "Пшеница",
          value: 200,
          color: "#8f2901",
          harvest: 36.5
        },
        {
          label: "Рожь",
          value: 200,
          color: "#d56844",
          harvest: 26.2
        },
        {
          label: "Гибридная рожь",
          value: 200,
          color: "#ffaf3a",
          harvest: 80.0
        },
        {
          label: "Кукуруза",
          value: 200,
          color: "#e0cd64",
          harvest: 53.2
        },
        {
          label: "Рапс",
          value: 200,
          color: "#458865",
          harvest: 20.9
        }
      ]
    };
  },

  created() {
    this.setPercentsRandom();
  },

  watch: {
    valueWeat(newValue, oldValue) {
      //this.setPercents (false, 0);
      // if (this.statusActiveRange !== 0) {
      //   this.statusActiveRange = 0;
      //   this.statusNeedChangedRange = 0;
      // }
      // let diff = (newValue - oldValue) * -1;
      // console.log(`diffWeat=${diff}`);

      // this.sections.forEach((el, idx) => {
      //   if (idx === this.statusNeedChangedRange) {
      //     el.value += diff; // проверить
      //     this.statusNeedChangedRange += 1;

      //     if (this.statusNeedChangedRange > this.sections.lenght) {
      //       this.statusNeedChangedRange = 0;
      //     }
      //   }
      // });

      //this.updateChartData(newValue, oldValue, 0);
      // if (newValue > 500) {
      //   this.valueWeat = oldValue;
      // } else {
      //   //this.updateChartData(newValue, oldValue, 0);
      // }
    },

    valueRye(newValue, oldValue) {
      // if (this.statusActiveRange !== 1) {
      //   this.statusActiveRange = 1;
      //   this.statusNeedChangedRange = 0;
      // }
      // let diff = (newValue - oldValue) * -1;
      // console.log(`diffRye=${diff}`);

      // this.sections.forEach((el, idx) => {
      //   if (idx === this.statusNeedChangedRange) {
      //     el.value += diff; // проверить
      //     this.statusNeedChangedRange += 1;

      //     if (this.statusNeedChangedRange > this.sections.lenght) {
      //       this.statusNeedChangedRange = 0;
      //     }
      //   }
      // });
      //this.updateChartData(newValue, oldValue, 1);
    },

    valueHybridRye(newValue, oldValue) {
      //this.updateChartData(newValue, oldValue, 2);
    },

    valueCorn(newValue, oldValue) {
      //this.updateChartData(newValue, oldValue, 3);
    },

    valueRape(newValue, oldValue) {
      //this.updateChartData(newValue, oldValue, 4);
    }
  },

  methods: {
    getTotalPercents() {
      let total = 0;
      this.sections.forEach(el => (total += el.value));
      return (total / 10).toFixed(2);
    },

    correctValues(index, deltaValue) {
      let data = this.sections.filter((el, i) => i > index);
      let d = -1 * (deltaValue / data.length);
      let totalSum;

      let sumValue = 0;
      this.sections.forEach((el, i) =>
        i <= index ? (sumValue += el.value) : ""
      );
      totalSum = sumValue;

      if (sumValue < 1000) {
        data.forEach((el, i) => {
          if (this.sections[i] > 0) {
            if (i === data.length - 1) {
              if (1000 - totalSum >= 0) {
                el.value = 1000 - totalSum;
                totalSum += el.value;
              }
            } else {
              if (el.value + d >= 0) {
                let newValue = el.value + d;

                el.value = newValue;
                totalSum += el.value;
              }
            }
          }
        });
      }
    },

    maxValue(index) {
      return this.total < 1000 ? 1000 : this.sections[index].value;
    },

    handleSectionClick(section) {
      console.log(`${section.label} clicked.`);
    },

    onSow() {
      this.showResult = !this.showResult;
    },

    updateChartData(nv, ov, idx) {
      let deltaValue = nv - ov;
      if (this.total + deltaValue <= 1000) {
        this.sections[idx].value = nv;
        this.correctValues(idx, deltaValue);
      } else {
        console.log(`> 100!!! OLD:${ov} NEW: ${nv}`);
      }
    },

    getHarvest(index) {
      let el = this.sections[index];
      return this.centnerToTon(
        (this.totalFields * (el.value / 1000) * el.harvest).toFixed(2)
      );
    },

    centnerToTon(val) {
      if (val > 0) {
        if (val < 1000) return `${val} центнеров`;

        let result = (val / 10).toFixed(2);

        if (result > 1000000)
          return `${(result / 1000000).toFixed(2)} млн тонн`;
        if (result > 1000) return `${(result / 1000).toFixed(2)} тысяч тонн`;
        return `${result} тонн`;
      } else return "пока не собрали";
    },

    clearPercents() {
      this.sections.forEach(el => {
        el.value = 0;
      });
    },

    getValueFromRange (i) {
      return this.sections[i].value;
    },

    getChangedValue (idx) {
      let res;
      if (idx === 0) res = this.valueWeat;
      if (idx === 1) res = this.valueRye;
      if (idx === 2) res = this.valueHybridRye;
      if (idx === 3) res = this.valueCorn;
      if (idx === 4) res = this.valueRape;
      return res;
    },

    updateModel (idx, val) {
      if (idx === 0) this.valueWeat = val;
      if (idx === 1) this.valueRye = val;
      if (idx === 2) this.valueHybridRye = val;
      if (idx === 3) this.valueCorn = val;
      if (idx === 4) this.valueRape = val;    
    },

    isNumberWithoutRemainder (val) {
      if (val < 10) {
        if (Math.round(val % 10) == val) {
          return true;
        } else {
          return false;
        }
      } else {
        if (val % 10 === 0) {
          return true;
        } else {
          return false;
        }
      }
      return false;
    },

    setPercents(index) {
      // index - индекс поля, значение которого мы изменяем
      let filteredSections = this.sections.filter(el=>el.value !== 0);
      
      let length = filteredSections.length - 1;
      let percentOld = this.getValueFromRange(index);
      let percentNew = this.getChangedValue(index);
      
      let diff = percentNew - percentOld;
      let diffRest = Math.abs(diff);
      let percentForOne = diffRest / length;

      filteredSections.forEach((el, idx) => {
        
        if (idx !== index) {
          let cur = 0;
          // тут проходимся по каждому значению оставшися полей и распределяем поровну значение, на которое был сдвинут ползунок
          if (this.isNumberWithoutRemainder(percentForOne)) {
            // если в результате деления значения, на которое увеличился передвигаемый ползунок, на оставшиеся ползунки полилось целое значение
            if (diff > 0) {
              // если нужно уменьшать значения остальных
              if (el.value - cur >= 0) {
                // если в результате уменьшения значение ползунка останется большим или равным нулю, то просто уменьшаем
                el.value -= cur
              } else {
                // если в результате уменьшения значение ползунка окажется меньше нуля, то нужно "вернуть" разницу, чтобы поделить ее на оставшиеся ползунки
                diffRest += (cur - el.value);
                el.value = 0;
              }

            } else {
              el.value += percentForOne
            }
          } else {
            cur = Math.round(percentForOne);
            diffRest -= cur;
            if (diffRest >= 0) {
              if (diff > 0) {
                if (el.value - cur >= 0) {
                  el.value -= cur
                } else {
                  diffRest += (cur - el.value);
                  el.value = 0;
                }
              } else {
                if (el.value + cur <= 1000) {
                  el.value += cur;
                } else {
                  //diffRest += (cur - el.value);
                  el.value = 1000;
                }
              }
            } else {
              let tempDelta = diffRest + cur;
              if (diff > 0) {
                if (el.value - tempDelta >= 0) {
                  el.value -= tempDelta;
                } else {
                  diffRest += (tempDelta - el.value);
                  el.value = 0;
                }
              } else {
                if (el.value - tempDelta <= 1000) {
                  el.value += (diffRest + cur);
                } else {
                  el.value = 1000;
                }
              }
            }
          }
        } else {
          el.value = percentNew;
        }
        this.updateModel(idx, el.value);
      })
    },

    setPercentsRandom() {
      this.clearPercents();

      let length = this.sections.length;
      let percent = 0;

      this.sections.forEach((el, idx) => {
        percent = random.int(1, 600);

        let newValue = 0;
        if (idx === 0) {
          newValue = percent;
        } else {
          if (idx !== length - 1) {
            if (1000 - this.getTotalPercents() * 10 - percent > 0) {
              newValue = percent;
            } else {
              newValue = 1000 - this.getTotalPercents() * 10;
            }
          } else {
            newValue = 1000 - this.getTotalPercents() * 10;
          }
        }
        console.log(
          `i=${idx} random=${percent} | total=${
            this.total
          } | newValue=${newValue}`
        );
        this.sections[idx].value = newValue;

        // update model
        if (idx === 0) this.valueWeat = newValue;
        if (idx === 1) this.valueRye = newValue;
        if (idx === 2) this.valueHybridRye = newValue;
        if (idx === 3) this.valueCorn = newValue;
        if (idx === 4) this.valueRape = newValue;
      })
    },
  },

  computed: {
    total() {
      return this.getTotalPercents();
    },

    disableButton() {
      return this.total !== 100;
    },

    totalHarvest() {
      let totalValue = 0;
      this.sections.forEach(
        el => (totalValue += this.totalFields * (el.value / 100) * el.harvest)
      );
      return this.centnerToTon(totalValue.toFixed(2));
    },

    remaining() {
      return 100 - this.total;
    }
  }
};
</script>
<style>
h1 {
  font-family: Arial;
  font-size: 21px;
  font-weight: bold;
}
.sections-settings {
  background-color: #fbeee0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 30px;
}
.fields-settings {
  font-family: Verdana;
  font-size: 11px;
}
.fields-settings p {
  margin: 0;
}

.field-type {
  font-family: Verdana;
  font-size: 13px;
  font-weight: bold;
}
.field-type span {
  display: inline-block;
  width: 100%;
  color: gray;
  font-weight: normal;
  font-family: Arial;
  font-size: 10px;
}
.buttons-section {
  width: 100%;
  text-align: center;
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.button--sow {
  background-color: #b48d68;
  width: 260px;
  font-size: 15px;
  line-height: 19px;
  color: #fff;
  border-radius: 4px;
  padding: 15px 90px 16px;
  -webkit-transition: all 300ms;
  transition: all 300ms;
  border: 0;
  margin-bottom: 30px;
}
.button--sow-random {
  font-size: 15px;
  color: #333333;
  text-decoration: none;
  border-bottom: 1px dotted #333333;
  font-family: Arial;
}
.slider {
  margin: 20px 0 0 0;
  width: 100%;
}
.range-slider .range-slider-knob {
  width: 16px;
  height: 16px;
}
.range-slider.slider.slider--weat .range-slider-inner .range-slider-fill {
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
