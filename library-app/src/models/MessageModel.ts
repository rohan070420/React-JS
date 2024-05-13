export class MessageModel {
  title: string;
  question: string;
  id?: number;
  response?: string;
  userEmail?: string;
  adminEmail?: string;
  closed?: boolean;

  constructor(
    title: string,
    question: string,
    id?: number,
    response?: string,
    userEmail?: string,
    adminEmail?: string,
    closed?: boolean
  ) {
    this.id = id;
    this.title = title;
    this.question = question;
    this.response = response;
    this.userEmail = userEmail;
    this.adminEmail = adminEmail;
    this.closed = closed;
  }
}
