/**
 * Title:  Bob's Computer Repair Shop
 * Authors: Danial Purselley, William Watlington, Kayla McDanel
 * Date: 26 Feb 2023
 * Description: A web application for a computer repair shop
 */


import { Component, OnInit } from '@angular/core';
import { InvoiceService } from 'src/app/services/invoice.service';

//component that pulls invoice info into graph
@Component({
  selector: 'app-purchases-by-service-graph',
  templateUrl: './purchases-by-service-graph.component.html',
  styleUrls: ['./purchases-by-service-graph.component.css']
})
export class PurchasesByServiceGraphComponent implements OnInit {

  //define controls
  purchases: any;
  data: any;
  itemCount: string[];
  labels: string [];

  constructor(private invoiceService: InvoiceService) {
    this.purchases = {};
    this.data = {};
    this.itemCount = [];
    this.labels = [];

    this.invoiceService.findPurchasesByServiceGraph().subscribe({
      next: (res) => {
        this.purchases = res.data;

        console.log(this.purchases)

        //splits services and item count
        for (const item of this.purchases)  {
          console.log('Item object')
          console.log(item._id)

          let title = item._id.title;
          let count = item.count;

          this.labels.push(title);
          this.itemCount.push(count);
        }

        //builds object literal for graph
        this.data = {
          labels: this.labels,
          datasets: [
            {
              backgroundColor: [
                '#F1E8B8',
                '#F9E784',
                '#E58F65',
                '#D05353',
                '#fcba03',
                'a17c16',
                '7d6729'
              ],
              hoverBackgroundColor: [
                '#F1E8B8',
                '#F9E784',
                '#E58F65',
                '#D05353',
                '#fcba03',
                'a17c16',
                '7d6729'
              ],
              data: this.itemCount
            },
          ]
        };

        console.log('Data object');
        console.log(this.data);
      },
      error: (e) => {
        console.log(e)
      }
    })
   }

  ngOnInit(): void {
  }

}
