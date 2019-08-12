<template>
  <div 
    id="QuizSettings"
    :data-total-harvest="this.centnerToTon(this.totalHarvest, false)"   
  >
    <result-section 
      v-show="showResult"
      :sections="this.sections" 
      :totalHarvest="this.centnerToTon(this.totalHarvest, true)"
      :text="this.text"
    />

    <div class="QuizSettingsSections" v-show="!showResult">
      <h1>{{this.text.header}}</h1>
      <div class="sections-settings">
        <div class="fields-settings">
          <harvest-field
            v-for="(section, index) in this.sections" 
            :key="index"
            :rangeId="index"
            :section="section"
            @range-changed="setPercents($event)"
          />        
          
        </div>
        <div class="fields-chart">
          <vc-donut
            background="white"
            foreground="grey"
            :size="280"
            unit="px"
            :thickness="100"
            :sections="sections"
            :total="1000"
            :start-angle="0"
          >
            <h1>100%</h1>
          </vc-donut>
        </div>
      </div>
      <div class="buttons-section">
        <button class="button button--sow" :disabled="disableButton" @click="onSow()">{{this.text.button}}</button>
        <a
          href="#"
          class="button--sow-random"
          @click.prevent="setPercentsRandom()"
        >{{this.text.link}}</a>
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
      text: {
        header: '',
        button: 'Засеять',
        link: 'Разделить поля абы как',
        resultTitle: 'Результаты засеивания',
        resultText:  `<p>В 2018 году урожайность ржи была <strong>##harvestRye##</strong> центнера с гектара, пшеницы — <strong>##harvestWheat##</strong>, кукурузы — <strong>##harvestCorn##</strong>, рапса — <strong>##harvestRape##</strong>, а гибридной ржи — аж <strong>##harvestHybridRye##</strong>.
                    <p>При идеальных условиях с такой структурой посевных площадей вы могли бы собрать <strong>##harvest##</strong> урожая.</p>
                    <p>Вашим планам могут помешать погода, бесхозяйственность, экономические трудности. Попробуйте сохранить хотя бы 9,5 млн тонн, как того потребовал президент. Если значение упадет ниже 6,5 млн тонн, игра для вас закончится.</p>`,
      },
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
    this.applyUserOptions()
    this.setPercentsRandom()
  },

  methods: {
    applyUserOptions () {
      // Метод копирует значения, которые переданы прямо в html при рендеринге, если такие есть.
      if(Object.keys(initialData).length) {
        Object.keys(initialData).map(el => {
          this[el] = initialData[el]
        })
      }
    },
    
    getTotalPercents() {
      let total = 0;
      this.sections.forEach(el => (total += el.value));
      return total / 10;
    },

    onSow() {
      this.showResult = !this.showResult;
    },

    centnerToTon(val, showText) {
      if (val > 0) {
        if (val < 1000) return showText? `${val} центнеров` : val;

        let result = (val / 100).toFixed(2);

        if (result > 10000000)
          return showText? `${(result / 1000000).toFixed(2)} млн тонн` : (result / 1000000).toFixed(2);
        if (result > 10000) return showText?  `${(result / 1000).toFixed(2)} тысяч тонн` : (result / 1000).toFixed(2);
        return showText? `${result} тонн` : result;
      } else return showText? 'пока не собрали' : '';
    },

    clearPercents() {
      this.sections.forEach(el => {
        el.value = 0;
      });
    },

    setPercents(data) {
      let index = data.rangeId;
      // index - индекс поля, значение которого мы изменяем
      let percentOld = data.oldValue;
      let percentNew = typeof data.newValue === 'number'? data.newValue : data.newValue.target.valueAsNumber;
      
      if (percentNew === 1000) {
        this.sections.forEach((el, idx) => {
          if (idx === index) {
            el.value = 1000;
          } else {
            el.value = 0;
          }
        })
      } else {
        let diff = percentNew - percentOld;
        if (diff === 0) return;
        let filteredSections = [];
        let length = 0;

        if (percentOld < 1000) {
          filteredSections = this.sections.filter((el, num) => (el.value > 0 || num === index));
          length = filteredSections.length;
        } else {
          length = this.sections.length;
        }
        

        let diffRest = Math.abs(diff);
        let percentForOne = diffRest / (length-1);
        let cur = Math.ceil(percentForOne);
        
        while (diffRest > 0) {
          this.sections.forEach((el, idx) => {
            if (idx !== index) {
              if (((el.value !== 0 && percentOld < 1000) || (percentOld === 1000)) && diffRest > 0) {
                // тут проходимся по каждому значению оставшися полей и распределяем поровну значение, на которое был сдвинут ползунок
                diffRest -= cur;
                if (diffRest < 0) {
                  cur = diffRest + Math.ceil(percentForOne);
                  diffRest = 0;
                }
                
                if (diff > 0) {
                  // если нужно уменьшать значения остальных
                  if (el.value - cur >= 0) {
                  // если в результате уменьшения значение ползунка останется большим или равным нулю, то просто уменьшаем
                    el.value -= cur
                  } else {
                  // если в результате уменьшения значение ползунка окажется меньше нуля, то нужно "вернуть" разницу, чтобы поделить ее на оставшиеся ползунки
                    if (diffRest >= 0) {
                      diffRest += (cur - el.value);
                      el.value = 0;
                      length -= 1;
                      percentForOne = diffRest / (length-1);
                      cur = Math.ceil(percentForOne);
                    } else {
                      el.value = 0;
                    }
                  }
                } else {
                  // если нужно увеличивать значения остальных
                  if (el.value + cur <= 1000) {
                    // если в результате увеличения значение ползунка меньшим или равным 1000, то просто увеличиваем
                    el.value += cur;
                  } else {
                    // если в результате увеличения значение ползунка окажется больше 1000, то нужно "вернуть" разницу, чтобы поделить ее на оставшиеся ползунки
                    if (diffRest >= 0) {
                      diffRest += (el.value + cur - 1000);
                      el.value = 1000;
                      length -= 1;
                      percentForOne = diffRest / (length-1);
                      cur = Math.ceil(percentForOne);
                    } else {
                      el.value = 1000;
                    }
                  }
                } 
              }
            } else {
              el.value = percentNew;
            }
          })
        }
      }
    },

    setPercentsRandom() {
      this.clearPercents();

      let length = this.sections.length;
      let percent = 0;

      this.sections.forEach((el, idx) => {
        percent = random.int(1, 300);

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
      return totalValue.toFixed(2);
    },

    remaining() {
      return 100 - this.total;
    }
  }
};
</script>
<style lang="scss">
#QuizSettings {
  font-family: 'Arial Bold', Arial, Helvetica, sans-serif;
  .QuizSettingsSections {
    &:before,
    &:after {
      display:table;
      content:"";
    }
    &:after {
      clear:both;
    }
    h1 {
      font-family: Arial;
      font-size: 21px;
      font-weight: bold;
      margin-bottom: 20px;
      margin-top: 0;
    }
    .sections-settings {
      background-color: #fbeee0;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      padding: 30px;
      .fields-settings {
        font-family: Verdana;
        font-size: 11px;
        width: 100%;
        padding-right: 45px;
        margin-top: 6px;
        box-sizing: border-box;
        p {
          margin: 0 0 -2px 0;
        }
      }
    }
    .field-type-wrapper {
      margin: 5px 0 12px 0;
      .b-range-slider {
        margin-top: 0;
      }
      .field-type {
        font-family: 'Arial Bold', Arial, Helvetica, sans-serif;
        font-size: 13px;
        font-weight: bold;
        line-height: 21px;
        text-align: left;
        span {
          display: inline-block;
          width: 100%;
          color: gray;
          font-weight: normal;
          font-family: Arial;
          font-size: 10px;
        }
      }
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
      min-width: 260px;
      font-size: 15px;
      line-height: 19px;
      color: #fff;
      border-radius: 4px;
      padding: 15px 90px 16px;
      -webkit-transition: all 300ms;
      transition: all 300ms;
      border: 0;
      margin-bottom: 30px;
      cursor: pointer;
      &:hover{
        color: #fff!important;
        background: #a27e5c!important;
      }
    }
    .button--sow-random {
      font-size: 15px!important;
      color: #333333!important;
      text-decoration: none!important;
      border-bottom: 1px dotted #333333!important;
      font-family: Arial!important;
    }
  }
}
@media (max-width: 640px) {
  #QuizSettings {
    .QuizSettingsSections {
      .sections-settings {
        flex-direction: column;
        padding: 20px 15px 15px;
      }
      .sections-settings {
        .fields-settings {
          padding-right: 0;
          margin-top: 0;
        }
      }
      .field-type-wrapper {
        .field-type {
          font-size: 15px;
        }
      }
    }
  }
}
</style>
