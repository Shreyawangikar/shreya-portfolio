"""
Database module for SQLite chat log storage.
Handles database initialization and CRUD operations for chat logs.
"""

import sqlite3
import os
from datetime import datetime
from contextlib import contextmanager

# Database file path (in backend folder)
DATABASE_PATH = os.path.join(os.path.dirname(__file__), 'chat_logs.db')


def get_connection():
    """
    Create a new database connection.
    Returns a connection with row factory for dict-like access.
    """
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    return conn


@contextmanager
def get_db():
    """
    Context manager for database connections.
    Ensures proper connection cleanup after use.
    """
    conn = get_connection()
    try:
        yield conn
        conn.commit()
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        conn.close()


def init_database():
    """
    Initialize the database and create tables if they don't exist.
    Creates the chat_logs table for storing conversation history.
    """
    with get_db() as conn:
        cursor = conn.cursor()
        
        # Create chat_logs table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS chat_logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_message TEXT NOT NULL,
                assistant_reply TEXT NOT NULL,
                ip_address TEXT,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Create index for faster timestamp queries
        cursor.execute('''
            CREATE INDEX IF NOT EXISTS idx_chat_logs_timestamp 
            ON chat_logs(timestamp)
        ''')
        
        print("[OK] Database initialized successfully")


def save_chat_log(user_message: str, assistant_reply: str, ip_address: str = None) -> int:
    """
    Save a chat exchange to the database.
    
    Args:
        user_message: The user's input message
        assistant_reply: The AI assistant's response
        ip_address: Optional IP address for analytics
    
    Returns:
        The ID of the inserted record
    """
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO chat_logs (user_message, assistant_reply, ip_address, timestamp)
            VALUES (?, ?, ?, ?)
        ''', (user_message, assistant_reply, ip_address, datetime.now()))
        
        return cursor.lastrowid


def get_chat_stats() -> dict:
    """
    Get statistics about chat usage.
    
    Returns:
        Dictionary with total_chats, unique_ips, and recent activity
    """
    with get_db() as conn:
        cursor = conn.cursor()
        
        # Total chat count
        cursor.execute('SELECT COUNT(*) as count FROM chat_logs')
        total_chats = cursor.fetchone()['count']
        
        # Unique IPs (visitors)
        cursor.execute('SELECT COUNT(DISTINCT ip_address) as count FROM chat_logs WHERE ip_address IS NOT NULL')
        unique_ips = cursor.fetchone()['count']
        
        # Chats in last 24 hours
        cursor.execute('''
            SELECT COUNT(*) as count FROM chat_logs 
            WHERE timestamp > datetime('now', '-24 hours')
        ''')
        recent_chats = cursor.fetchone()['count']
        
        return {
            'total_chats': total_chats,
            'unique_visitors': unique_ips,
            'chats_last_24h': recent_chats
        }


def get_recent_logs(limit: int = 50) -> list:
    """
    Get recent chat logs for review.
    
    Args:
        limit: Maximum number of logs to return
    
    Returns:
        List of chat log dictionaries
    """
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute('''
            SELECT id, user_message, assistant_reply, ip_address, timestamp
            FROM chat_logs
            ORDER BY timestamp DESC
            LIMIT ?
        ''', (limit,))
        
        return [dict(row) for row in cursor.fetchall()]


# Initialize database on module import
if __name__ == '__main__':
    init_database()
