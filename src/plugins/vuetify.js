import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify(
    {
        iconfont: 'md' || 'fa',
        theme: {
            themes: {
              light: {
                primary: '#75728d',
                accent: '#666666',
                error: '#D50000',
                black5: '#EEEEEE',
                black4: '#BBBBBB',
                black3: '#999999',
                black2: '#666666',
                black1: '#333333',
                black0: '#000000',
                },
            },
          }
    }
);
