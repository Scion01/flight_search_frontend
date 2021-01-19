import {getData, getURL} from './../utils/http';

export default {
    data(){
        return{
          journeyLabels: ["One Way","Round Trip"],
          pageSize: 5,
        }
    },
    methods:{
      async getCities(){
        const path = getURL("cities");
        try {
          const city_data = await getData(path,null,this);
          this.$store.commit("setCities",this.formatData(city_data));
          this.destination_cities = this.source_cities = city_data.map(e=>e.full_name);
        } catch (error) {
          console.log(error);
        }
      },
      async getAirlines(){
        const path = getURL("airlines");
        try{
          const arline_data = await getData(path,null,this);
          this.$store.commit("setAirlines",this.formatData(arline_data));
        }catch(e){
          console.log(e);
        }
      },
      formatData(data){
        let res = {}
        data.forEach(element=>{
          res[element.id] = element;
        })
        return res;
      }
    },
    created(){

    }
}