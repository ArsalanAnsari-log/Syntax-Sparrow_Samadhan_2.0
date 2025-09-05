from flask import Flask, render_template, request, session, redirect, url_for
from flask_socketio import SocketIO, emit
from flask_session import Session

app = Flask(__name__)
app.secret_key = 'secret!'
app.config['SESSION_TYPE'] = 'filesystem'
Session(app)

socketio = SocketIO(app, cors_allowed_origins="*")

# Dummy user database
users_db = {
    "Arsalan": "12345678",
    "Vansh": "12345678",
    "Kamil": "12345678"
}

# In-memory user tracking
online_users = {}
sid_to_username = {}

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
    username = sid_to_username.pop(sid, None)
    if username:
        online_users.pop(username, None)
        emit('online_users', list(online_users.keys()), broadcast=True)

@socketio.on('call')
def handle_call(data):
    target = data['target']
    if target in online_users:
        emit('incoming_call', {'from': data['from'], 'offer': data['offer']}, room=online_users[target])

@socketio.on('signal')
def handle_signal(data):
    target = data['target']
    if target in online_users:
        emit('signal', data, room=online_users[target])

@socketio.on('reject_call')
def handle_reject_call(data):
    target = data['target']
    if target in online_users:
        emit('call_rejected', {'from': data['from']}, room=online_users[target])

@socketio.on('end_call')
def handle_end_call(data):
    target = data['target']
    if target in online_users:
        emit('call_ended', {'from': data['from']}, room=online_users[target])

@socketio.on('message')
def handle_message(data):
    target = data['target']
    if target in online_users:
        emit('message', data, room=online_users[target])

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000, debug=True)
