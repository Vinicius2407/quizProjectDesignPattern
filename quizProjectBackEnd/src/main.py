from flask import request, jsonify
import random
import json
from enum import Enum

from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Resto do código do servidor


class Question:
    def __init__(self, id, pergunta, opcoes, resposta, tema, dificuldade, peso=1):
        self.id = id
        self.pergunta = pergunta
        self.opcoes = opcoes
        self.resposta = resposta
        self.tema = tema
        self.dificuldade = dificuldade
        self.peso = peso  # Adicionamos um campo para o peso

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
            q.get("peso", 2)  # Peso padrão é 2 se não estiver definido
        )

class DifficultyStrategy:
    def select_questions(self, questions):
        pass

class WeightedDifficultyStrategy(DifficultyStrategy):
    def __init__(self, difficulty, peso):
        self.difficulty = difficulty
        self.peso = peso

    def select_questions(self, questions):
        selected_questions = []
        for question in questions:
            if question.dificuldade == self.difficulty:
                question.peso += self.peso  # Multiplica o peso da pergunta
                selected_questions.append(question)  # Adiciona a pergunta com peso multiplicado
                random.shuffle(selected_questions)  # Embaralha as perguntas

        return selected_questions

class StrategyEnum(Enum):
    FACIL = 1
    MEDIO = 2
    DIFICIL = 3

# Nova função para obter a estratégia com peso
def get_weighted_difficulty_strategy(dificuldade):
    if dificuldade == StrategyEnum.FACIL:
        return WeightedDifficultyStrategy(dificuldade, 2)  # Dificuldade fácil tem peso 2
    elif dificuldade == StrategyEnum.MEDIO:
        return WeightedDifficultyStrategy(dificuldade, 4)  # Dificuldade média tem peso 4
    elif dificuldade == StrategyEnum.DIFICIL:
        return WeightedDifficultyStrategy(dificuldade, 6)  # Dificuldade difícil tem peso 6

class Quiz:
    _instance = None

    def __init__(self):
        self.resultado = 0
        self.questoes = 0
        self.questoes_acertadas = 0
        self.vetor = []
        self.difficulty_strategy = None

    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def criaQuiz(self, filename):
        with open(filename, "r", encoding="utf-8-sig") as f:
            data = json.load(f)

        questions = data
        self.vetor = [QuestionFactory.create(q) for q in questions]

        selected_questions = self.difficulty_strategy.select_questions(self.vetor)
        self.vetor = selected_questions
        print(self.vetor)

    def avaliar_resposta(self, resposta):
        if resposta == self.vetor[self.questoes].resposta:
            self.resultado += self.vetor[self.questoes].peso
            self.questoes_acertadas += 1
        self.questoes += 1
        if self.questoes >= len(self.vetor):
            return True  # O quiz está completo
        return False  # O quiz ainda não está completo

    def get_proxima_questao(self):
        if self.questoes >= len(self.vetor):
            return None
        return self.vetor[self.questoes]

@app.route("/start-quiz/<dificuldade>", methods=["GET"])
def start_quiz(dificuldade):
    global quiz_instance
    try:
        numeroDificuldade = int(dificuldade)
        dificuldade = StrategyEnum(numeroDificuldade)
        weighted_difficulty_strategy = get_weighted_difficulty_strategy(dificuldade)
        quiz_instance = Quiz()
        quiz_instance.difficulty_strategy = weighted_difficulty_strategy
        quiz_instance.criaQuiz("../data/perguntas.json")

        return jsonify({"message": "Quiz started"})
    except ValueError:
        return jsonify({"error": "Dificuldade não reconhecida"})

@app.route("/get-question", methods=["GET"])
def get_question():
    global quiz_instance
    next_question = quiz_instance.get_proxima_questao()
    if next_question is not None:
        return jsonify(
            {
                "message": "Next question",
                "next_question": {
                    "id": next_question.id,
                    "pergunta": next_question.pergunta,
                    "opcoes": next_question.opcoes,
                    "tema": next_question.tema,
                    "dificuldade": next_question.dificuldade.value,
                },
            }
        )
    else:
        return jsonify(
            {"message": "Quiz completed", "result": quiz_instance.resultado, "questoes_acertadas": str(quiz_instance.questoes_acertadas) + "/" + str(len(quiz_instance.vetor))}
        )

@app.route("/submit-answer", methods=["POST"])
def submit_answer():
    global quiz_instance
    data = request.get_json()
    user_ans = data.get("user_answer", "").upper()

    if user_ans != "":
        quiz_instance.avaliar_resposta(user_ans)

    return jsonify({"message": "Answer submitted"})


@app.route("/restart-quiz", methods=["GET"])
def restart_quiz():
    global quiz_instance
    quiz_instance = None  # Defina a instância do Quiz como None para reiniciar
    return jsonify({"message": "Quiz restarted"})

if __name__ == "__main__":
    app.run(debug=True)
