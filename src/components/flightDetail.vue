<template>
    <v-card  xs12 class="light-background pl-4 pr-4">
        <v-row>
            <v-col>
                <div v-if="flightData.return_flight==undefined" class="heroText">{{"Rs." + parseInt(flightData.cost)}}</div>
                <div v-else class="heroText">{{"Total Cost Rs." + parseInt(parseInt(flightData.cost)+parseInt(flightData.return_cost))}}</div>
                <div class="detailText">{{"Flight: " + flightData.flight_no}}</div>
                <div class="detailText">{{getCityShortName(flightData.source)+" -> "+getCityShortName(flightData.destination)}}</div>
                <div class="detailText">{{"Depart: "+new Date(flightData.departure).toLocaleString()}}</div>
                <div class="detailText">{{"Arrival: "+ new Date(flightData.arrival).toLocaleString()}}</div>
            </v-col>
            <v-col v-if="flightData.return_flight!=undefined">
                <div  class="heroText">{{"Return Cost: Rs." + parseInt(flightData.return_cost)}}</div>
                <div class="detailText">{{"Flight: " + flightData.return_flight}}</div>
                <div class="detailText">{{getCityShortName(flightData.destination)+" -> "+getCityShortName(flightData.source)}}</div>
                <div class="detailText">{{"Depart: "+ new Date(flightData.return_departure).toLocaleString()}}</div>
                <div class="detailText">{{"Arrival: "+ new Date(flightData.return_arrival).toLocaleString()}}</div>
            </v-col>
            <v-col>
                <v-img
                    :lazy-src="flightImage"
                    max-height="80"
                    max-width="200"
                    :src="flightImage"
                ></v-img>
                <v-card-actions>
                    <v-btn
                        @click="bookTheFlight()"
                        class="ma-2"
                        color="primary">
                        {{btnTitle}}
                        <template v-slot:loader>
                            <span class="custom-loader">
                                <v-icon light>mdi-cached</v-icon>
                            </span>
                        </template>
                    </v-btn>
                </v-card-actions>
            </v-col>
        </v-row>
        <v-snackbar
            v-model="snackbar"
            :timeout="snackTimeout"
            top
            color="success"
        >
            {{ snackText }}
    
            <template v-slot:action="{ attrs }">
            <v-btn
                color="white"
                text
                v-bind="attrs"
                @click="snackbar = false"
            >
                Close
            </v-btn>
            </template>
        </v-snackbar>
    </v-card>
</template>

<script>
import './../assets/main.css';
export default {
    name: 'flightDetail',
    data: ()=>({
        btnTitle: "Book this flight",
        flightImage: 'https://i.pinimg.com/originals/8e/8f/91/8e8f9163c948d9aedf6800da010cf6a5.jpg',
        snackbar: false,
        snackTimeout: 2000,
        snackText: '',
    }),
    props: {
        flightData: Object,
    },
    created(){
        if(this.flightData.return_flight!=undefined)
            this.btnTitle = "Book this journey";
    },
    methods:{
        getCityShortName(iCity){
            return(this.$store.state.cities[iCity].short_name);
        },
        bookTheFlight(){
            this.snackText = "Consider this booked :P";
            this.snackbar = true;
        }
    }

}
</script>

<style scoped>

</style>