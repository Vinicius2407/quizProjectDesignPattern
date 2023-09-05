from flask import Blueprint, jsonify, request
from .models import Question, loadQuestions

quiz_Blueprint = Blueprint('quiz', __name__)

questions = loadQuestions("data/perguntas.json")

@quiz_Blueprint.route('/quiz', methods=['GET'])
def get_quiz():
    questionsData = [
        {
            "id": q.id,
            "question": q.question,
            "options": q.options
        } for q in questions
    ]
    return jsonify(questionsData)