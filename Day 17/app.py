from flask import Flask, render_template, request, session, redirect, url_for, jsonify
from flask_socketio import SocketIO, emit
from flask_session import Session
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask(__name__)
app.secret_key = 'secret!'
app.config['SESSION_TYPE'] = 'filesystem'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///chat.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

Session(app)
db = SQLAlchemy(app)
socketio = SocketIO(app, cors_allowed_origins="*")

# Dummy users
users_db = {
    "Arsalan": "12345678",
    "Vansh": "12345678",
    "Kamil": "12345678"
}

# Online tracking
online_users = {}
sid_to_username = {}

# Chat model
class Chat(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    sender = db.Column(db.String(80), nullable=False)
    receiver = db.Column(db.String(80), nullable=False)
    message = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

@app.route('/', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        if username in users_db and users_db[username] == password:
            session['username'] = username
            return redirect(url_for('home'))
        return render_template('login.html', error="Invalid credentials")
    return render_template('login.html')

@app.route('/home')
def home():
    if 'username' not in session:
        return redirect(url_for('login'))
    return render_template('index.html', username=session['username'], contacts=list(users_db.keys()))

@app.route('/history/<contact>')
def get_chat_history(contact):
    if 'username' not in session:
        return jsonify([])
    me = session['username']
    messages = Chat.query.filter(
        ((Chat.sender == me) & (Chat.receiver == contact)) |
        ((Chat.sender == contact) & (Chat.receiver == me))
    ).order_by(Chat.timestamp).all()
    return jsonify([
        {
            'sender': msg.sender,
            'text': msg.message,
            'timestamp': msg.timestamp.strftime("%H:%M")
        }
        for msg in messages
    ])

@socketio.on('connect')
def on_connect():
    username = session.get('username')
    if username:
        online_users[username] = request.sid
        sid_to_username[request.sid] = username
        emit('online_users', list(online_users.keys()), broadcast=True)

@socketio.on('disconnect')
def on_disconnect():
    sid = request.sid
    username = sid_to_username.get(sid)
    if username:
        online_users.pop(username, None)
        sid_to_username.pop(sid, None)
        emit('online_users', list(online_users.keys()), broadcast=True)

@socketio.on('call')
def handle_call(data):
    target = data['target']
    if target in online_users:
        emit('incoming_call', {'from': data['from'], 'offer': data['offer']}, room=online_users[target])

@socketio.on('signal')
def handle_signal(data):
    if data['target'] in online_users:
        emit('signal', data, room=online_users[data['target']])

@socketio.on('reject_call')
def handle_reject(data):
    if data['target'] in online_users:
        emit('call_rejected', {'from': data['from']}, room=online_users[data['target']])

@socketio.on('end_call')
def handle_end(data):
    if data['target'] in online_users:
        emit('call_ended', {'from': data['from']}, room=online_users[data['target']])

@socketio.on('message')
def handle_message(data):
    sender = data['from']
    receiver = data['target']
    text = data['text']
    db.session.add(Chat(sender=sender, receiver=receiver, message=text))
    db.session.commit()
    if receiver in online_users:
        emit('message', data, room=online_users[receiver])

if __name__ == '__main__':
    
    with app.app_context():
        db.create_all()
    socketio.run(app, host='0.0.0.0', port=5000, debug=True)
