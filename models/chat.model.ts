import { ChatInterface } from "../interfaces/chat.interface";

class Chat {
  chat: ChatInterface;
  constructor(chat: ChatInterface) {
    this.chat = chat;
  }
}

export default Chat;
