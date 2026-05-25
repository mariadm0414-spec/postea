import fs from 'fs';
import path from 'path';

// Define the file path for the JSON local database
const DB_FILE_PATH = path.join(process.cwd(), 'app', 'lib', 'local_db.json');

// Interface definitions
export interface LocalAuthorizedUser {
    email: string;
    full_name: string;
    status: string;
    avatar_url?: string;
}

export interface LocalUser {
    id: string;
    email: string;
    password?: string;
    full_name: string;
}

export interface LocalTeamChat {
    id: string;
    title: string;
    agents: string[];
    updated_at: string;
}

export interface LocalTeamMessage {
    id: string;
    chat_id: string;
    content: string;
    sender_role: string;
    created_at: string;
}

interface LocalDatabase {
    authorized_users: LocalAuthorizedUser[];
    users: LocalUser[];
    team_chats: LocalTeamChat[];
    team_messages: LocalTeamMessage[];
}

// Initial state of the database
const INITIAL_DB: LocalDatabase = {
    authorized_users: [
        { email: "test@clickads.com", full_name: "Usuario Demo", status: "active" }
    ],
    users: [
        { id: "demo-user-id", email: "test@clickads.com", password: "password123", full_name: "Usuario Demo" }
    ],
    team_chats: [],
    team_messages: []
};

// Safe DB reader/writer
export class LocalDbHelper {
    private static initDb() {
        try {
            const dir = path.dirname(DB_FILE_PATH);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            if (!fs.existsSync(DB_FILE_PATH)) {
                fs.writeFileSync(DB_FILE_PATH, JSON.stringify(INITIAL_DB, null, 4), 'utf-8');
            }
        } catch (e) {
            console.error("Failed to initialize local JSON DB:", e);
        }
    }

    private static getDb(): LocalDatabase {
        this.initDb();
        try {
            if (fs.existsSync(DB_FILE_PATH)) {
                const content = fs.readFileSync(DB_FILE_PATH, 'utf-8');
                return JSON.parse(content);
            }
        } catch (e) {
            console.error("Failed to read local JSON DB, returning initial DB:", e);
        }
        return { ...INITIAL_DB };
    }

    private static saveDb(db: LocalDatabase) {
        this.initDb();
        try {
            fs.writeFileSync(DB_FILE_PATH, JSON.stringify(db, null, 4), 'utf-8');
        } catch (e) {
            console.error("Failed to write local JSON DB:", e);
        }
    }

    // --- Authorized Users Methods ---
    public static getAuthorizedUser(email: string): LocalAuthorizedUser | null {
        const db = this.getDb();
        const cleanEmail = email.trim().toLowerCase();
        return db.authorized_users.find(u => u.email.toLowerCase() === cleanEmail) || null;
    }

    public static addAuthorizedUser(email: string, fullName: string, status: string = 'active'): LocalAuthorizedUser {
        const db = this.getDb();
        const cleanEmail = email.trim().toLowerCase();
        const existing = db.authorized_users.find(u => u.email.toLowerCase() === cleanEmail);
        
        if (existing) {
            existing.full_name = fullName;
            existing.status = status;
            this.saveDb(db);
            return existing;
        }

        const newUser: LocalAuthorizedUser = { email: cleanEmail, full_name: fullName, status };
        db.authorized_users.push(newUser);
        this.saveDb(db);
        return newUser;
    }

    public static updateAuthorizedUserAvatar(email: string, avatarUrl: string) {
        const db = this.getDb();
        const cleanEmail = email.trim().toLowerCase();
        const existing = db.authorized_users.find(u => u.email.toLowerCase() === cleanEmail);
        if (existing) {
            existing.avatar_url = avatarUrl;
            this.saveDb(db);
        }
    }

    // --- Users (Auth Credentials) Methods ---
    public static getUser(email: string): LocalUser | null {
        const db = this.getDb();
        const cleanEmail = email.trim().toLowerCase();
        return db.users.find(u => u.email.toLowerCase() === cleanEmail) || null;
    }

    public static createUser(email: string, passwordHashOrPlain: string, fullName: string): LocalUser {
        const db = this.getDb();
        const cleanEmail = email.trim().toLowerCase();
        
        // Auto-authorize any user who signs up
        this.addAuthorizedUser(cleanEmail, fullName);

        const existing = db.users.find(u => u.email.toLowerCase() === cleanEmail);
        if (existing) {
            existing.password = passwordHashOrPlain;
            existing.full_name = fullName;
            this.saveDb(db);
            return existing;
        }

        const newUser: LocalUser = {
            id: 'usr_' + Math.random().toString(36).substr(2, 9),
            email: cleanEmail,
            password: passwordHashOrPlain,
            full_name: fullName
        };
        db.users.push(newUser);
        this.saveDb(db);
        return newUser;
    }

    // --- Team Chats Methods ---
    public static getTeamChats(): LocalTeamChat[] {
        const db = this.getDb();
        return db.team_chats || [];
    }

    public static createTeamChat(title: string, agents: string[]): LocalTeamChat {
        const db = this.getDb();
        const newChat: LocalTeamChat = {
            id: 'chat_' + Math.random().toString(36).substr(2, 9),
            title,
            agents,
            updated_at: new Date().toISOString()
        };
        if (!db.team_chats) db.team_chats = [];
        db.team_chats.push(newChat);
        this.saveDb(db);
        return newChat;
    }

    // --- Team Messages Methods ---
    public static getTeamMessages(chatId: string): LocalTeamMessage[] {
        const db = this.getDb();
        if (!db.team_messages) return [];
        return db.team_messages.filter(m => m.chat_id === chatId);
    }

    public static createTeamMessage(chatId: string, content: string, senderRole: string): LocalTeamMessage {
        const db = this.getDb();
        const newMessage: LocalTeamMessage = {
            id: 'msg_' + Math.random().toString(36).substr(2, 9),
            chat_id: chatId,
            content,
            sender_role: senderRole,
            created_at: new Date().toISOString()
        };
        if (!db.team_messages) db.team_messages = [];
        db.team_messages.push(newMessage);

        // Update the updated_at timestamp of the associated chat
        if (db.team_chats) {
            const chat = db.team_chats.find(c => c.id === chatId);
            if (chat) {
                chat.updated_at = new Date().toISOString();
            }
        }
        
        this.saveDb(db);
        return newMessage;
    }
}
