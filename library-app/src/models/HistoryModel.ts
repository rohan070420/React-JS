class HistoryModel {
  id: number;
  title: string;
  author?: string;
  description?: string;
  img?: string;
  checkoutDate: string;
  returnedDate: string;

  constructor(
    id: number,
    title: string,
    checkoutDate: string,
    returnedDate: string,
    author?: string,
    description?: string,
    img?: string
  ) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.description = description;
    this.img = img;
    this.checkoutDate = checkoutDate;
    this.returnedDate = returnedDate;
  }
}

export default HistoryModel;
