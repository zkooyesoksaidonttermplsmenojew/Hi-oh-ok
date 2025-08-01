
from flask import Flask, render_template, request, jsonify
import json
import os
from datetime import datetime

app = Flask(__name__)

def load_reviews():
    if os.path.exists('reviews.json'):
        with open('reviews.json', 'r') as f:
            return json.load(f)
    return []

def save_reviews(reviews):
    with open('reviews.json', 'w') as f:
        json.dump(reviews, f, indent=2)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/faq')
def faq():
    return render_template('faq.html')



@app.route('/reviews')
def reviews():
    reviews_data = load_reviews()
    return render_template('reviews.html', reviews=reviews_data)

@app.route('/products')
def products():
    return render_template('products.html')

@app.route('/submit_review', methods=['POST'])
def submit_review():
    data = request.json
    reviews_data = load_reviews()
    
    new_review = {
        'displayName': data['displayName'],
        'rating': int(data['rating']),
        'reviewText': data['reviewText'],
        'timestamp': datetime.now().isoformat()
    }
    
    reviews_data.insert(0, new_review)  # Add to beginning
    save_reviews(reviews_data)
    
    return jsonify({'success': True})

if __name__ == '__main__':
    import os
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
