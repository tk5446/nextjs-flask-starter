from flask import Blueprint, Flask, redirect, request, jsonify, session
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
import os
from dotenv import load_dotenv
from models import Job
# import workos
from datetime import datetime


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
# Initialize WorkOS client
# workos.api_key = os.getenv('WORKOS_API_KEY')
# workos.client_id = os.getenv('WORKOS_CLIENT_ID')


from workos import WorkOSClient

workos_client = WorkOSClient(
    api_key=os.getenv('WORKOS_API_KEY'),
    client_id=os.getenv('WORKOS_CLIENT_ID')
)
workos_client.base_api_url = 'https://api.workos.com'


@app.route('/create-company', methods=['POST'])
def create_company():
    # Get data from request
    company_name = request.json.get('companyName')
    user_id = request.json.get('userId')

    if not company_name or not user_id:
        return jsonify({"error": "Missing companyName or userId"}), 400

    try:
        # Create the organization (company)
        org = workos.organizations.create_organization(name=company_name)

        # Add the user to the organization with an admin role
        workos.user_management.create_organization_membership(
            user_id=user_id,
            organization_id=org['id'],
            role_slug='admin'
        )

        # After successful operation, redirect to a new page (e.g., '/new-listing')
        return redirect('/new-listing')

    except Exception as e:
        return jsonify({"error": str(e)}), 500

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
    # Get the client ID and redirect URI from environment variables
    client_id = os.getenv('WORKOS_CLIENT_ID')
    redirect_uri = os.getenv('WORKOS_REDIRECT_URI')

    # Get user type (either "employer" or "job_seeker")
    user_type = request.args.get('type')
    user_email = request.args.get("email")

    if not user_type:
        return jsonify({'error': 'User type is required'}), 400

    if user_type == "job_seeker":
        # Job seekers use standard authentication, no `connection_id`
        authorization_url = workos_client.user_management.get_authorization_url(
            client_id=client_id,
            redirect_uri=redirect_uri,
            state='random-state-string'
        )
        return jsonify({'authorization_url': authorization_url})

    elif user_type == "employer":
        # Employers require an email to check for existing org
        if not user_email:
            return jsonify({'error': 'Employer email is required'}), 400

        email_domain = user_email.split('@')[-1]

        # Check if this employer's org exists in the database
        employer_org = organizations_collection.find_one({'domain': email_domain})

        if not employer_org:
            # 🚀 Redirect to WorkOS SSO login/signup flow
            return jsonify({
                'redirect_url': workos_client.sso.get_authorization_url(
                    client_id=client_id,
                    redirect_uri=redirect_uri,
                    state='random-state-string',
                    organization_options={
                        'type': 'employer'
                    }
                )
            })

        # Employer has an org, proceed with SSO login
        authorization_url = workos_client.user_management.get_authorization_url(
            connection_id=employer_org.connection_id,
            redirect_uri=redirect_uri,
            state='random-state-string'
        )
        return jsonify({'authorization_url': authorization_url})

    else:
        return jsonify({'error': 'Invalid user type'}), 400


@app.route("/api/auth/callback")
def auth_callback():
    try:
        # Get the code from the callback
        code = request.args.get('code')

        print('auth_callback :: Received code:', code);
        print('auth_callback :: WORKOS_CLIENT_ID :: ', os.getenv('WORKOS_CLIENT_ID'));
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

if __name__ == '__main__':
    app.run(port=5328, debug=True)