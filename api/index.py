from flask import Blueprint, Flask, redirect, request, jsonify, session
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
import os
from dotenv import load_dotenv
from models import Job
from datetime import datetime
from flask_bcrypt import Bcrypt
from flask_jwt_extended import jwt_required, create_access_token
from google_auth_oauthlib.flow import Flow
import requests

load_dotenv()

# Define the api Blueprint here
# api = Blueprint('api', __name__)

app = Flask(__name__)
# CORS(app, resources={r"/api/*": {"origins": ["http://localhost:3002"]}}, supports_credentials=True)
CORS(app)

# MongoDB connection
client = MongoClient(os.getenv('MONGO_URI'))
db = client.get_default_database()
jobs_collection = db.jobs
users_collection = db.users
organizations_collection = db.organizations

bcrypt = Bcrypt(app)

@app.route('/create-company', methods=['POST'])
@jwt_required()
def create_company():
    # Get data from request
    company_data = request.json
    company_name = company_data.get('companyName')
    user_id = session.get('user_id')

    if not company_name or not user_id:
        return jsonify({'error': 'Missing companyName or userId'}), 400

    # Check if the company already exists
    existing_company = organizations_collection.find_one({'name': company_name})
    if existing_company:
        return jsonify({'error': 'Company already exists'}), 409

    # Create a new company document
    new_company = {
        'name': company_name,
        'created_by': user_id,
        'created_at': datetime.utcnow()
    }

    # Insert the new company into the database
    organizations_collection.insert_one(new_company)

    return jsonify({'message': 'Company created successfully'}), 201

def get_user_from_session():
    """Get user information from session"""
    user_id = session.get('user_id')
    if not user_id:
        return None
    return users_collection.find_one({'_id': ObjectId(user_id)})

def require_auth(f):
    from functools import wraps
    @wraps(f)
    def wrapper(*args, **kwargs):
        user = get_user_from_session()
        if not user:
            return jsonify({'error': 'Unauthorized'}), 401
        return f(*args, **kwargs)
    return wrapper


@app.route('/api/auth/google', methods=['GET'])
def google_auth():
    # Initialize the Google OAuth flow
    flow = Flow.from_client_secrets_file(
        'path_to_client_secrets.json',  # Ensure this path is correct
        scopes=['https://www.googleapis.com/auth/userinfo.email'],
        redirect_uri=os.getenv('GOOGLE_REDIRECT_URI')
    )

    # Generate the authorization URL
    authorization_url, state = flow.authorization_url(
        access_type='offline',
        include_granted_scopes='true'
    )

    return jsonify({'authorization_url': authorization_url})

@app.route("/api/auth/google/callback")
def google_auth_callback():
    # Get the authorization response
    flow = Flow.from_client_secrets_file(
        'path_to_client_secrets.json',
        scopes=['https://www.googleapis.com/auth/userinfo.email'],
        redirect_uri=os.getenv('GOOGLE_REDIRECT_URI')
    )

    # Use the authorization response to fetch the token
    flow.fetch_token(authorization_response=request.url)

    # Get the credentials
    credentials = flow.credentials

    # Use the credentials to access the Google API
    session = requests.Session()
    session.headers.update({'Authorization': f'Bearer {credentials.token}'})

    # Fetch user info
    user_info_response = session.get('https://www.googleapis.com/oauth2/v1/userinfo')
    user_info = user_info_response.json()

    # Check if user exists in MongoDB
    user = users_collection.find_one({'email': user_info['email']})
    if not user:
        # If not, create a new user
        new_user = {
            'email': user_info['email'],
            'name': user_info.get('name'),
            'picture': user_info.get('picture'),
            'created_at': datetime.utcnow()
        }
        users_collection.insert_one(new_user)

    # Create a session or JWT for the user
    access_token = create_access_token(identity=user_info['email'])

    # Redirect to the frontend with the token
    return redirect(f"{os.getenv('FRONTEND_URL')}/?token={access_token}")

@app.route("/api/auth/logout", methods=['POST'])
def logout():
    session.clear()
    return jsonify({'success': True})

@app.route("/api/jobs", methods=['DELETE'])
@jwt_required()
def delete_job():
    job_id = request.args.get('id')
    if not job_id:
        return jsonify({'error': 'No job ID provided'}), 400
    
    user = get_user_from_session()
    result = jobs_collection.delete_one({
        '_id': ObjectId(job_id),
        'user_id': str(user['_id'])  # Only delete if owned by user
    })
    return jsonify({'deleted': result.deleted_count > 0})

@app.route("/api/jobs", methods=['GET'])
def get_jobs():
    # Fetch all jobs from MongoDB without any filters
    jobs = list(jobs_collection.find({}, {'_id': 0}))  # No filters, exclude MongoDB's _id field
    
    return jsonify({
        'jobs': jobs
    })

# def get_jobs():
#     search = request.args.get('search', '')
#     user = get_user_from_session()
    
#     query = {
#         'user_id': str(user['_id']),  # Only get user's jobs
#         'title': {'$regex': search, '$options': 'i'} if search else {'$exists': True}
#     }
    
#     jobs = list(jobs_collection.find(
#         query,
#         limit=5,
#         sort=[('created_at', -1)]
#     ))
    
#     # Convert ObjectId to string for JSON serialization
#     for job in jobs:
#         job['_id'] = str(job['_id'])
    
#     return jsonify(jobs)

@app.route("/api/auth/user")
@require_auth
def get_current_user():
    user = get_user_from_session()
    if not user:
        return jsonify({'error': 'Not authenticated'}), 401
    
    # Convert ObjectId to string for JSON serialization
    user['_id'] = str(user['_id'])
    return jsonify(user)

@app.route("/api/python")
def hello_world():
    return jsonify({"message": "Hello from Flask Backend!"})

@app.route('/api/register', methods=['POST'])
def register_user():
    # Get user data from request
    user_data = request.json
    email = user_data.get('email')
    password = user_data.get('password')

    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400

    # Check if the user already exists
    existing_user = users_collection.find_one({'email': email})
    if existing_user:
        return jsonify({'error': 'User already exists'}), 409

    # Hash the password
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    # Create a new user document
    new_user = {
        'email': email,
        'password': hashed_password,
        'created_at': datetime.utcnow()
    }

    # Insert the new user into the database
    users_collection.insert_one(new_user)

    return jsonify({'message': 'User registered successfully'}), 201

if __name__ == '__main__':
    app.run(port=5328, debug=True)