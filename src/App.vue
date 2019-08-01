<template>
  <div id="app">
    <result-section :sections="this.sections" v-if="showResult"/>

    <div class="sections" v-show="!showResult">
      <h1>Для начала решите, чем засеете поля страны</h1>
      <div class="sections-settings">
        <div class="fields-settings">
          <p>Общая площадь полей: {{totalFields}} га.</p>
          <p>Всего засеяно: {{total}}% | Осталось засеять: {{remaining.toFixed(2)}}%</p>

          <harvest-field
            v-for="(section, index) in this.sections" 
            :key="index"
            :rangeId="index"
            :section="section"
            :harvest="getHarvest(index)"
            @range-changed="setPercents($event)"
          />        
          
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
import random from 'random';
import ResultSection from './components/ResultSection.vue';
import HarvestField from './components/HarvestField.vue';

export default {
  name: 'App',

  components: {
    ResultSection,
    HarvestField,
  },

  data () {
    return {
      showResult: false,
      totalFields: 6173000, // общая площать всех полей, доступных для засева (га)
      sections: [
        {
          label: 'Пшеница',
          name: 'wheat',
          value: 200,
          color: '#8f2901',
          harvest: 36.5
        },
        {
          label: 'Рожь',
          name: 'rye',
          value: 200,
          color: '#d56844',
          harvest: 26.2
        },
        {
          label: 'Гибридная рожь',
          name: 'hybridRye',
          value: 200,
          color: '#ffaf3a',
          harvest: 80.0
        },
        {
          label: 'Кукуруза',
          name: 'corn',
          value: 200,
          color: '#e0cd64',
          harvest: 53.2
        },
        {
          label: 'Рапс',
          name: 'rape',
          value: 200,
          color: '#458865',
          harvest: 20.9
        }
      ]
    };
  },

  created() {
    this.setPercentsRandom();
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

    onSow() {
      this.showResult = !this.showResult;
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
      } else return 'пока не собрали';
    },

    clearPercents() {
      this.sections.forEach(el => {
        el.value = 0;
      });
    },

    getValueFromRange (i) {
      return this.sections[i].value;
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
    },

    setPercents(data) {
      let index = data.rangeId;
      // index - индекс поля, значение которого мы изменяем
      let percentOld = data.oldValue;
      let percentNew = typeof data.newValue === 'number'? data.newValue : data.newValue.target.valueAsNumber;
      let diff = percentNew - percentOld;
      if (diff === 0) return;

      let filteredSections = this.sections.filter((el, num) => (el.value > 0 || num === index)) ;
      let length = filteredSections.length;

      let diffRest = Math.abs(diff);
      let percentForOne = diffRest / (length-1);
      let cur = Math.ceil(percentForOne);
      
      this.sections.forEach((el, idx) => {
        if (idx !== index) {
          if (el.value !== 0 && diffRest > 0) {
            // тут проходимся по каждому значению оставшися полей и распределяем поровну значение, на которое был сдвинут ползунок
            diffRest -= cur;
            if (diffRest < 0) {
              cur = diffRest + Math.ceil(percentForOne);
            }
            
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
              // если нужно увеличивать значения остальных
              if (el.value + cur <= 1000) {
                // если в результате увеличения значение ползунка меньшим или равным 1000, то просто увеличиваем
                el.value += cur;
              } else {
                // если в результате увеличения значение ползунка окажется больше 1000, то нужно "вернуть" разницу, чтобы поделить ее на оставшиеся ползунки
                diffRest += (el.value + cur - 1000);
                el.value = 1000;
              }
            } 
          }
        } else {
          el.value = percentNew;
        }
      })
    },

    setPercentsRandom() {
      this.clearPercents();

      let length = this.sections.length;
      let percent = 0;

      this.sections.forEach((el, idx) => {
        percent = random.int(300, 600);

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
        this.sections[idx].value = newValue;
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
.field-type-wrapper {
  padding: 5px;
  box-shadow: 0px 0 6px 1px #7d6d4a45;
  margin: 10px;
  border-radius: 10px;
  margin: 10px;
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
</style>
