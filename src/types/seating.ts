// src/types/seating.ts

export interface IPerson {
  name: string
  seatGroup: string
}

export interface ICategory {
  title: string
  count: number
  people: IPerson[]
}

export interface ISideData {
  category: ICategory[]
}

export interface ISeatingData {
  seats: {
    amy: ISideData
    albert: ISideData
  }
}

export interface ISearchResult extends IPerson {
  category: string
  sideName: string // '男方' or '女方'
}
