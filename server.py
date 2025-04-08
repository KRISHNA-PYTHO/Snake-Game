from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

high_scores = []

@app.route('/api/scores/', methods=['GET', 'POST'])  # Added trailing slash
def handle_scores():
    if request.method == 'POST':
        score_data = request.json
        high_scores.append(score_data)
        high_scores.sort(key=lambda x: x['score'], reverse=True)
        high_scores = high_scores[:10]  # Keep only top 10 scores
        return jsonify({'message': 'Score saved successfully'})
    else:
        return jsonify(high_scores)

if __name__ == '__main__':
    app.run(debug=True)