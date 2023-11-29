from flask import request, jsonify
import random
import json
from enum import Enum

from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

class Question:
    def __init__(self, id, pergunta, opcoes, resposta, tema, dificuldade, peso=1):
        self.id = id
        self.question = pergunta
        self.options = opcoes
        self.answer = resposta
        self.theme = tema
        self.difficulty = dificuldade
        self.weight = peso

class QuestionFactory:
    @staticmethod
    def create(q) -> Question:
        return Question(
            q["id"],
            q["pergunta"],
            q["opcoes"],
            q["resposta"],
            q["tema"],
            StrategyEnum(q["dificuldade"]),
            q.get("peso", 2)
        )

class ScoreStrategy:
    def __init__(self, dificuldade):
        self.acertos = 0
        self.dificuldade = dificuldade
    def computeScore(self, quiz):
        pass

class EasyScoreStrategy(ScoreStrategy):
    def computeScore(self, quiz):
        self.acertos = round(quiz * 1.5)

class MediumScoreStrategy(ScoreStrategy):
      def computeScore(self, quiz):
         self.acertos = round(quiz * 2)

class HardScoreStrategy(ScoreStrategy):
      def computeScore(self, quiz):
         self.acertos = round(quiz * 2.5)

class DifficultyStrategy:
    def selectQuestions(self):
        pass

class WeightsOfDifficulties(DifficultyStrategy):
    def __init__(self, difficulty, weight):
        self.difficulty = difficulty
        self.weight = weight

    def selectQuestions(self, questions):
        selected_questions = []
        for question in questions:
            if question.difficulty == self.difficulty:
                question.weight += self.weight
                selected_questions.append(question)
                random.shuffle(selected_questions)

        return selected_questions

class StrategyEnum(Enum):
    EASY = 1
    MEDIUM = 2
    HARD = 3

def weightOfDifficulty(difficulty):
    if difficulty == StrategyEnum.EASY:
        return WeightsOfDifficulties(difficulty, 2)
    elif difficulty == StrategyEnum.MEDIUM:
        return WeightsOfDifficulties(difficulty, 4)
    elif difficulty == StrategyEnum.HARD:
        return WeightsOfDifficulties(difficulty, 6)

class Quiz:
    _instance = None

    def __init__(self):
        self.result = 0
        self.questions = 0
        self.acceptedQuestions = 0
        self.vector = []
        self.difficultyStrategy = None

    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def createQuiz(self, filename):
        with open(filename, "r", encoding="utf-8-sig") as f:
            data = json.load(f)

        questions = data
        self.vector = [QuestionFactory.create(q) for q in questions]

        selectedQuestions = self.difficultyStrategy.selectQuestions(self.vector)
        self.vector = selectedQuestions

    def rateResponse(self, response):
        if response == self.vector[self.questions].answer:
            self.acceptedQuestions += 1

        self.questions += 1

        if self.questions >= len(self.vector):
            return True
        return False

    def getNextQuestion(self):
        if self.questions >= len(self.vector):
            return None
        return self.vector[self.questions]

@app.route("/start-quiz/<difficulty>", methods=["GET"])
def startQuiz(difficulty):
    global quiz_instance
    global scoreStrategy

    try:
        scoreStrategy = None

        if difficulty == "1":
            scoreStrategy = EasyScoreStrategy(difficulty)
        elif difficulty == "2":
            scoreStrategy = MediumScoreStrategy(difficulty)
        elif difficulty == "3":
            scoreStrategy = HardScoreStrategy(difficulty)

        difficulty_enum = int(difficulty)
        difficulty = StrategyEnum(difficulty_enum)

        weighted_difficulty_strategy = weightOfDifficulty(difficulty)

        quiz_instance = Quiz()
        quiz_instance.difficultyStrategy = weighted_difficulty_strategy
        quiz_instance.createQuiz("../data/perguntas.json")

        return jsonify({"message": "Quiz started"})

    except ValueError:
        return jsonify({"error": "Unrecognized difficulty"})

@app.route("/get-question", methods=["GET"])
def getQuestion():
    global quiz_instance

    nextQuestion = quiz_instance.getNextQuestion()
    if nextQuestion is not None:
        return jsonify(
            {
                "message": "Next question",
                "next_question": {
                    "id": nextQuestion.id,
                    "question": nextQuestion.question,
                    "options": nextQuestion.options,
                    "theme": nextQuestion.theme,
                    "difficulty": nextQuestion.difficulty.value,
                },
            }
        )
    else:
        scoreStrategy.computeScore(quiz_instance.acceptedQuestions)
        dificuldadeEscolhida = ""
        if scoreStrategy.dificuldade == '1':
           dificuldadeEscolhida = "Fácil"
        elif scoreStrategy.dificuldade == '2':
           dificuldadeEscolhida = "Mediana"
        elif scoreStrategy.dificuldade == '3':
           dificuldadeEscolhida = "Difícil"
        return jsonify(
            {"message": "Quiz completed", "result": scoreStrategy.acertos, "correct_answers": str(quiz_instance.acceptedQuestions) + "/" + str(len(quiz_instance.vector)) + ". A dificuldade escolhida foi a " + str(dificuldadeEscolhida) + "."}
        )

@app.route("/submit-answer", methods=["POST"])
def submitAnswer():
    global quiz_instance
    data = request.get_json()
    user_ans = data.get("user_answer", "").upper()

    if user_ans != "":
        quiz_instance.rateResponse(user_ans)

    return jsonify({"message": "Answer submitted"})

@app.route("/restart-quiz", methods=["GET"])
def restartQuiz():
    global quiz_instance
    quiz_instance = None
    return jsonify({"message": "Quiz restarted"})

if __name__ == "__main__":
    app.run(debug=True)
