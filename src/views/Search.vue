<template>
    <v-container fluid class="mainContainer">
        <v-toolbar dense color="primary">
            <v-toolbar-title class="white--text" >Flight Search</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn @click="showHelp= true" icon>
            <v-icon dark class="white--text" >mdi-head-question-outline</v-icon>
            </v-btn>
        </v-toolbar>
         
        <v-row class="dataContainer" >
            <v-col cols="3"  class="filterPanel" align-self="start" >
                <v-form
                ref="searchForm"
                v-model="valid"
                lazy-validation
                >
                    <v-radio-group v-model="journeyType" row>
                        <v-radio
                        v-for="n in [0,1]"
                        :key="n"
                        :label="`${journeyLabels[n]}`"
                        :value="n"
                        ></v-radio>
                    </v-radio-group>
                    <v-autocomplete
                        v-model="source"
                        :items="source_cities"
                        color="primary"
                        hide-no-data
                        hide-selected
                        item-text="Origin City"
                        label="Origin City"
                        placeholder="Start typing to search"
                        prepend-icon="mdi-shield-airplane-outline"
                        return-object
                        :rules="shouldBePresent"
                    ></v-autocomplete>
        
                    <v-autocomplete
                        v-model="destination"
                        :items="destination_cities"
                        color="primary"
                        hide-no-data
                        hide-selected
                        item-text="Destination City"
                        label="Destination City"
                        placeholder="Start typing to search"
                        prepend-icon="mdi-shield-airplane"
                        return-object
                        :rules="destRules"
                    ></v-autocomplete>

                    <v-menu
                        ref="departure_menu"
                        v-model="departure_menu"
                        :close-on-content-click="false"
                        :return-value.sync="departure"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                        
                    >
                        <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                                v-model="departure"
                                label="Pick Departure"
                                prepend-icon="mdi-calendar"
                                readonly
                                v-bind="attrs"
                                v-on="on"
                            ></v-text-field>
                        </template>
                        <v-date-picker
                            v-model="departure"
                            no-title
                            scrollable
                            :min="todaysDate"
                        >
                            <v-spacer></v-spacer>
                            <v-btn
                                text
                                color="primary"
                                @click="departure_menu = false"
                            >
                                Cancel
                            </v-btn>
                            <v-btn
                                text
                                color="primary"
                                @click="$refs.departure_menu.save(departure)"
                            >
                            OK
                            </v-btn>
                        </v-date-picker>
                        </v-menu>

                        <v-menu
                        ref="arrival_menu"
                        v-model="arrival_menu"
                        :close-on-content-click="false"
                        :return-value.sync="departure"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                        :disabled="journeyType==0"
                        
                    >
                        <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                                v-model="arrival"
                                label="Pick Arrival"
                                prepend-icon="mdi-calendar"
                                readonly
                                v-bind="attrs"
                                v-on="on"
                                @click="enableArrival()"
                            ></v-text-field>
                        </template>
                        <v-date-picker
                            v-model="arrival"
                            no-title
                            scrollable
                            :min="departure"
                        >
                            <v-spacer></v-spacer>
                            <v-btn
                                text
                                color="primary"
                                @click="arrival_menu = false"
                            >
                                Cancel
                            </v-btn>
                            <v-btn
                                text
                                color="primary"
                                @click="$refs.arrival_menu.save(departure)"
                            >
                            OK
                            </v-btn>
                        </v-date-picker>
                        </v-menu>
                        
                        <v-select
                            v-model="passengerCount"
                            :items="passengerCountList"
                            label="Passenger Count"
                            dense
                            outlined
                            class="pt-3"
                        ></v-select>

                        <v-range-slider
                            v-model="priceRange"
                            :hint='"Between " + priceRange[0] + " and " + priceRange[1]'
                            :max="costHigh"
                            :min="costFloor"
                            :step="costStep"
                            persistent-hint
                        ></v-range-slider>
                        <v-btn
                            color="primary"
                            dark
                            small
                            class="mt-2"
                            @click="clearFields()"
                        >Clear Form
                        </v-btn>
                        <v-btn
                            :loading="loadingResults"
                            color="primary"
                            class="white--text align-self-right mb-4"
                            @click="applyFilters()"
                            style="float:right"
                            dark
                        >
                            Search
                            <v-icon
                            right
                            dark
                            >
                            mdi-airplane-takeoff
                            </v-icon>
                        </v-btn>
                </v-form>
            </v-col>
            <v-col align-self="center" cols="7" v-if="flightsData['flights'] && flightsData['flights'].length == 0">
                <div class="floatCenter">No Data for these filters :( </div>
                <div class="floatCenter">Try playing a bit more with those filters :P</div>
            </v-col> 
            <v-col cols="7" v-else>
                <div v-for="(flight,id) in flightsData['flights']" :key="id" class="mb-4">
                    <flightDetail :flightData="flight" />
                </div>
                <v-pagination
                    v-if="pageLength > 0"
                    v-model="page"
                    :length="pageLength"
                    circle
                ></v-pagination> 
            </v-col>
            
        </v-row>
        <v-snackbar
            v-model="snackbar"
            :timeout="snackTimeout"
            top rounded="pill"
        >
            {{ snackText }}
    
            <template v-slot:action="{ attrs }">
            <v-btn
                color="primary"
                text
                v-bind="attrs"
                @click="snackbar = false"
            >
                Close
            </v-btn>
            </template>
        </v-snackbar>
        <v-dialog v-model="showHelp" width="500">
            <v-card>
                <v-card-title class="primary white--text" primary-title>
                    About This Tool
                </v-card-title>
                
                <v-card-text class="mt-2">
                    The Default data loaded are all flights, the APIs are paginated and so is the frontend, to get filtered results
                    use the filters on left and click "SEARCH". EZPZ! The 'Booking' doesn't work..
                </v-card-text>

                <v-divider></v-divider>
                <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    color="primary"
                    flat
                    @click="showHelp = false"
                >
                    Close
                </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
         
    </v-container>
</template>

<script>
import './../assets/main.css';
import GenericData from './../mixins/genericData';
import {getURL, getData, postData} from './../utils/http';
import flightDetail from '../components/flightDetail.vue';
export default {
    name: 'Search',
    mixins: [GenericData],
    components: {flightDetail},
    data: ()=>({
        name: "dsad",
        journeyType: 0,
        source: "",
        source_cities: [],
        destination_cities: [],
        destination: "",
        departure: new Date().toISOString().substr(0, 10),
        arrival: new Date().toISOString().substr(0, 10),
        departure_menu: false,
        arrival_menu: false,
        todaysDate: new Date().toISOString().slice(0,10),
        snackTimeout: 2000,
        snackbar: false,
        snackText: '',
        passengerCount: 1,
        passengerCountList: [1,2,3,4,5,6,7,8,9],
        costHigh: 10000,
        costFloor: 0,
        priceRange: [0,10000],
        costStep: 100,
        loadingResults: false,
        flightsData: [],
        page: 1,
        pageLength: 0,
        filtersApplied: false,
        valid: true,
        shouldBePresent: [
            v => !!v || 'Field is required',
        ],
        destRules:[
            v => !!v || 'Field is required'
        ],
        showHelp: false
    }),
    methods :{
        enableArrival(){
            if(this.journeyType == 1)
                return;
            this.journeyType = 1;
            this.snackText = "Enabled two-way journey...";
            this.snackbar = true;
        },
        clearFields(){
            this.departure = this.arrival = new Date().toISOString().substr(0, 10);
            this.costHigh = 10000;
            this.costFloor = 0;
            this.passengerCount = 1;
            this.source = this.destination = "";
            this.filtersApplied = false;
            this.getAllFlights(0);
        },
        async applyFilters(iPage = 1){
            this.filtersApplied = true;
            if(!this.$refs.searchForm.validate())
                return;
            if(this.source == this.destination){
                this.snackText = "Origin and Destination cannot be same..";
                this.snackTimeout = 2000;
                this.snackbar = true;
                return;
            }
            const path = getURL(`get_filtered_flights`);
        
            let requestData = {
                type: this.journeyType,
                source: this.getCodeFromCity(this.source),
                destination: this.getCodeFromCity(this.destination),
                return: this.arrival,
                departure: this.departure,
                passenger_count: this.passengerCount,
                price_high: this.priceRange[1],
                price_low: this.priceRange[0],
                page: iPage,
            }
            try {
                this.flightsData = await postData(path,requestData,null,this);
                console.log(this.flightsData)
                this.pageLength = parseInt(this.flightsData['count']/this.pageSize +( (this.flightsData['count']%this.pageSize == 0)? 0:1));
            } catch (error) {
                console.log(error);
            }
        },
        async getAllFlights(page){
            const path = getURL(`get_all_flights/${page}`);
            try {
                this.flightsData = await getData(path,null,this);
                this.pageLength = parseInt(this.flightsData['count']/this.pageSize +( (this.flightsData['count']%this.pageSize == 0)? 0:1));
                
            } catch (error) {
                console.log(error);
            }
        },
        getCodeFromCity(iCity){
            for(let key in this.$store.state.cities){
                if(this.$store.state.cities[key].full_name == iCity)
                    return key;
            }
            throw new Error(`City code not found for ${iCity}`);
        }
    },
    mounted(){

    },
    created(){
        this.getCities();
        this.getAirlines();
        this.getAllFlights(1);
    },
    watch:{
        arrival: function(val){
            if(new Date(val)<new Date(this.departure))
                this.departure = new Date(val).toISOString().slice(0,10)
        },
        departure: function(val){
            if(new Date(val)>new Date(this.arrival))
                this.arrival = new Date(val).toISOString().slice(0,10)
        },
        page: function(val){
            if(!this.filtersApplied)
                this.getAllFlights(val);
            else
                this.applyFilters(val);
        }
    }
}
</script>

<style scoped>
.mainContainer{
    width: 100%;
}
.filterPanel{
    margin: 1rem 5rem 1rem 1rem;
    background-color: var(--light-back);
    border-radius: 5%;
}
.dataContainer{
    padding-top: 3rem;
}
.floatCenter{
    width: 100%;
    text-align: center;
}
</style>