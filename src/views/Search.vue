<template>
    <div class="mainContainer">
        <v-toolbar dense color="primary">
            <v-toolbar-title >Title</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon>
            <v-icon dark >mdi-account-question-outline</v-icon>
            </v-btn>
        </v-toolbar>
         
        <v-row class="dataContainer" >
            <v-flex xs3 pl-4 class="filterPanel" pr-4>
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
                ></v-autocomplete>
                <v-autocomplete
                    v-model="destination"
                    :items="destination_cities"
                    color="primary"
                    hide-no-data
                    hide-selected
                    item-text="Origin City"
                    label="Origin City"
                    placeholder="Start typing to search"
                    prepend-icon="mdi-shield-airplane"
                    return-object
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

            </v-flex>
            <v-flex xs9>

            </v-flex>
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
         
    </div>
</template>

<script>
import './../assets/main.css';
export default {
    name: 'Search',
    data: ()=>({
        name: "dsad",
        journeyType: 0,
        source: "Pune",
        source_cities: [],
        destination_cities: [],
        destination: "Delhi",
        departure: new Date().toISOString().substr(0, 10),
        arrival: new Date().toISOString().substr(0, 10),
        departure_menu: false,
        arrival_menu: false,
        todaysDate: new Date().toISOString().slice(0,10),
        snackTimeout: 2000,
        snackbar: false,
        snackText: '',
        passengerCount: 1,
        passengerCountList: [1,2,3,4,5],
        costHigh: 1000,
        costFloor: 0,
        priceRange: [0,1000],
        costStep: 100,
        loadingResults: false
    }),
    methods :{
        enableArrival(){
            if(this.journeyType == 1)
                return;
            this.journeyType = 1;
            this.snackText = "Enabled two-way journey...";
            this.snackbar = true;
        },
        applyFilters(){
            
        }
    },
    mounted(){

    },
    created(){

    },
    watch:{
        arrival: function(val){
            if(new Date(val)<new Date(this.departure))
                this.departure = new Date(val).toISOString().slice(0,10)
        },
        departure: function(val){
            if(new Date(val)>new Date(this.arrival))
                this.arrival = new Date(val).toISOString().slice(0,10)
        }
    }
}
</script>

<style scoped>
.mainContainer{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}
.filterPanel{
    margin: 1rem 5rem 1rem 1rem;
    background-color: var(--light-back);
    border-radius: 5%;
}
.dataContainer{
    padding-top: 3rem;
}
</style>