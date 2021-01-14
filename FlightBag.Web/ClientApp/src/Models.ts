﻿export interface BagItem {
    title: string;
    type: string;
    data: any;
}

export interface Bag {
    id: string;
    name: string;

    items: BagItem[];
}