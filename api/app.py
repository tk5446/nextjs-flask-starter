from flask import Flask
from flask_cors import CORS
from index import app  # Importing 'api' blueprint from index.py

app = Flask(__name__)

# App config
app.config["DEBUG"] = True

# Enable CORS for this app (you may want to restrict to specific origins)
CORS(app, resources={r"/api/*": {"origins": ["http://localhost:3002"]}}, supports_credentials=True)

# Register the 'api' Blueprint with a URL prefix '/api'
app.register_blueprint(api, url_prefix='/api')

# Run the app
if __name__ == '__main__':
    app.run(port=5328, debug=True)
