from flask import Flask, request, jsonify, session
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
import os
from dotenv import load_dotenv
from models import Job
import workos
from datetime import datetime

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)

# MongoDB connection
client = MongoClient(os.getenv('MONGO_URI'))
db = client.get_default_database()
jobs_collection = db.jobs
users_collection = db.users

# Initialize WorkOS client
workos.api_key = os.getenv('WORKOS_API_KEY')
workos.client_id = os.getenv('WORKOS_CLIENT_ID')
workos.base_api_url = 'https://api.workos.com'

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

@app.route("/api/auth/login", methods=['GET'])
def login():
    # Get the client ID from environment variables
    client_id = os.getenv('WORKOS_CLIENT_ID')
    
    # Get the redirect URI from environment variables
    redirect_uri = os.getenv('WORKOS_REDIRECT_URI')
    
    # Check if this is an employer login
    is_employer = request.args.get('type') == 'employer'
    
    # Generate the authorization URL
    auth_params = {
        'client_id': client_id,
        'redirect_uri': redirect_uri,
        'state': 'random-state-string'  # In production, use a secure random string
    }
    
    # Only include organization options for employers
    if is_employer:
        auth_params['organization_options'] = {
            'type': 'employer'
        }
    
    authorization_url = workos.client.user_management.get_authorization_url(auth_params)
    
    return jsonify({'authorization_url': authorization_url})

@app.route("/api/auth/callback")
def auth_callback():
    try:
        # Get the code from the callback
        code = request.args.get('code')
        
        # Exchange the code for a user
        user = workos.client.user_management.authenticate_with_code({
            'client_id': os.getenv('WORKOS_CLIENT_ID'),
            'code': code,
        })
        
        # Determine user type based on organization
        is_employer = user.organization_id is not None
        
        # Store user info in MongoDB if not exists
        user_data = {
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'workos_id': user.id,
            'user_type': 'employer' if is_employer else 'job_seeker',
            'created_at': datetime.utcnow(),
            'profile_completed': False
        }
        
        # Add organization data for employers
        if is_employer:
            user_data.update({
                'organization_id': user.organization_id,
                'organization_name': user.organization_name,
                'company_data': {
                    'logo': None,
                    'industry_type': None,
                    'company_size': None,
                    'description': None,
                    'website': None,
                    'locations': [],
                    'primary_contact': None
                }
            })
        else:
            # Add job seeker specific fields
            user_data.update({
                'resume': None,
                'skills': [],
                'preferred_job_types': [],
                'preferred_locations': [],
                'experience_level': None,
                'desired_salary_range': None,
                'job_search_preferences': {
                    'alert_frequency': 'daily',
                    'job_types': [],
                    'locations': [],
                    'remote_preference': None
                }
            })
        
        # Update or insert user data
        users_collection.update_one(
            {'workos_id': user.id},
            {'$set': user_data},
            upsert=True
        )
        
        # Store user ID in session
        session['user_id'] = str(user.id)
        
        return jsonify({'success': True, 'user': user_data})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route("/api/auth/logout", methods=['POST'])
def logout():
    session.clear()
    return jsonify({'success': True})

@app.route("/api/jobs", methods=['DELETE'])
@require_auth
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
@require_auth
def get_jobs():
    search = request.args.get('search', '')
    user = get_user_from_session()
    
    query = {
        'user_id': str(user['_id']),  # Only get user's jobs
        'title': {'$regex': search, '$options': 'i'} if search else {'$exists': True}
    }
    
    jobs = list(jobs_collection.find(
        query,
        limit=5,
        sort=[('created_at', -1)]
    ))
    
    # Convert ObjectId to string for JSON serialization
    for job in jobs:
        job['_id'] = str(job['_id'])
    
    return jsonify(jobs)

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

if __name__ == '__main__':
    app.run(port=5328, debug=True)