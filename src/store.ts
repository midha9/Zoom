interface Chat {
  name: string;
  userID: string;
  message: string;
  upVotes: string[];
  chatId: string;
}
interface Room {
  roomID: string;
  chats: Chat[];
}
type UserID = string;

interface Store {
  initRoom(roomID: string): void;
  getChats(roomID: string, limit: number, offset: number): Chat[];
  addChat(roomID: string, userID: string, name: string, message: string): void;
  upChat(roomID: string, chatID: string, userID: string): void;
}

export class InMemoryStore implements Store {
  private store: Map<string, Room> = new Map();
  private globalChatId: number = 0;

  initRoom(roomID: string): void {
    this.store.set(roomID, { roomID, chats: [] });
  }

  getChats(roomID: string, limit: number, offset: number): Chat[] {
    const room = this.store.get(roomID);
    if (!room) return [];
    const startIndex = offset;
    const endIndex = offset + limit;
    const chats = room.chats
      .slice()
      .reverse()
      .slice(startIndex, endIndex)
      .reverse();

    return chats;
  }

  addChat(roomID: string, userID: string, name: string, message: string): void {
    const room = this.store.get(roomID);
    if (!room) return;
    const chatId = (this.globalChatId++).toString();
    const newChat: Chat = {
      chatId,
      userID,
      name,
      message,
      upVotes: [],
    };
    room.chats.push(newChat);
  }

  upChat(roomID: string, chatID: string, userID: string): void {
    const room = this.store.get(roomID);
    if (!room) return;

    const chat = room.chats.find((chat) => chat.chatId === chatID);
    if (chat) {
      if (!chat.upVotes.includes(userID)) {
        chat.upVotes.push(userID);
      }
    }
  }
}
