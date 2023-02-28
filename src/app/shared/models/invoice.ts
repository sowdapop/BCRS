/**
 * Title:  Bob's Computer Repair Shop
 * Authors: Danial Purselley, William Watlington, Kayla McDanel
 * Date: 25 Feb 2023
 * Description: A web application for a computer repair shop
 */

//construction of invoice functionality
//imports line item details
import { LineItem } from "./line-item.interface";

//creates invoice details
export class Invoice {
    private username: string;
    private lineItems: LineItem[]
    private orderDate: string;
    private LABOR_RATE: number = 65;

    partsAmount: number;
    laborHours: number;

    //adds invoice details
    constructor(username?: string, partsAmount?: number, laborHours?: number) {
        this.username = username || '';
        this.partsAmount = partsAmount || 0;
        this.laborHours = laborHours || 0;
        this.orderDate = new Date().toLocaleDateString()
        this.lineItems = [];
    }

    //functions to call information to invoice form

    getUsername(): string{
        return this.username;
    }

    setLineItems(lineItems: LineItem[]): void {
        this.lineItems = lineItems;
    }

    getLineItems(): LineItem[] {
        return this.lineItems;
    }

    getLineItemTotal(): number {
        let total: number = 0;

        for (let lineItem of this.lineItems) {
            total += lineItem.price;
        }

        return Number(total);
    }

    getLaborAmount(): number {
        return Number(this.laborHours) * Number(this.LABOR_RATE);
    }

    getOrderDate(): string {
        return this.orderDate;
    }

    getTotal(): number {
        return Number(this.partsAmount) + Number(this.getLaborAmount()) + Number(this.getLineItemTotal());
    }

    clear() {
        this.partsAmount = 0;
        this.laborHours = 0;
        this.lineItems = [];
    }
}