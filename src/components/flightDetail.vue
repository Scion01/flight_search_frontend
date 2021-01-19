<template>
    <v-flex xs12 class="light-background mb-5">
        <v-row>
            <v-col>
                <div class="heroText">{{flightData[0].cost}}</div>
                <div class="detailText">{{flightData[0].flight_no}}</div>
                <div class="detailText">{{flightData[0].source+">"+flightData[0].destination}}</div>
                <div class="detailText">{{"Depart: "+flightData[0].departure}}</div>
                <div class="detailText">{{"Arrival: "+flightData[0].arrival}}</div>
            </v-col>
            <v-col v-if="flightData[1]!=undefined">
                <div class="detailText">{{flightData[1].flight_name}}</div>
                <div class="detailText">{{flightData[1].source+">"+flightData[1].destination}}</div>
                <div class="detailText">{{"Depart: "+flightData[1].departure}}</div>
                <div class="detailText">{{"Arrival: "+flightData[1].arrival}}</div>
            </v-col>
            <v-col>
                <v-img
                    :lazy-src="flightData[0].image"
                    max-height="150"
                    max-width="250"
                    :src="flightData[0].image"
                ></v-img>
                <v-btn
                    class="ma-2"
                    color="primary">
                    Book this flight
                    <template v-slot:loader>
                        <span class="custom-loader">
                            <v-icon light>mdi-cached</v-icon>
                        </span>
                    </template>
                </v-btn>
            </v-col>
        </v-row>
    </v-flex>
</template>

<script>
import './../assets/main.css';
export default {
    name: 'flightDetail',
    data: ()=>({

    }),
    props: {
        flightData: Array,
    },
    created(){
        
    }

}
</script>

<style scoped>

</style>