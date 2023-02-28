/**
 * Title:  Bob's Computer Repair Shop
 * Authors: Danial Purselley, William Watlington, Kayla McDanel
 * Date: 25 Feb 2023
 * Description: A web application for a computer repair shop
 */

import { Injectable } from '@angular/core';
import { Product } from '../shared/models/product.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  products: Product[];

  //creates products array
  constructor() {
    this.products = [
      {
        id: 100,
        title: 'Disk Clean-up',
        price: 49.99,
        checked: false
      },
      {
        id: 101,
        title: 'System Restore',
        price: 74.99,
        checked: false
      },
      {
        id: 102,
        title: 'Keyboard Re-Key',
        price: 29.99,
        checked: false
      },
      {
        id: 103,
        title: 'Malware Removal',
        price: 89.99,
        checked: false
      },
      {
        id: 104,
        title: 'Power Boost',
        price: 119.99,
        checked: false
      },
      {
        id: 105,
        title: 'Password Reset',
        price: 29.99,
        checked: false
      },
      {
        id: 106,
        title: 'Program Installation',
        price: 59.99,
        checked: false
      }
    ]
  }

//function to call products array
getProducts(): Product[] {
  return this.products;
}
   }
