import VueI18n from 'vue-i18n'
import en from './english'
import zh from './chinese'
import de from './german'
import Vue from 'vue'

Vue.use(VueI18n)
const i18n = new VueI18n({
  locale: 'en', // 设置默认语言
  messages: {
    en,
    zh,
    de
  }
})

export default i18n
