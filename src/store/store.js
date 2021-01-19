import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);
export default new Vuex.Store({
    state: {
        cities: {},
        airlines: {}
    },
    getters: {
        cities: state => {
            return state.cities;
        },
        airlines: state=>{
            return state.airlines;
        }
    },
    mutations:{
        setCities(state, cities){
            state.cities = cities;
        },
        setAirlines(state,airlines){
            state.airlines = airlines;
        }
    }
});