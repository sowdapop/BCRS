/**
 * Title:  Bob's Computer Repair Shop
 * Authors: Danial Purselley, William Watlington, Kayla McDanel
 * Date: 25 Feb 2023
 * Description: A web application for a computer repair shop
 */

//creates and exports Product details

export interface Product {
    id: number;
    title: string;
    price: number;
    checked: Boolean;
}