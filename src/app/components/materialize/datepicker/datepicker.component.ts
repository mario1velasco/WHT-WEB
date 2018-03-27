// import { Component, EventEmitter } from "@angular/core"
// import { MaterializeAction } from "angular2-materialize";
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.css']
})
export class DatepickerComponent {

  // chipsActions = new EventEmitter<string|MaterializeAction>();

  // chipsInit = {
  //   data: [{
  //     tag: 'Apple',
  //   }, {
  //     tag: 'Microsoft',
  //   }, {
  //     tag: 'Google',
  //   }],
  // };
  // autocompleteInit = {
  //   autocompleteOptions: {
  //     data: {
  //       'Apple': null,
  //       'Microsoft': null,
  //       'Google': null
  //     },
  //     limit: Infinity,
  //     minLength: 1
  //   }
  // };

  // chipsPlaceholder = {
  //   placeholder: '+Tag',
  //   secondaryPlaceholder: 'Enter a tag',
  // };

  // add(chip) {
  //   console.log("Chip added: " + chip.tag);
  // }

  // delete(chip) {
  //   console.log("Chip deleted: " + chip.tag);
  // }

  // select(chip) {
  //   console.log("Chip selected: " + chip.tag);
  // }

  // updateChips() {
  //   const newChipsInit = {
  //     data: [{
  //       tag: 'Apple2',
  //     }, {
  //       tag: 'Google2',
  //     }],
  //   }
  //   this.chipsActions.emit({action:"material_chip",params:[newChipsInit]});
  // }

}
